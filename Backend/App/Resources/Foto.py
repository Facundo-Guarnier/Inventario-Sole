import os
from flask import current_app, request, send_from_directory
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from werkzeug.utils import secure_filename


class Foto(Resource):
    
    @jwt_required()
    def get(self, filename) -> dict:
        response = ({"filename": filename})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        return ({"msg": response}), 201


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}
    
class Fotos(Resource):

    @jwt_required()
    def post(self) -> dict:
        # if 'foto' not in request.files:
        #     return ({"msg": "No se encontró la foto"}), 400

        # file = request.files['foto']
        # if file.filename == '':
        #     return ({"msg": "No se seleccionó ninguna foto"}), 400

        # if file and allowed_file(file.filename):
        #     filename = secure_filename(file.filename)
        #     file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        #     return ({"filename": filename}), 201

        # return ({"msg": "Tipo de archivo no permitido"}), 400
        
        if 'foto' not in request.files:
            return ({"error": "No file part"}), 400
        file = request.files['foto']
        if file.filename == '':
            return ({"error": "No selected file"}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            return ({"filename": filename}), 200
        return ({"error": "File type not allowed"}), 400