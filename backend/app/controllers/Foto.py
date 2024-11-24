import os

from flask import current_app, request, send_from_directory
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from PIL import Image
from werkzeug.utils import secure_filename


class Foto(Resource):
    def get(self, id_prod, filename):
        try:
            upload_folder = current_app.config["UPLOAD_FOLDER"]
            return send_from_directory(upload_folder, os.path.join(id_prod, filename))
        except FileNotFoundError:
            return {"error": "Archivo no encontrado"}, 404
        except Exception as e:
            current_app.logger.error(f"Error al obtener la foto: {str(e)}")
            return {"error": "Error interno del servidor"}, 500

    def eliminar_fotos_viejas_producto(self, id_prod: str, fotos_nuevas: list) -> None:
        """
        Borra todas las votos que no estén en la lista de fotos_nuevas de la carpeta del producto.

        Args:
            - id_prod (str): ID del producto.
            - fotos_nuevas (list): Lista de nombres de las fotos nuevas. Ej: [resized_Pic_20240204_165151_4096x2160.png', ...]
        """
        try:
            upload_folder = current_app.config["UPLOAD_FOLDER"]
            product_folder = os.path.join(upload_folder, id_prod)
            for file in os.listdir(product_folder):
                if file not in fotos_nuevas:
                    os.remove(os.path.join(product_folder, file))
        except Exception as e:
            current_app.logger.error(f"Error al eliminar fotos antiguas: {str(e)}")


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


class Fotos(Resource):
    @jwt_required()
    def post(self):
        if "foto" not in request.files:
            return {"error": "No se encontró la parte del archivo"}, 400

        file = request.files["foto"]
        if file.filename == "":
            return {"error": "No se seleccionó ningún archivo"}, 400

        if file and allowed_file(file.filename):
            #! Obtener el ID del producto
            producto_id = request.form.get("producto_id")
            if not producto_id:
                return {"error": "No se proporcionó el ID del producto"}, 400

            #! Crear el directorio si no existe
            upload_folder = os.path.join(
                current_app.config["UPLOAD_FOLDER"], producto_id
            )
            os.makedirs(upload_folder, exist_ok=True)

            #! Cambiar la extensión a .jpg
            filename = secure_filename(file.filename)
            base_filename = os.path.splitext(filename)[0]
            new_filename = f"resized_{base_filename}.jpg"
            file_path = os.path.join(upload_folder, new_filename)

            #! Procesar la imagen
            img = Image.open(file.stream)

            #! Convertir a RGB si es necesario (para manejar imágenes PNG con transparencia)
            if img.mode in ("RGBA", "LA") or (
                img.mode == "P" and "transparency" in img.info
            ):
                bg = Image.new("RGB", img.size, (255, 255, 255))
                bg.paste(
                    img, mask=img.split()[3] if img.mode == "RGBA" else img.split()[1]
                )
                img = bg

            #! Redimensionar la imagen
            img = Image.open(file.stream)
            size = min(img.size)
            left = (img.width - size) / 2
            top = (img.height - size) / 2
            right = (img.width + size) / 2
            bottom = (img.height + size) / 2
            img = img.crop((left, top, right, bottom))
            img = img.resize(current_app.config["IMG_SIZE"], Image.LANCZOS)

            #! Guardar como JPEG con calidad ajustada
            img = img.convert("RGB")
            img.save(
                file_path,
                "JPEG",
                quality=current_app.config["IMG_QUALITY"],
                optimize=True,
            )

            return {"filename": os.path.join(producto_id, new_filename)}, 201

        return {"error": "Tipo de archivo no permitido"}, 400
