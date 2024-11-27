from app.auth.decorators import admin_required
from app.services.usuario import UsuarioService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

usuario = Blueprint("/api/usuarios", __name__, url_prefix="/api/usuarios")
usuario_service = UsuarioService()


@jwt_required()
@usuario.route("/<alias>", methods=["GET"])
def buscar_por_alias(alias: str):
    return usuario_service.buscar_por_alias(alias)


@jwt_required()
@admin_required
@usuario.route("/<alias>", methods=["PUT"])
def actualizar(alias: str):
    datos = request.json
    if not datos or datos is None:
        return ({"msg": "Faltan datos"}), 400
    if not datos.get("roles"):
        return ({"msg": "Faltan los roles"}), 400

    return usuario_service.actualizar(alias, datos)


@jwt_required()
@admin_required
@usuario.route("/<alias>", methods=["DELETE"])
def eliminar(alias: str):
    return usuario_service.eliminar(alias)


@jwt_required()
@admin_required
@usuario.route("", methods=["GET"])
def buscar_todos():
    try:
        pagina = int(request.args.get("pagina", 1))
        por_pagina = int(request.args.get("por_pagina", 10))

    except Exception:
        return ({"msg": "Error en los parámetros enviados"}), 400
    return usuario_service.buscar_todos(pagina, por_pagina)
