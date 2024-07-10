from datetime import datetime
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Models import VentaModel


class Venta(Resource):
    def get(self, id:str) -> dict:
        """
        Busca una venta por su id.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta encontrada
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        # respuesta = VentaModel.buscar_x_id(id)
        respuesta = VentaModel.buscar_x_atributo({"id": id})
        if respuesta["estado"]: #! Sin error con la DB
            if respuesta["respuesta"] == None:  #! No se encontró la venta
                return ({"msg": "No se encontró la venta"}), 404
            return ({"msg":respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    @jwt_required()
    def put(self, id:str) -> dict:
        """
        Actualiza una venta.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta actualizada
        """
        
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        #! Buscar si existe la venta
        venta = VentaModel.buscar_x_id(id)
        if not venta:
            return ({"msg": "No se encontró la venta"}), 404
        
        #! Obtener datos a actualizar
        data = request.json
        if not data:
            return ({"msg": "Faltan datos"}), 400
        
        #! Crear diccionario con los datos a actualizar
        nueva_venta = {}
        
        if data.get("cliente"):
            nueva_venta["cliente"] = data["cliente"]
        
        if data.get("total"):
            nueva_venta["total"] = data["total"]
        
        if data.get("tienda"):
            nueva_venta["tienda"] = data["tienda"]
        
        if data.get("metodo"):
            nueva_venta["metodo"] = data["metodo"]
        
        if data.get("productos"):
            nueva_venta["productos"] = data["productos"]
        
        #! Actualizar venta
        respuesta = VentaModel.actualizar(id, data)
        if respuesta["estado"]:
            return ({"msg": "Venta actualizada"}), 200
        return ({"msg": respuesta["respuesta"]}), 400
    
    @jwt_required()
    def delete(self, id:str) -> dict:
        """
        Elimina una venta.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Confirmación de eliminación.
        """
        
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        #! Buscar si existe la venta
        venta = VentaModel.buscar_x_atributo({"id": id})
        if not venta:
            return ({"msg": "No se encontró la venta"}), 404
        
        #! Eliminar venta
        respuesta = VentaModel.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Venta eliminada"}), 200
        return ({"msg": respuesta["respuesta"]}), 400


class Ventas(Resource):
    def get(self) -> list:
        """
        Busca ventas en base a los atributos que se pasen.
        Sin atributos, devuelve todas las ventas.
        """
        data = request.json
        
        #! Validar data: id, Cliente, Fecha, Total, Tienda, Metodo de pago, Productos
        id = data.get("id")
        cliente = data.get("cliente")
        fecha = data.get("fecha")
        total = data.get("total")
        tienda = data.get("tienda")
        metodo_pago = data.get("metodo")
        productos = data.get("productos")
        palabra_clave = data.get("palabra_clave")
        
        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}
        
        if id:
            filtro['id'] = id
        if cliente:
            filtro['cliente'] = cliente
        if fecha:
            filtro['fecha'] = fecha
        if total:
            filtro['total'] = total
        if tienda:
            filtro['tienda'] = tienda
        if metodo_pago:
            filtro['metodo'] = metodo_pago
        if productos:
            filtro['productos'] = productos
        
        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro['$or'] = [
                {"id": {"$regex": palabra_clave, "$options": "i"}},
                {"cliente": {"$regex": palabra_clave, "$options": "i"}},
                {"fecha": {"$regex": palabra_clave, "$options": "i"}},
                {"total": {"$regex": palabra_clave, "$options": "i"}},
                {"tienda": {"$regex": palabra_clave, "$options": "i"}},
                {"metodo": {"$regex": palabra_clave, "$options": "i"}}
            ]
        respuesta = VentaModel.buscar_x_atributo(filtro)
        
        if respuesta["estado"]:
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    @jwt_required()
    def post(self) -> dict:
        """
        Crea una venta.
        
        Returns:
            - dict: Venta creada
        """
        data = request.json
        
        id = data.get("id")
        cliente = data.get("cliente")
        total = data.get("total")
        tienda = data.get("tienda")
        metodo_pago = data.get("metodo")
        productos = data.get("productos")
        
        if not id or \
        not cliente or \
        not total or \
        not tienda or \
        not metodo_pago or \
        not productos:
            return ({"msg": "Faltan datos"}), 400
        
        respuesta = VentaModel.crear(
            {
                "id": id,
                "cliente": cliente,
                "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  #! Ej: 2021-09-01 12:00:00
                "total": total,
                "tienda": tienda,
                "metodo": metodo_pago,
                "productos": productos
            }
        )
        if respuesta["estado"]:
            return ({"msg": "Venta creada con éxito"}), 201
        return ({"msg": respuesta["respuesta"]}), 400