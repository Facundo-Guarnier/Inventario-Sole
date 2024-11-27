import json

from app.services.meli import MeliService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

meli = Blueprint("/api/meli", __name__, url_prefix="/api/meli")
meli_service = MeliService()


@jwt_required()
@meli.route("", methods=["GET"])
def get():
    data = request.args.to_dict()
    if not data:
        return {"msg": "Faltan datos"}, 400

    try:
        url = data["url"]
    except Exception:
        return {"msg": "Falta la URL"}, 400

    return meli_service.get(url)


# @jwt_required()
# @admin_required
@meli.route("", methods=["POST"])
def post():
    data = request.args.to_dict()
    if not data:
        return {"msg": "Faltan datos1"}, 400

    try:
        url = data["url"]
        datos = json.loads(data["datos"])
    except Exception:
        return {"msg": "Faltan datos2"}, 400

    return meli_service.post(url, datos)
