from datetime import datetime

import pytz
from app.models.MovimientoModel import MovimientoModel
from app.models.ProductoModel import ProductoModel
from app.services.ultima_id import UltimaIdService


class MovimientoService:
    def __init__(self) -> None:
        self.ultima_id_resource = UltimaIdService()
        self.movimiento_model = MovimientoModel()
        self.producto_model = ProductoModel()

    def buscar_por_id(self, id: str) -> tuple:
        """
        Busca un movimiento por su id.

        Args:
            - id (int): ID del movimiento

        Returns:
            - dict: Movimiento encontrado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400

        respuesta = self.movimiento_model.buscar_x_atributo({"id": id})
        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return ({"msg": "No se encontró el movimiento"}), 404
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404

    def actualizar(self, id: str, datos: dict) -> tuple:
        """
        Actualiza un movimiento.

        Args:
            - id (int): ID del movimiento

        Returns:
            - dict: Movimiento actualizado
        """
        # #! Verificar si se puede actualizar el ID
        # if not id:
        #     return {"msg": "Falta el ID"}, 400

        # movimiento = self.movimiento_model.buscar_x_atributo({"id": id})
        # if not movimiento:
        #     return {"msg": "No se encontró el movimiento"}, 404

        # #! Validar datos
        # nuevo_movimiento = {}
        # try:
        #     if "movimiento" in datos:
        #         nuevo_movimiento["movimiento"] = datos["movimiento"]

        #     if "idProducto" in datos:
        #         nuevo_movimiento["idProducto"] = datos["idProducto"].upper()

        #     if "cantidad" in datos:
        #         nuevo_movimiento["cantidad"] = float(datos["cantidad"])
        #         if nuevo_movimiento["cantidad"] <= 0:
        #             return {"msg": "La cantidad no puede ser negativa o cero"}, 400

        #     if "vendedor" in datos:
        #         nuevo_movimiento["vendedor"] = datos["vendedor"]

        #     if "comentario" in datos:
        #         nuevo_movimiento["comentario"] = datos["comentario"]
        # except ValueError:
        #     return {"msg": "La cantidad debe ser un número válido"}, 400
        # except Exception as e:
        #     return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400

        # #! Actualizar movimiento
        # respuesta = self.movimiento_model.actualizar(id, nuevo_movimiento)
        # if respuesta["estado"]:
        #     return {"msg": "Movimiento actualizado"}, 200
        # return {"msg": respuesta["respuesta"]}, 404
        return {"msg": "No se puede actualizar un movimiento"}, 400

    def eliminar(self, id: str) -> tuple:
        """
        Elimina un movimiento.

        Args:
            - id (int): ID del movimiento

        Returns:
            - dict: Movimiento eliminado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400

        respuesta = self.movimiento_model.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Movimiento eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 404

    def buscar_x_atributo(self, filtro: dict, pagina: int, por_pagina: int) -> tuple:
        """
        Busca movimientos en base a los atributos que se pasen.
        Sin atributos, devuelve todos los movimientos.

        Returns:
            - list: Movimientos encontrados
        """

        #! Validar filtro
        try:
            id = filtro.get("id")
            movimiento = filtro.get("movimiento")
            id_producto = filtro.get("idProducto")
            cantidad = filtro.get("cantidad")
            vendedor = filtro.get("vendedor")
            comentario = filtro.get("comentario")
            fecha = filtro.get("fecha")
            tienda = filtro.get("tienda")
            palabra_clave = filtro.get("palabra_clave")

        except Exception:
            return ({"msg": "Error en los parámetros enviados"}), 400

        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}

        if id:
            filtro["id"] = id
        if movimiento:
            filtro["movimiento"] = movimiento
        if id_producto:
            filtro["idProducto"] = id_producto
        if cantidad:
            filtro["cantidad"] = cantidad
        if vendedor:
            filtro["vendedor"] = vendedor
        if comentario:
            filtro["comentario"] = comentario
        if tienda:
            filtro["tienda"] = tienda
        if fecha:
            fecha_inicio_original, fecha_fin_original = fecha.split(" al ")
            fecha_inicio = datetime.strptime(fecha_inicio_original, "%d-%m-%Y")
            fecha_fin = datetime.strptime(fecha_fin_original, "%d-%m-%Y").replace(
                hour=23, minute=59, second=59
            )
            filtro["fecha"] = {
                "$gte": fecha_inicio.strftime("%Y-%m-%d %H:%M:%S"),
                "$lte": fecha_fin.strftime("%Y-%m-%d %H:%M:%S"),
            }

        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro["$or"] = [
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
        cantidad_total = self.movimiento_model.total(filtro=filtro)

        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] is None:
                return ({"msg": "Error al cargar el total."}), 400
            else:
                cantidad_total = cantidad_total["respuesta"]
        else:
            return {"msg": cantidad_total["respuesta"]}, 404

        #! Buscar
        respuesta = self.movimiento_model.buscar_x_atributo(
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
        Crea un movimiento.

        Args:
            datos (dict, optional): Datos del movimiento. Si no se proporciona, se usa request.json.

        Returns:
            - dict: Movimiento creado
        """

        try:
            movimiento = datos["movimiento"]
            id_producto = datos["idProducto"].upper()
            cantidad = float(datos["cantidad"])
            vendedor = datos["vendedor"]
            comentario = datos.get("comentario")
            tienda = datos.get("tienda")
            if tienda:
                tienda = tienda.lower()

        except KeyError as e:
            return {"msg": f"Falta el parámetro {str(e)}"}, 400

        except ValueError:
            return {"msg": "La cantidad debe ser un número válido"}, 400

        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400

        if cantidad <= 0:
            return ({"msg": "La cantidad no puede ser negativa o cero"}), 400

        respuesta1 = self.producto_model.buscar_x_atributo({"id": id_producto})
        if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
            return {"msg": "El producto no existe"}, 404

        buenos_aires_tz = pytz.timezone("America/Argentina/Buenos_Aires")

        #! Crear nuevo movimiento
        nuevo_movimiento = {
            "id": self.ultima_id_resource.calcular_proximo_id("movimiento"),
            "movimiento": movimiento,
            "idProducto": id_producto,
            "cantidad": cantidad,
            "fecha": datetime.now(buenos_aires_tz).strftime("%Y-%m-%d %H:%M:%S"),
            "vendedor": vendedor,
            "comentario": comentario,
            "tienda": tienda,
        }

        if movimiento == "Entrada":
            self.producto_model.actualizar(
                id_producto,
                {
                    tienda: {
                        "cantidad": respuesta1["respuesta"][0][tienda]["cantidad"]
                        + cantidad,
                        "precio": respuesta1["respuesta"][0][tienda]["precio"],
                    }
                },
            )

        elif movimiento == "Salida":
            if respuesta1["respuesta"][0][tienda]["cantidad"] >= cantidad:
                self.producto_model.actualizar(
                    id_producto,
                    {
                        tienda: {
                            "cantidad": respuesta1["respuesta"][0][tienda]["cantidad"]
                            - cantidad,
                            "precio": respuesta1["respuesta"][0][tienda]["precio"],
                        }
                    },
                )
            else:
                return {"msg": "No hay suficientes productos en el inventario"}, 400

        else:
            return {"msg": "El movimiento no es válido"}, 400

        respuesta2 = self.movimiento_model.crear(nuevo_movimiento)

        if respuesta2["estado"]:
            if respuesta2["respuesta"] is None:
                return {"msg": "No se pudo crear el movimiento"}, 404

            else:
                self.ultima_id_resource.aumentar_id("movimiento")
                return {"msg": "Movimiento creado"}, 201

        return {"msg": respuesta2["respuesta"]}, 404
