from app.services.foto import FotoService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

foto = Blueprint("/api/fotos", __name__, url_prefix="/api/fotos")
foto_service = FotoService()


@jwt_required()
@foto.route("/<id_prod>/<filename>", methods=["GET"])
def buscar_foto(id_prod: str, filename: str):
    return foto_service.get_by_id_and_filename(id_prod, filename)


@jwt_required()
@foto.route("", methods=["POST"])
def subir_foto():
    if "foto" not in request.files:
        return {"error": "No se encontró la parte del archivo"}, 400

    file = request.files["foto"]
    if file.filename == "":
        return {"error": "No se seleccionó ningún archivo"}, 400

    if not file and not foto_service.allowed_file(file.filename):
        return {"error": "Tipo de archivo no permitido"}, 400

    #! Obtener el ID del producto
    producto_id = request.form.get("producto_id")
    if not producto_id:
        return {"error": "No se proporcionó el ID del producto"}, 400

    return foto_service.subir_foto(file=file, producto_id=producto_id)
