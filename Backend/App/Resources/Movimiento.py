
from datetime import datetime
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Models import MovimientoModel
from App.Auth.Decorators import admin_required


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
    # @admin_required
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
    
    # @jwt_required
    # @admin_required
    def delete(self, id:str) -> dict:
        """
        Elimina un movimiento.
        
        Args:
            - id (int): ID del movimiento
        
        Returns:
            - dict: Movimiento eliminado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        respuesta = MovimientoModel.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Movimiento eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 404


class Movimientos(Resource):
    def get(self) -> list:
        """
        Busca movimientos en base a los atributos que se pasen.
        Sin atributos, devuelve todos los movimientos.
        
        Returns:
            - list: Movimientos encontrados
        """
        
        data = request.json
        
        #! Validar data: id, movimiento, id_producto, cantidad, vendedor, comentario, fecha
        id = data.get("id")
        movimiento = data.get("movimiento")
        id_producto = data.get("id_producto")
        cantidad = data.get("cantidad")
        vendedor = data.get("vendedor")
        comentario = data.get("comentario")
        fecha = data.get("fecha")
        palabra_clave = data.get("palabra_clave")
        
        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}
        
        if id:
            filtro['id'] = id
        if movimiento:
            filtro['movimiento'] = movimiento
        if id_producto:
            filtro['id_producto'] = id_producto
        if cantidad:
            filtro['cantidad'] = cantidad
        if vendedor:
            filtro['vendedor'] = vendedor
        if comentario:
            filtro['comentario'] = comentario
        if fecha:
            filtro['fecha'] = fecha
        
        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro['$or'] = [
                {"id": {"$regex": palabra_clave, "$options": "i"}},
                {"movimiento": {"$regex": palabra_clave, "$options": "i"}},
                {"id_producto": {"$regex": palabra_clave, "$options": "i"}},
                {"cantidad": {"$regex": palabra_clave, "$options": "i"}},
                {"vendedor": {"$regex": palabra_clave, "$options": "i"}},
                {"comentario": {"$regex": palabra_clave, "$options": "i"}},
                {"fecha": {"$regex": palabra_clave, "$options": "i"}},
            ]
        
        print(filtro)
        respuesta = MovimientoModel.buscar_x_atributo(filtro)
        
        if respuesta["estado"]:
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
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