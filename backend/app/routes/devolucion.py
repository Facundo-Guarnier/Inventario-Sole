from app.services.devolucion import DevolucionService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

devolucion = Blueprint("/api/devoluciones", __name__, url_prefix="/api/devoluciones")
devolucion_service = DevolucionService()


# @jwt_required()
@devolucion.route("", methods=["GET"])
def buscar():
    palabra_clave = request.args.get("palabra_clave", None)
    tienda = request.args.get("tienda", None)
    fecha = request.args.get("fecha", None)
    pagina = int(request.args.get("pagina", 1))
    por_pagina = int(request.args.get("por_pagina", 10))

    return devolucion_service.buscar_por_filtros(
        tienda=tienda,
        fecha=fecha,
        pagina=pagina,
        por_pagina=por_pagina,
        palabra_clave=palabra_clave,
    )


@jwt_required()
@devolucion.route("", methods=["POST"])
def crear():
    datos = request.json
    if not datos:
        return {"msg": "Faltan datos"}, 400

    return devolucion_service.crear(datos)
