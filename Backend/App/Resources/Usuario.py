from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash

from App.Models import UsuarioModel
from App.Auth.Decorators import admin_required

class Usuario(Resource):
    # @jwt_required()
    def get(self, alias:str) -> dict:
        """
        Busca un usuario por su alias.
        
        Args:
            - alias (str): Alias del usuario
        
        Returns:
            - dict: Usuario encontrado (alias y roles)
        """
        
        respuesta = UsuarioModel.buscar_x_alias(alias)
        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return (f"Usuario con alias: {alias} no encontrado"), 404
            else:
                del respuesta["respuesta"]['_id']
                del respuesta["respuesta"]['contraseña']
                return {"msg": f"Usuario con ID: {respuesta}"}, 200
    
    # @jwt_required()
    # @admin_required
    def put(self, alias:str) -> dict:
        """
        Actualiza un usuario.
        
        Args:
            - alias (str): Alias del usuario
        
        Returns:
            - dict: Usuario actualizado
        """
        #! Buscar si existe el usuario
        usuario_actual = UsuarioModel.buscar_x_alias(alias)
        if not usuario_actual:
            return ({"msg": "No se encontró el usuario"}), 404
        
        #! Obtener datos a actualizar
        data = request.json
        if not data:
            return ({"msg": "Faltan datos"}), 400
        
        #! Crear diccionario con los datos a actualizar
        nuevo_usuario = {}
        
        if data.get("roles"):
            nuevo_usuario["roles"] = data["roles"]
        
        if data.get("contraseña_nueva"):
            nuevo_usuario["contraseña_nueva"] = generate_password_hash(data["contraseña_nueva"])
        
        print(nuevo_usuario)
        #! Actualizar usuario
        respuesta = UsuarioModel.actualizar(alias, nuevo_usuario)
        if respuesta["estado"]:
            return {"msg": "Usuario actualizado"}, 200
        return {"msg": respuesta["respuesta"]}, 404
    
    # @jwt_required()
    # @admin_required
    def delete(self, alias:str) -> dict:
        """
        Elimina un usuario.
        
        Args:
            - alias (str): Alias del usuario
        
        Returns:
            - dict: Usuario eliminado
        """
        #! Buscar si existe el usuario
        usuario_actual = UsuarioModel.buscar_x_alias(alias)
        if not usuario_actual:
            return ({"msg": "No se encontró el usuario"}), 404
        
        #! Eliminar usuario
        respuesta = UsuarioModel.eliminar(alias)
        if respuesta["estado"]:
            return ({"msg": "Usuario eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 404