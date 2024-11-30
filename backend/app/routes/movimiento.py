from app.services.movimiento import MovimientoService
from app.utils.decorators import admin_required
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

movimiento = Blueprint("/api/movimientos", __name__, url_prefix="/api/movimientos")
movimiento_service = MovimientoService()


@jwt_required()
@movimiento.route("/<id>", methods=["GET"])
def buscar_por_id(id: str):
    return movimiento_service.buscar_por_id(id)


@jwt_required()
@admin_required
@movimiento.route("/<id>", methods=["PUT"])
def actualizar(id: str):
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400
    if not datos.get("roles"):
        return ({"msg": "Faltan los roles"}), 400

    return movimiento_service.actualizar(id, datos)


@jwt_required()
@admin_required
@movimiento.route("/<id>", methods=["DELETE"])
def eliminar(id: str):
    return movimiento_service.eliminar(id)


@jwt_required()
@movimiento.route("", methods=["GET"])
def buscar_todos():
    #! Validar data
    try:
        pagina = int(request.args.get("pagina", 1))
        por_pagina = int(request.args.get("por_pagina", 10))

    except Exception:
        return ({"msg": "Error en los parámetros enviados"}), 400

    try:
        filtro = request.json
        if not filtro:
            filtro = {}
    except Exception:
        filtro = {}

    return movimiento_service.buscar_x_atributo(filtro, pagina, por_pagina)


@jwt_required()
@movimiento.route("", methods=["POST"])
def crear():
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400

    return movimiento_service.crear(datos)
