from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from app.models import ValidacionStockModel


class RondaValidacionStock(Resource):
    def get(self):
        """
        Obtiene los productos que deben ser validados en la ronda actual.
        """

        try:
            data = request.args.to_dict()
            tienda = data.get("tienda")
            pagina = int(request.args.get("pagina", 1))
            por_pagina = int(request.args.get("por_pagina", 10))

        except Exception:
            return ({"error": "Datos inválidos"}), 400

        #! Validar data
        if not tienda or not pagina or not por_pagina:
            return ({"error": "Datos incompletos"}), 400

        #! Obtener ronda actual
        fecha_ronda = ValidacionStockModel.obtener_ronda_actual(tienda)
        if not fecha_ronda:
            return ({"error": "No hay una ronda de validación activa"}), 400

        #! Paginación
        saltear = (pagina - 1) * por_pagina
        cantidad_total = ValidacionStockModel.total(fecha_ronda, tienda)

        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] is None:
                return ({"msg": "Error al cargar el total de ventas"}), 400
            else:
                cantidad_total = cantidad_total["respuesta"]
        else:
            return {"msg": cantidad_total["respuesta"]}, 404

        #! Obtener productos para validar
        productos = list(
            ValidacionStockModel.obtener_productos_para_validar(
                fecha_ronda, tienda, saltear, por_pagina
            )
        )
        return {
            "fecha_ronda": fecha_ronda,
            "productos": productos,
            "total": cantidad_total,
        }, 200

    @jwt_required()
    def post(self):
        """
        Inicia una nueva ronda de validación.
        """
        data = request.json
        tienda = data.get("tienda")

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
        id_producto = data.get("id")
        deshacer = data.get("deshacer", False)
        tienda = data.get("tienda")

        if not id_producto or not tienda:
            return ({"error": "Datos incompletos"}), 400

        if deshacer:
            resultado = ValidacionStockModel.deshacer_validacion(id_producto, tienda)
        else:
            resultado = ValidacionStockModel.validar_unidad(id_producto, tienda)

        return (resultado), 200 if resultado["estado"] else 400
