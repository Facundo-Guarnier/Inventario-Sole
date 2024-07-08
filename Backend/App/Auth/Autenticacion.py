from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from App.Models import UsuarioModel

auth = Blueprint('api/auth', __name__, url_prefix='/api/auth')


@auth.route('/register', methods=['POST'])
def post() -> dict:
    
    #! Validar campos
    try: 
        data = request.json
        
        data["alias"] = data["alias"].lower()
        data["contraseña"] = generate_password_hash(data['contraseña'])
        #data["email"] = data["email"].lower()
        data["roles"] = ["user"]
    
    except Exception as e:
        return jsonify({"mensaje": f"Campos requeridos"}), 400
    

    #! Validar si el usuario ya existe
    if UsuarioModel.get_alias(data["alias"]):
        return jsonify({"mensaje": "El alias ya está en uso."}), 400
    
    #! Insertar usuario
    respuesta = UsuarioModel.register(data=data)
    if not respuesta["estado"]:
        return jsonify({"mensaje": respuesta["repuesta"]}), 500

    else:
        return jsonify({"mensaje": "Usuario creado exitosamente."}), 201
    return jsonify({"mensaje": data}), 200



# def login():
#     username = request.json.get('usuario')
#     password = request.json.get('contraseña')
    
#     usuario = UsuarioModel.get_acceder(username)
    
#     if not usuario:
#         return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
    
#     if not check_password_hash(usuario['contraseña'], password):
#         return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
    
#     access_token = create_access_token(identity=username)
#     return jsonify(access_token=access_token), 200