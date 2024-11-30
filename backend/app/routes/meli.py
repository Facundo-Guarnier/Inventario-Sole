import json

from app.services.meli import MeliService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

meli = Blueprint("/api/meli", __name__, url_prefix="/api/meli")


@jwt_required()
@meli.route("", methods=["GET"])
def get():
    # Crear instancia de MeliService dentro de la función
    meli_service = MeliService()

    data = request.args.to_dict()
    if not data:
        return {"msg": "Faltan datos"}, 400

    try:
        url = data["url"]
    except Exception:
        return {"msg": "Falta la URL"}, 400

    return meli_service.get(url)


@meli.route("", methods=["POST"])
def post():
    # Crear instancia de MeliService dentro de la función
    meli_service = MeliService()

    data = request.args.to_dict()
    if not data:
        return {"msg": "Faltan datos1"}, 400

    try:
        url = data["url"]
        datos = json.loads(data["datos"])
    except Exception:
        return {"msg": "Faltan datos2"}, 400

    return meli_service.post(url, datos)
