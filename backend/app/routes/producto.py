from app.services.producto import ProductoService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

producto = Blueprint("/api/productos", __name__, url_prefix="/api/productos")
producto_service = ProductoService()


@jwt_required()
@producto.route("/<id>", methods=["GET"])
def buscar_por_id(id: str):
    return producto_service.buscar_por_id(id)


@jwt_required()
@producto.route("/<id>", methods=["PUT"])
def actualizar(id: str):
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400

    return producto_service.actualizar(id, datos)


@jwt_required()
@producto.route("/<id>", methods=["DELETE"])
def eliminar(id: str):
    return producto_service.eliminar(id)


@jwt_required()
@producto.route("", methods=["GET"])
def buscar_por_filtro():
    filtro = request.args.to_dict()
    pagina = int(request.args.get("pagina", 1))
    por_pagina = int(request.args.get("por_pagina", 10))

    if not filtro or filtro is None:
        return ({"msg": "Faltan datos"}), 400

    return producto_service.buscar_por_filtro(filtro, pagina, por_pagina)


@jwt_required()
@producto.route("", methods=["POST"])
def crear():
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400

    return producto_service.crear(datos)
