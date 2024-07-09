from datetime import datetime
from flask import jsonify, request
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
        respuesta = VentaModel.buscar_x_id(id)
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
        raise NotImplementedError


class Ventas(Resource):
    
    def get(self) -> list:
        """
        Busca ventas en base a los atributos que se pasen.
        Sin atributos, devuelve todas las ventas.
        TODO: Implementar la búsqueda por atributos numéricos, solo está buscando por srt.
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
            print(f"filtro + id venta: ", filtro)
        if cliente:
            filtro['cliente'] = cliente
            print(f"filtro + cliente: ", filtro)
        if fecha:
            filtro['fecha'] = fecha
            print(f"filtro + fecha: ", filtro)
        if total:
            filtro['total'] = total
            print(f"filtro + total: ", filtro)
        if tienda:
            filtro['tienda'] = tienda
            print(f"filtro + tienda: ", filtro)
        if metodo_pago:
            filtro['metodo'] = metodo_pago
            print(f"filtro + metodo: ", filtro)
        if productos:
            filtro['productos'] = productos
            print(f"filtro + productos: ", filtro)
        
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
        respuesta = "a"
        respuesta = VentaModel.buscar_x_atributo(filtro)
        
        return ({"msg": "Búsqueda realizada con éxito", "data": respuesta}), 200
    
    
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