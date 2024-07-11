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
    try: 
        data = request.json
        
        data["alias"] = str(data["alias"].lower())
        data["contraseña"] = generate_password_hash(str(data['contraseña']))
        #data["email"] = data["email"].lower()
        data["roles"] = data["roles"]
    
    except Exception as e:
        return jsonify({"mensaje": f"Campos requeridos"}), 400
    
    #! Validar si el usuario ya existe
    if not UsuarioModel.buscar_x_alias(data["alias"])["respuesta"] is None:
        return jsonify({"mensaje": "El alias ya está en uso."}), 400
    
    #! Insertar usuario
    respuesta = UsuarioModel.crear(data=data)
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
    
    if not usuario_db:
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
    
    if not check_password_hash(usuario_db['contraseña'], contraseña):
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
    
    else:
        claims = {
            'roles': usuario_db['roles']
        }
        access_token = create_access_token(identity=alias, additional_claims=claims)
        return jsonify(access_token=access_token), 200