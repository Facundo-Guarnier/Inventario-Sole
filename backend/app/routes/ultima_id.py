from app.services.ultima_id import UltimaIdService
from flask import Blueprint
from flask_jwt_extended import jwt_required

ultima_id = Blueprint("/api/ultimaid", __name__, url_prefix="/api/ultimaid")
ultima_id_service = UltimaIdService()


@jwt_required()
@ultima_id.route("/<coleccion>", methods=["GET"])
def buscar_proximo(coleccion: str):
    return ultima_id_service.buscar_proximo(coleccion)


@jwt_required()
@ultima_id.route("/<coleccion>", methods=["PUT"])
def aumentar_id(coleccion: str):
    return ultima_id_service.aumentar_id(coleccion)
