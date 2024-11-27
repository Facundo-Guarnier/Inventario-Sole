from app.models import ValidacionStockModel


class RondaValidacionStockService:
    def productos_a_validar(self, tienda: str, pagina: int, por_pagina: int):
        """
        Obtiene los productos que deben ser validados en la ronda actual.
        """

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

    def iniciar_ronda(self, tienda: str):
        """
        Inicia una nueva ronda de validación.
        """

        resultado = ValidacionStockModel.iniciar_nueva_ronda(tienda)
        return (resultado), 200


class ValidarStockService:
    def post(self, id_producto: str, tienda: str, deshacer: bool = False):
        """
        Valida una unidad de un producto.
        """

        if deshacer:
            resultado = ValidacionStockModel.deshacer_validacion(id_producto, tienda)
        else:
            resultado = ValidacionStockModel.validar_unidad(id_producto, tienda)

        return (resultado), 200 if resultado["estado"] else 400
