from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Models import VentaModel


class Venta(Resource):
    
    def get(self, id_venta:int) -> dict:
        """
        Busca una venta por su id.
        
        Args:
            - id_venta (int): ID de la venta
        
        Returns:
            - dict: Venta encontrada
        """
        respuesta = VentaModel.buscar_x_id(id_venta)
        if respuesta["estado"]: #! Sin error con la DB
            if respuesta["respuesta"] == None:  #! No se encontró la venta
                return ({"msg": "No se encontró la venta"}), 404
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    
    @jwt_required()
    def post(self) -> dict:
        """
        Crea una venta.
        
        Returns:
            - dict: Venta creada
        """
        raise NotImplementedError
    
    
    @jwt_required()
    def put(self, id_venta:int) -> dict:
        """
        Actualiza una venta.
        
        Args:
            - id_venta (int): ID de la venta
        
        Returns:
            - dict: Venta actualizada
        """
        raise NotImplementedError


class Ventas(Resource):
    
    def get(self) -> dict:
        """
        Busca todas las ventas.
        
        Returns:
            - dict: Ventas encontradas
        """
        raise NotImplementedError


class VentasBuscador(Resource):
    
    def get(self) -> list:
        """
        Busca ventas en base a los atributos que se pasen.
        TODO: Implementar la búsqueda por atributos numéricos, solo está buscando por srt.
        """
        data = request.json
        
        #! Validar data: id_venta, Cliente, Fecha, Total, Tienda, Metodo de pago, Productos
        id_venta = data.get("id_venta")
        cliente = data.get("cliente")
        fecha = data.get("fecha")
        total = data.get("total")
        tienda = data.get("tienda")
        metodo_pago = data.get("metodo")
        productos = data.get("productos")
        palabra_clave = data.get("palabra_clave")
        
        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}
        
        if id_venta:
            filtro['id_venta'] = id_venta
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
                {"id_venta": {"$regex": palabra_clave, "$options": "i"}},
                {"cliente": {"$regex": palabra_clave, "$options": "i"}},
                {"fecha": {"$regex": palabra_clave, "$options": "i"}},
                {"total": {"$regex": palabra_clave, "$options": "i"}},
                {"tienda": {"$regex": palabra_clave, "$options": "i"}},
                {"metodo": {"$regex": palabra_clave, "$options": "i"}}
            ]
        respuesta = "a"
        respuesta = VentaModel.buscar_x_atributo(filtro)

        return ({"msg": "Búsqueda realizada con éxito", "data": respuesta}), 200