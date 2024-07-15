
import os
from flask import app, jsonify, request, send_from_directory
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from werkzeug.utils import secure_filename

class Foto(Resource):
    
    @jwt_required()
    def get(self, filename: str):
        """
        """
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

class Fotos(Resource):
    @jwt_required()
    def post():
        if 'foto' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['foto']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return jsonify({"filename": filename}), 200
        return jsonify({"error": "File type not allowed"}), 400

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS