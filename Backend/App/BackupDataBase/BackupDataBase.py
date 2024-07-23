import base64, io, json, os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from werkzeug.utils import secure_filename

from flask import Blueprint, current_app, jsonify, request, send_file
from .. import mongo as db_mongo

backup = Blueprint('api/bdb', __name__, url_prefix='/api/bdb')


@backup.route('/download_database')
def download_database():
    """
    Descarga la base de datos en formato JSON y la encripta.
    """
    try: 
        #! Obtener la contraseña de app.config
        backup_password = current_app.config.get('CONTRA_BACKUP')
        if not backup_password:
            return jsonify({'msg': 'Contraseña de backup no configurada'}), 500
        
        #! Generar la clave Fernet a partir de la contraseña
        fernet_key = get_fernet_key(backup_password)
        fernet = Fernet(fernet_key)
        
        data = {}
        for collection_name in db_mongo.db.list_collection_names():
            collection = db_mongo.db[collection_name]
            data[collection_name] = list(collection.find({}, {'_id': False}))
        
        json_data = json.dumps(data, default=str)
        
        #! Encriptar los datos
        encrypted_data = fernet.encrypt(json_data.encode())
        
        #! Crear un objeto de archivo en memoria
        mem_file = io.BytesIO()
        mem_file.write(encrypted_data)
        mem_file.seek(0)
        
        return send_file(
            mem_file,
            as_attachment=True,
            download_name='encrypted_database_dump.bin',
            mimetype='application/octet-stream'
        ), 200
    
    except Exception as e:
        return jsonify({'msg': str(e)}), 500


@backup.route('/upload_database', methods=['POST'])
def upload_database():
    """
    Recibe un archivo de base de datos encriptado (.bin), lo desencripta y lo aplica a la base de datos.
    """
    try:
        if 'file' not in request.files:
            return jsonify({'msg': 'No se encontró archivo en la solicitud'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'msg': 'No se seleccionó ningún archivo'}), 400
        
        if file and file.filename.endswith('.bin'):
            filename = secure_filename(file.filename)
            file_path = os.path.join('/tmp', filename)
            file.save(file_path)
            
            #! Desencriptar y aplicar el archivo
            apply_encrypted_database(file_path)
            
            #! Eliminar el archivo temporal
            os.remove(file_path)
            
            return jsonify({'msg': 'Base de datos cargada y aplicada con éxito'}), 200
        else:
            return jsonify({'msg': 'El archivo debe tener extensión .bin'}), 400
    
    except Exception as e:
        return jsonify({'msg': str(e)}), 500


def get_fernet_key(password):
    """
    Genera una clave Fernet a partir de una contraseña.
    """
    password = password.encode()
    salt = b'salt_'
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password))
    return key


def apply_encrypted_database(file_path):
    """
    Desencripta el archivo de la base de datos y aplica los cambios a MongoDB.
    """
    try:
        #! Obtener la contraseña de app.config
        backup_password = current_app.config.get('CONTRA_BACKUP')
        if not backup_password:
            raise ValueError('Contraseña de backup no configurada')
        
        #! Generar la clave Fernet a partir de la contraseña
        fernet_key = get_fernet_key(backup_password)
        fernet = Fernet(fernet_key)
        
        #! Leer y desencriptar el archivo
        with open(file_path, 'rb') as file:
            encrypted_data = file.read()
            decrypted_data = fernet.decrypt(encrypted_data)
        
        #! Cargar los datos JSON
        data = json.loads(decrypted_data.decode())
        
        #! Aplicar los datos a MongoDB
        for collection_name, documents in data.items():
            collection = db_mongo.db[collection_name]
            
            #! Eliminar todos los documentos existentes
            collection.delete_many({})
            
            #! Insertar los nuevos documentos
            if documents:
                collection.insert_many(documents)
    
    except Exception as e:
        raise Exception(f"Error al aplicar la base de datos: {str(e)}")