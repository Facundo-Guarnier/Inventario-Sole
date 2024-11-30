from datetime import timedelta

from app.models.UsuarioModel import UsuarioModel
from app.services.usuario import UsuarioService
from app.utils.decorators import admin_required
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

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


auth = Blueprint("api/auth", __name__, url_prefix="/api/auth")
usuario_model = UsuarioModel()


@auth.route("/registrar", methods=["POST"])
def registrar() -> tuple:
    """
    Registra un usuario en la base.
    """

    #! Validar campos
    if not request.json:
        return jsonify({"mensaje": "No se encontraron datos"}), 400

    datos = request.json
    if not datos["roles"]:
        return jsonify({"mensaje": "Campo requerido"}), 400
    if not datos["alias"]:
        return jsonify({"mensaje": "Campo requerido"}), 400
    if not datos["contraseña"]:
        return jsonify({"mensaje": "Campo requerido"}), 400

    usuario_nuevo = {
        "roles": datos["roles"],
        "alias": datos["alias"],
        "contraseña": generate_password_hash(datos["contraseña"]),
    }

    #! Validar si el usuario ya existe
    if usuario_model.buscar_x_alias(usuario_nuevo["alias"])["respuesta"] is not None:
        return jsonify({"mensaje": "El alias ya está en uso."}), 400

    #! Insertar usuario
    respuesta = usuario_model.crear(data=usuario_nuevo)
    if not respuesta["estado"]:
        return jsonify({"mensaje": respuesta["repuesta"]}), 500

    else:
        return jsonify({"mensaje": "Usuario creado exitosamente."}), 201


@auth.route("/acceder", methods=["POST"])
def acceder() -> tuple:
    #! Validar campos
    try:
        if not request.json:
            return jsonify({"mensaje": "No se encontraron datos"}), 400
        alias = str(request.json.get("alias"))
        contraseña = str(request.json.get("contraseña"))

    except Exception:
        return jsonify({"mensaje": "Campos requeridos"}), 400

    #! Validar usuario y contraseña
    usuario_db = usuario_model.buscar_x_alias(alias)

    if usuario_db["estado"] is False:
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

    if usuario_db["respuesta"] is None:
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

    if not check_password_hash(usuario_db["respuesta"]["contraseña"], contraseña):
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

    else:
        claims = {"roles": usuario_db["respuesta"]["roles"]}

        # Establecer la duración del token según el rol del usuario
        role = usuario_db["respuesta"]["roles"]
        if "Admin" in role:
            expires = timedelta(minutes=20)
        elif "User" in role:
            expires = timedelta(hours=8)
        else:
            expires = timedelta(hours=1)

        access_token = create_access_token(
            identity=alias, additional_claims=claims, expires_delta=expires
        )
        return jsonify(access_token=access_token), 200
