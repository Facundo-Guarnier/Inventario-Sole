from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from App.Models import UsuarioModel

auth = Blueprint('api/auth', __name__, url_prefix='/api/auth')


@auth.route('/registrar', methods=['POST'])
def registrar() -> dict:
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
        "contraseña": generate_password_hash(datos["contraseña"])
    }
    
    #! Validar si el usuario ya existe
    if not UsuarioModel.buscar_x_alias(usuario_nuevo["alias"])["respuesta"] is None:
        return jsonify({"mensaje": "El alias ya está en uso."}), 400
    
    #! Insertar usuario
    respuesta = UsuarioModel.crear(data=usuario_nuevo)
    if not respuesta["estado"]:
        return jsonify({"mensaje": respuesta["repuesta"]}), 500
    
    else:
        return jsonify({"mensaje": "Usuario creado exitosamente."}), 201
    return jsonify({"mensaje": data}), 200


@auth.route('/acceder', methods=['POST'])
def acceder():
    #! Validar campos
    try: 
        alias = str(request.json.get('alias')).lower()
        contraseña = str(request.json.get('contraseña'))
    
    except Exception as e:
        return jsonify({"mensaje": "Campos requeridos"}), 400
    
    #! Validar usuario y contraseña
    usuario_db = UsuarioModel.buscar_x_alias(alias)
    
    if usuario_db["estado"] is False:
        return jsonify({"msg": "Usuario o contraseña incorrectos1"}), 401
    if usuario_db["respuesta"] is None:
        return jsonify({"msg": "Usuario o contraseña incorrectos2"}), 401

    
    if not check_password_hash(usuario_db["respuesta"]['contraseña'], contraseña):
        return jsonify({"msg": "Usuario o contraseña incorrectos3"}), 401
    
    else:
        claims = {
            'roles': usuario_db["respuesta"]['roles']
        }
        access_token = create_access_token(identity=alias, additional_claims=claims)
        return jsonify(access_token=access_token), 200