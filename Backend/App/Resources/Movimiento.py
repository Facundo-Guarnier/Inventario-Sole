
from datetime import datetime
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Models import MovimientoModel
from App.Auth.Decorators import admin_required
from App.Resources.UltimaID import UltimaID


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
    
    @jwt_required()
    @admin_required
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
            nuevo_movimiento["id_producto"] = data["id_producto"].upper()
        
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
    
    @jwt_required
    @admin_required
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
    def __init__(self) -> None:
        self.ultima_id_resource = UltimaID()
    
    
    def get(self) -> list:
        """
        Busca movimientos en base a los atributos que se pasen.
        Sin atributos, devuelve todos los movimientos.
        
        Returns:
            - list: Movimientos encontrados
        """
        data = request.args.to_dict()
        
        #! Validar data
        try:
            id = data.get("id")
            movimiento = data.get("movimiento")
            id_producto = data.get("idProducto")
            cantidad = data.get("cantidad")
            vendedor = data.get("vendedor")
            comentario = data.get("comentario")
            fecha = data.get("fecha")
            palabra_clave = data.get("palabra_clave")
            
            pagina = int(request.args.get('pagina', 1))
            por_pagina = int(request.args.get('por_pagina', 10))
        
        except Exception as e:
            return ({"msg": "Error en los parámetros enviados"}), 400
        
        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}
        
        if id:
            filtro['id'] = id
        if movimiento:
            filtro['movimiento'] = movimiento
        if id_producto:
            filtro['idProducto'] = id_producto
        if cantidad:
            filtro['cantidad'] = cantidad
        if vendedor:
            filtro['vendedor'] = vendedor
        if comentario:
            filtro['comentario'] = comentario
        if fecha:
            fecha_inicio, fecha_fin = fecha.split(' al ')
            fecha_inicio = datetime.strptime(fecha_inicio, '%d-%m-%Y')
            fecha_fin = datetime.strptime(fecha_fin, '%d-%m-%Y').replace(hour=23, minute=59, second=59)
            filtro['fecha'] = {
                '$gte': fecha_inicio.strftime('%Y-%m-%d %H:%M:%S'),
                '$lte': fecha_fin.strftime('%Y-%m-%d %H:%M:%S')
            }
        
        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro['$or'] = [
                {"id": {"$regex": palabra_clave, "$options": "i"}},
                {"movimiento": {"$regex": palabra_clave, "$options": "i"}},
                {"idProducto": {"$regex": palabra_clave, "$options": "i"}},
                {"cantidad": {"$regex": palabra_clave, "$options": "i"}},
                {"vendedor": {"$regex": palabra_clave, "$options": "i"}},
                {"comentario": {"$regex": palabra_clave, "$options": "i"}},
                {"fecha": {"$regex": palabra_clave, "$options": "i"}},
            ]
        
        #! Paginación
        saltear = (pagina - 1) * por_pagina
        cantidad_total = MovimientoModel.total(filtro=filtro)
        
        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] == None:
                return ({"msg": "Error al cargar el total de ventas"}), 400
            else:
                cantidad_total = cantidad_total["respuesta"] 
        else: 
            return {"msg": cantidad_total["respuesta"]}, 404
        
        #! Buscar
        respuesta = MovimientoModel.buscar_x_atributo(
            filtro=filtro, 
            saltear=saltear, 
            por_pagina=por_pagina,
        )
        
        if respuesta["estado"]:
            return {
                "msg": respuesta["respuesta"],
                "total": cantidad_total,
                }, 200
        return {"msg": respuesta["respuesta"]}, 404
    
    @jwt_required()
    def post(self) -> dict:
        """
        Crea un movimiento.
        
        Returns:
            - dict: Movimiento creado
        """
        data = request.json
        if not data:
            return ({"msg": "Faltan datos"}), 400
        
        movimiento = data.get("movimiento")
        id_producto = data.get("idProducto")
        cantidad = data.get("cantidad")
        vendedor = data.get("vendedor")
        comentario = data.get("comentario")
        
        if not movimiento or \
        not id_producto or \
        not cantidad or \
        not vendedor:
            return ({"msg": "Faltan datos"}), 400
        
        respuesta = MovimientoModel.crear(
            {
                "id": UltimaID.calcular_proximo_id("movimiento"),
                "movimiento": movimiento,
                "idProducto": id_producto.upper(),
                "cantidad": cantidad,
                "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  #! Ej: 2021-09-01 12:00:00
                "vendedor": vendedor,
                "comentario": comentario,
            }
        )
        if respuesta["estado"]:
            if respuesta["respuesta"] == None:
                return ({"msg": "No se pudo crear el movimiento"}), 404
            
            else:
                self.ultima_id_resource.put("movimiento")
                return ({"msg": "Movimiento creado"}), 201
        return ({"msg": respuesta["respuesta"]}), 404