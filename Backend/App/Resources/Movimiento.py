
from datetime import datetime
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Models import MovimientoModel

class Movimiento(Resource):
    
    def get(self, id:str) -> dict:
        """
        Busca un movimiento por su id.
        
        Args:
            - id (int): ID del movimiento
        
        Returns:
            - dict: Movimiento encontrado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        respuesta = MovimientoModel.buscar_x_atributo({"id": id})
        if respuesta["estado"]:
            if respuesta["respuesta"] == None:
                return ({"msg": "No se encontró el movimiento"}), 404
            return ({"msg":respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    
    # @jwt_required()
    def put(self, id:str) -> dict:
        """
        Actualiza un movimiento.
        
        Args:
            - id (int): ID del movimiento
        
        Returns:
            - dict: Movimiento actualizado
        """
        #! Verificar si se puede actualizar el ID
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        movimiento = MovimientoModel.buscar_x_atributo(id)
        if not movimiento:
            return ({"msg": "No se encontró el movimiento"}), 404
        
        #! Verificar si existe y si es correcta la data
        data = request.json
        if not data:
            return ({"msg": "Faltan datos"}), 400
        
        nuevo_movimiento = {}
        
        if data.get("movimiento"):
            nuevo_movimiento["movimiento"] = data["movimiento"]
        
        if data.get("id_producto"):
            nuevo_movimiento["id_producto"] = data["id_producto"]
        
        if data.get("cantidad"):
            nuevo_movimiento["cantidad"] = data["cantidad"]
        
        if data.get("vendedor"):
            nuevo_movimiento["vendedor"] = data["vendedor"]
            
        if data.get("comentario"):
            nuevo_movimiento["comentario"] = data["comentario"]
        
        #! Actualizar 
        respuesta = MovimientoModel.actualizar(id, nuevo_movimiento)
        if respuesta["estado"]:
            return ({"msg": "Movimiento actualizado"}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    
    def delete(self, id:str) -> dict:
        """
        Elimina un movimiento.
        
        Args:
            - id (int): ID del movimiento
        
        Returns:
            - dict: Movimiento eliminado
        """
        #TODO Revisar
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        respuesta = MovimientoModel.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Movimiento eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 404


class Movimientos(Resource):
    
    def get(self) -> list:
        """
        Busca movimientos.
        
        Returns:
            - list: Movimientos encontrados
        """
        #TODO Revisar
        filtro = request.json
        if not filtro:
            return ({"msg": "Faltan datos"}), 400
        
        respuesta = MovimientoModel.buscar_x_atributo(filtro)
        if respuesta:
            return ({"msg":respuesta}), 200
        return ({"msg": "No se encontraron movimientos"}), 404
    
    
    # @jwt_required()
    def post(self) -> dict:
        """
        Crea un movimiento.
        
        Returns:
            - dict: Movimiento creado
        """
        data = request.json
        if not data:
            return ({"msg": "Faltan datos"}), 400
        
        id = data.get("id")
        movimiento = data.get("movimiento")
        id_producto = data.get("id_producto")
        cantidad = data.get("cantidad")
        vendedor = data.get("vendedor")
        comentario = data.get("comentario")
        
        if not id or \
        not movimiento or \
        not id_producto or \
        not cantidad or \
        not vendedor:
            return ({"msg": "Faltan datos"}), 400
        
        
        respuesta = MovimientoModel.crear(
            {
                "id": id,
                "movimiento": movimiento,
                "id_producto": id_producto,
                "cantidad": cantidad,
                "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  #! Ej: 2021-09-01 12:00:00
                "vendedor": vendedor,
                "comentario": comentario,
            }
        )
        if respuesta["estado"]:
            return ({"msg": "Movimiento creado"}), 201
        return ({"msg": respuesta["respuesta"]}), 404