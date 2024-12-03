import base64
import io
import json
import os
import shutil

from app.db import mongo
from app.utils.decorators import admin_required
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from flask import Blueprint, current_app, jsonify, request, send_file
from werkzeug.utils import secure_filename

backup = Blueprint("api/bdb", __name__, url_prefix="/api/bdb")


@backup.route("/download_database")
@admin_required
def download_database() -> tuple:
    """
    Descarga la base de datos en formato JSON y la encripta.
    """
    try:
        #! Obtener la contraseña de app.config
        backup_password = current_app.config.get("CONTRA_BACKUP")
        if not backup_password:
            return jsonify({"msg": "Contraseña de backup no configurada"}), 500

        #! Generar la clave Fernet a partir de la contraseña
        fernet_key = get_fernet_key(backup_password)
        fernet = Fernet(fernet_key)

        data = {}
        for collection_name in mongo.db.list_collection_names():
            collection = mongo.db[collection_name]
            data[collection_name] = list(collection.find({}, {"_id": False}))

        #! Añadir datos de imágenes
        uploads_path = str(current_app.config.get("UPLOAD_FOLDER"))
        data["images"] = list(get_images_data(uploads_path).values())

        json_data = json.dumps(data, default=str)

        #! Encriptar los datos
        encrypted_data = fernet.encrypt(json_data.encode())

        #! Crear un objeto de archivo en memoria
        mem_file = io.BytesIO()
        mem_file.write(encrypted_data)
        mem_file.seek(0)

        return (
            send_file(
                mem_file,
                as_attachment=True,
                download_name="encrypted_database_dump.bin",
                mimetype="application/octet-stream",
            ),
            200,
        )

    except Exception as e:
        return jsonify({"msg": str(e)}), 500


@backup.route("/upload_database", methods=["POST"])
@admin_required
def upload_database() -> tuple:
    """
    Recibe un archivo de base de datos encriptado (.bin), lo desencripta y lo aplica a la base de datos.
    """
    # try:
    if "file" not in request.files:
        return jsonify({"msg": "No se encontró archivo en la solicitud"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"msg": "No se seleccionó ningún archivo"}), 400

    if file and file.filename and file.filename.endswith(".bin"):
        filename = secure_filename(file.filename or "")
        file_path = os.path.join("/tmp", filename)
        file.save(file_path)

        #! Desencriptar y aplicar el archivo
        apply_encrypted_database(file_path)

        #! Eliminar el archivo temporal
        os.remove(file_path)

        return jsonify({"msg": "Base de datos cargada y aplicada con éxito"}), 200
    else:
        return jsonify({"msg": "El archivo debe tener extensión .bin"}), 400

    # except Exception as e:
    #     return jsonify({"msg": str(e)}), 500


def get_fernet_key(password: str) -> bytes:
    """
    Genera una clave Fernet a partir de una contraseña.
    """
    password_bytes = password.encode()
    salt = b"salt_"
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password_bytes))


def apply_encrypted_database(file_path: str) -> None:
    """
    Desencripta el archivo de la base de datos y aplica los cambios a MongoDB.
    """
    # try:
    #! Obtener la contraseña de app.config
    backup_password = current_app.config.get("CONTRA_BACKUP")
    if not backup_password:
        raise ValueError("Contraseña de backup no configurada")

    #! Generar la clave Fernet a partir de la contraseña
    fernet_key = get_fernet_key(backup_password)
    fernet = Fernet(fernet_key)

    #! Leer y desencriptar el archivo
    with open(file_path, "rb") as file:
        encrypted_data = file.read()
        decrypted_data = fernet.decrypt(encrypted_data)

    #! Cargar los datos JSON
    data = json.loads(decrypted_data.decode())

    #! Aplicar datos a MongoDB
    for collection_name, documents in data.items():
        if collection_name != "images":
            collection = mongo.db[collection_name]
            collection.delete_many({})
            if documents:
                collection.insert_many(documents)

    #! Restaurar imágenes
    if "images" in data:
        uploads_path = str(current_app.config.get("UPLOAD_FOLDER"))
        # Limpiar la carpeta de uploads
        shutil.rmtree(uploads_path)
        os.makedirs(uploads_path)
        save_images_data(data["images"], uploads_path)

    # except Exception as e:
    #     raise Exception(f"Error al aplicar la base de datos: {str(e)}") from e


def get_images_data(uploads_path: str) -> dict:
    """
    Obtiene los datos de las imágenes en la carpeta de uploads.
    """
    images_data = {}
    for root, _, files in os.walk(uploads_path):
        for file in files:
            if file.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, uploads_path)
                with open(file_path, "rb") as img_file:
                    images_data[relative_path] = base64.b64encode(
                        img_file.read()
                    ).decode("utf-8")
    return images_data


def save_images_data(images_data: dict, uploads_path: str) -> None:
    """
    Guarda las imágenes en la carpeta de uploads.
    """
    if images_data:
        for relative_path, img_data in images_data.items():
            file_path = os.path.join(uploads_path, relative_path)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as img_file:
                img_file.write(base64.b64decode(img_data))
