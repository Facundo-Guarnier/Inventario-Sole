from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from App.Models import ValidacionStockModel


class RondaValidacionStock(Resource):
    # /api/validacion/iniciar-ronda' ->  /api/ronda-validacion
    def get(self):
        """
        Obtiene los productos que deben ser validados en la ronda actual.
        """
        fecha_ronda = ValidacionStockModel.obtener_ronda_actual()
        if not fecha_ronda:
            return ({"error": "No hay una ronda de validación activa"}), 400
        
        productos = list(ValidacionStockModel.obtener_productos_para_validar(fecha_ronda))
        return {"fecha_ronda":fecha_ronda, "productos":productos}, 200
    
    # /api/validacion/iniciar-ronda' ->  /api/ronda-validacion
    def post(self):
        """
        Inicia una nueva ronda de validación.
        """
        resultado = ValidacionStockModel.iniciar_nueva_ronda()
        return (resultado), 200


class ValidarStock(Resource):
    # /api/validacion/validar-unidad -> /api/validar
    def post(self):
        """
        Valida una unidad de un producto.
        """
        data = request.json
        id_producto = data.get('id')
        deshacer = data.get('deshacer', False)
        
        print("+++ id_producto", id_producto)
        print("+++ deshacer", deshacer)
        
        if deshacer:
            resultado = ValidacionStockModel.deshacer_validacion(id_producto)
            return (resultado), 200 if resultado["estado"] else 400
        
        if not id_producto:
            return ({"error": "Datos incompletos"}), 400
        
        resultado = ValidacionStockModel.validar_unidad(id_producto)
        return (resultado), 200 if resultado["estado"] else 400