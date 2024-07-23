import base64
import io
import json
from cryptography.fernet import Fernet
import tempfile

from flask import Blueprint, current_app, jsonify, request, send_file
from .. import mongo as db_mongo

backup = Blueprint('api/bdb', __name__, url_prefix='/api/bdb')

@backup.route('/download_database')
def download_database():
    """
    Descarga la base de datos en formato JSON.
    """
    try: 
        data = {}
        for collection_name in db_mongo.db.list_collection_names():
            collection = db_mongo.db[collection_name]
            data[collection_name] = list(collection.find({}, {'_id': False}))
        
        json_data = json.dumps(data, default=str)
        
        #! Crear un objeto de archivo en memoria
        mem_file = io.BytesIO()
        mem_file.write(json_data.encode())
        mem_file.seek(0)
        
        return send_file(
            mem_file,
            as_attachment=True,
            download_name='database_dump.json',
            mimetype='application/json'
        ), 200
    
    except Exception as e:
        return jsonify({'msg': str(e)}), 500


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
