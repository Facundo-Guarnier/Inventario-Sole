import os
from flask import current_app, request, send_from_directory
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from werkzeug.utils import secure_filename

from PIL import Image
import io

class Foto(Resource):
    def get(self, id_prod, filename):
        try:
            upload_folder = current_app.config['UPLOAD_FOLDER']
            return send_from_directory(upload_folder, os.path.join(id_prod,filename))
        except FileNotFoundError:
            return {"error": "Archivo no encontrado"}, 404
        except Exception as e:
            current_app.logger.error(f"Error al obtener la foto: {str(e)}")
            return {"error": "Error interno del servidor"}, 500

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class Fotos(Resource):
    @jwt_required()
    def post(self):
        if 'foto' not in request.files:
            return {"error": "No se encontró la parte del archivo"}, 400
        
        file = request.files['foto']
        if file.filename == '':
            return {"error": "No se seleccionó ningún archivo"}, 400
        
        if file and allowed_file(file.filename):
            #! Obtener el ID del producto
            producto_id = request.form.get('producto_id')
            if not producto_id:
                return {"error": "No se proporcionó el ID del producto"}, 400
            
            #! Crear el directorio si no existe
            upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], producto_id)
            os.makedirs(upload_folder, exist_ok=True)
            
            #! Procesar y guardar la imagen redimensionada
            filename = secure_filename(file.filename)
            resized_filename = f"resized_{filename}"
            file_path = os.path.join(upload_folder, resized_filename)
            
            #! Redimensionar la imagen
            img = Image.open(file.stream)
            size = min(img.size)
            left = (img.width - size) / 2
            top = (img.height - size) / 2
            right = (img.width + size) / 2
            bottom = (img.height + size) / 2
            img = img.crop((left, top, right, bottom))
            img = img.resize(current_app.config['IMG_SIZE'], Image.LANCZOS)
            
            #! Guardar como JPEG con calidad ajustada
            img = img.convert('RGB')
            img.save(file_path, 'JPEG', quality=current_app.config["IMG_QUALITY"], optimize=True)
            
            return {"filename": os.path.join(producto_id, resized_filename)}, 201
        
        return {"error": "Tipo de archivo no permitido"}, 400