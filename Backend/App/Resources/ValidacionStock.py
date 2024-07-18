from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from App.Models import ValidacionStockModel


class RondaValidacionStock(Resource):
    def get(self):
        """
        Obtiene los productos que deben ser validados en la ronda actual.
        """
        
        data = request.args.to_dict()
        tienda = data.get('tienda')
        
        if not tienda:
            return ({"error": "Datos incompletos"}), 400
        
        fecha_ronda = ValidacionStockModel.obtener_ronda_actual(tienda)
        if not fecha_ronda:
            return ({"error": "No hay una ronda de validación activa"}), 400
        
        productos = list(ValidacionStockModel.obtener_productos_para_validar(fecha_ronda, tienda))
        return {"fecha_ronda":fecha_ronda, "productos":productos}, 200
    
    @jwt_required()
    def post(self):
        """
        Inicia una nueva ronda de validación.
        """
        data = request.json
        tienda = data.get('tienda')
        
        if not tienda:
            return ({"error": "Datos incompletos"}), 400
        
        resultado = ValidacionStockModel.iniciar_nueva_ronda(tienda)
        return (resultado), 200


class ValidarStock(Resource):
    @jwt_required()
    def post(self):
        """
        Valida una unidad de un producto.
        """
        data = request.json
        id_producto = data.get('id')
        deshacer = data.get('deshacer', False)
        tienda = data.get('tienda')
        
        if not id_producto or not tienda:
            return ({"error": "Datos incompletos"}), 400
        
        if deshacer:
            resultado = ValidacionStockModel.deshacer_validacion(id_producto, tienda)
        else:
            resultado = ValidacionStockModel.validar_unidad(id_producto, tienda)
        
        return (resultado), 200 if resultado["estado"] else 400