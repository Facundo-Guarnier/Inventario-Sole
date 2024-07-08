from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt

from App.Models import UsuarioModel

class Usuario(Resource):
    
    
    def get(self, alias:str) -> dict:
        """
        Busca un usuario por su alias.
        
        Args:
            - alias (str): Alias del usuario
        
        Returns:
            - dict: Usuario encontrado (alias y roles)
        """
        
        respuesta = UsuarioModel.get_alias(alias)
        del respuesta['_id']
        del respuesta['contraseña']
        return f"Usuario con ID: {respuesta}"
    
    
    @jwt_required()
    def put(self) -> dict:
        """
            Actualiza un usuario.
            En base al JWT, se busca el usuario y con los datos que se pasan se actualiza.
        """
        pass