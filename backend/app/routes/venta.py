from app.services.venta import VentaService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

venta = Blueprint("/api/ventas", __name__, url_prefix="/api/ventas")
venta_service = VentaService()


# @jwt_required()
@venta.route("/<id>", methods=["GET"])
def buscar_por_id(id: str):
    return venta_service.get_by_id(id)


@jwt_required()
@venta.route("/<id>", methods=["PUT"])
def actualizar(id: str):
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400
    # if not datos.get("productos"):
    #     return ({"msg": "Faltan los productos"}), 400

    return venta_service.actualizar(id, datos)


@jwt_required()
@venta.route("/<id>", methods=["DELETE"])
def eliminar(id: str):
    return venta_service.eliminar(id)


@venta.route("", methods=["GET"])
def buscar_por_atributo():
    try:
        datos = request.args.to_dict()
        pagina = int(request.args.get("pagina", 1))
        por_pagina = int(request.args.get("por_pagina", 10))

    except Exception:
        return ({"msg": "Error en los parámetros enviados"}), 400
    return venta_service.buscar_por_atributo(datos, pagina, por_pagina)


@jwt_required()
@venta.route("", methods=["POST"])
def crear():
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400
    # if not datos.get("productos"):
    #     return ({"msg": "Faltan los productos"}), 400

    return venta_service.crear(datos)
