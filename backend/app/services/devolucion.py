from datetime import datetime

import pytz
from app.models.DevolucionModel import DevolucionModel
from app.models.ProductoModel import ProductoModel
from app.services.movimiento import MovimientoService


class DevolucionesService:
    def __init__(self):
        self.movimientos = MovimientoService()
        self.devoluciones_model = DevolucionModel()

    def buscar_todas(self, pagina: int, por_pagina: int) -> tuple:
        """
        Busca todas las devoluciones en base a los atributos que se pasen.
        Sin atributos, devuelve todos las devoluciones.

        Returns:
            list: Lista de devoluciones.
        """

        filtro: dict[str, str] = {}

        saltear = (pagina - 1) * por_pagina
        cantidad_total = self.devoluciones_model.total(filtro=filtro)

        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] is None:
                return ({"msg": "Error al cargar el total."}), 400
            else:
                cantidad_total = cantidad_total["respuesta"]
        else:
            return {"msg": cantidad_total["respuesta"]}, 404

        #! Buscar
        respuesta = self.devoluciones_model.buscar_x_atributo(
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

    def crear(self, datos: dict) -> tuple:
        """
        Crea una devolución.

        Returns:
            - dict: Devolucion creada
        """

        #! Validar datos
        try:
            id_producto = datos["id"].upper()
            cantidad = float(datos["cantidad"])
            tienda = datos.get("tienda")
            if tienda:
                tienda = tienda.lower()
            comentario = datos.get("comentario", "-")

        except KeyError as e:
            return {"msg": f"Falta el parámetro {str(e)}"}, 400
        except ValueError:
            return {"msg": "La cantidad debe ser un número válido."}, 400
        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400

        if cantidad <= 0:
            return {"msg": "La cantidad debe ser mayor a 0."}, 400

        respuesta1 = ProductoModel.buscar_x_atributo({"id": id_producto})
        if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
            return {"msg": "El producto no existe"}, 404

        #! Crear movimiento
        movimiento_data = {
            "movimiento": "Entrada",
            "idProducto": id_producto,
            "cantidad": cantidad,
            "vendedor": "-",
            "comentario": "Devolución de producto",
            "tienda": tienda,
        }

        respuesta_movimiento = self.movimientos.post(movimiento_data)

        if respuesta_movimiento[1] != 201:
            return {"msg": "Error al actualizar el stock"}, 500

        buenos_aires_tz = pytz.timezone("America/Argentina/Buenos_Aires")
        #! Crear devolución
        nueva_Devolucion = {
            "id_producto": id_producto,
            "cantidad": cantidad,
            "tienda": tienda,
            "fecha_devolucion": datetime.now(buenos_aires_tz).strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "descripcion_producto": respuesta1["respuesta"][0]["descripcion"],
            "comentario": comentario,
        }

        respuesta3 = self.devoluciones_model.crear(nueva_Devolucion)

        if respuesta3["estado"]:
            if respuesta3["respuesta"] is None:
                return {"msg": "No se pudo crear la devolucion"}, 404
            else:
                return {"msg": "Devolucion creada"}, 201
        return {"msg": respuesta3["respuesta"]}, 404
