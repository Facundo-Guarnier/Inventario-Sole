import base64
import json
from cryptography.fernet import Fernet
import tempfile

from flask import Blueprint, current_app, jsonify, request, send_file
from .. import mongo as db_mongo

backup = Blueprint('api/bdb', __name__, url_prefix='/api/bdb')

@backup.route('/download_database')
def download_database():
    
    try:
        key = current_app.config['CONTRA_BACKUP']
        print("++++++++++++++++", key)
        # Asegurarse de que la clave esté correctamente codificada
        if not isinstance(key, bytes):
            key = key.encode('utf-8')
        key = base64.urlsafe_b64encode(base64.urlsafe_b64decode(key))
        fernet = Fernet(key)
    
    except Exception as e:
        return jsonify({"error": f"Error al inicializar Fernet: {str(e)}"}), 500
    
    print("Fernet inicializado correctamente")
    # Obtén todos los documentos de todas las colecciones
    database_data = {}
    for collection_name in db_mongo.list_collection_names():
        collection = db_mongo[collection_name]
        database_data[collection_name] = list(collection.find({}, {'_id': False}))
    
    # Convierte los datos a JSON
    json_data = json.dumps(database_data)
    
    # Encripta los datos
    encrypted_data = fernet.encrypt(json_data.encode())
    
    # Guarda los datos encriptados en un archivo temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix='.enc') as temp_file:
        temp_file.write(encrypted_data)
        temp_file_path = temp_file.name
    
    # Envía el archivo para descarga
    return send_file(
        temp_file_path, 
        as_attachment=True, 
        download_name='database_backup.enc',
        mimetype='application/octet-stream',
        ), 200

@backup.route('/upload_database', methods=['POST'])
def upload_database():
    
    try:
        fernet = Fernet(current_app.config['CONTRA_BACKUP'].encode())
    except ValueError:
        return jsonify({"error": str(e)}), 500
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        try:
            # Leer y desencriptar el archivo
            encrypted_data = file.read()
            decrypted_data = fernet.decrypt(encrypted_data)
            database_data = json.loads(decrypted_data.decode())
            
            # Sobrescribir la base de datos existente
            for collection_name, documents in database_data.items():
                # Eliminar la colección existente
                db_mongo[collection_name].drop()
                
                # Insertar los nuevos documentos
                if documents:  # Verificar si hay documentos para insertar
                    db_mongo[collection_name].insert_many(documents)
            
            return jsonify({'message': 'Database restored successfully'}), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
