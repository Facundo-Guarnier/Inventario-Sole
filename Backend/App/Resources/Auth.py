from flask import request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from App.Models import UsuarioModel

class Auth:
    
    def register(self) -> dict:
        data = request.json
        
        data['password'] = generate_password_hash(data['password'])
        
        try:
            UsuarioModel.put_registrar(data=data)
            return jsonify({"mensaje": "Usuario creado exitosamente."}), 201
        
        except ValueError as e:
            return jsonify({"mensaje": str(e)}), 400


    def login(self):
        username = request.json.get('usuario')
        password = request.json.get('contraseña')
        
        usuario = UsuarioModel.get_acceder(username)
        
        if not usuario:
            return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
        
        if not check_password_hash(usuario['contraseña'], password):
            return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
        
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200