import os
from flask import current_app, request, send_from_directory
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from werkzeug.utils import secure_filename

class Foto(Resource):
    @jwt_required()
    def get(self, filename):
        try:
            upload_folder = current_app.config['UPLOAD_FOLDER']
            return send_from_directory(upload_folder, filename)
        except FileNotFoundError:
            return {"error": "Archivo no encontrado"}, 404
        except Exception as e:
            current_app.logger.error(f"Error al obtener la foto: {str(e)}")
            return {"error": "Error interno del servidor"}, 500

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
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
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            return {"filename": filename}, 201
        return {"error": "Tipo de archivo no permitido"}, 400