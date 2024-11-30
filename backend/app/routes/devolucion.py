from app.services.devolucion import DevolucionService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

devolucion = Blueprint("/api/devoluciones", __name__, url_prefix="/api/devoluciones")
devolucion_service = DevolucionService()


# @jwt_required()
@devolucion.route("", methods=["GET"])
def buscar():
    #! Paginación
    pagina = int(request.args.get("pagina", 1))
    por_pagina = int(request.args.get("por_pagina", 10))

    return devolucion_service.buscar_todas(pagina, por_pagina)


@jwt_required()
@devolucion.route("", methods=["POST"])
def crear():
    datos = request.json
    if not datos:
        return {"msg": "Faltan datos"}, 400

    return devolucion_service.crear(datos)
