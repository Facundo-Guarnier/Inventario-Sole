from app.services.producto import ProductoService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

producto = Blueprint("/api/productos", __name__, url_prefix="/api/productos")
producto_service = ProductoService()


@producto.route("/<id>", methods=["GET"])
@jwt_required()
def buscar_por_id(id: str):
    return producto_service.buscar_por_id(id)


@producto.route("/<id>", methods=["PUT"])
@jwt_required()
def actualizar(id: str):
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400

    return producto_service.actualizar(id, datos)


@producto.route("/<id>", methods=["DELETE"])
@jwt_required()
def eliminar(id: str):
    return producto_service.eliminar(id)


@producto.route("", methods=["GET"])
@jwt_required()
def buscar_por_filtro():
    filtro = request.args.to_dict()
    pagina = int(request.args.get("pagina", 1))
    por_pagina = int(request.args.get("por_pagina", 10))

    if not filtro or filtro is None:
        return ({"msg": "Faltan datos"}), 400

    return producto_service.buscar_por_filtro(filtro, pagina, por_pagina)


@producto.route("", methods=["POST"])
@jwt_required()
def crear():
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400

    return producto_service.crear(datos)
