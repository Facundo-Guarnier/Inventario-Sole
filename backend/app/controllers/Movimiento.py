from datetime import datetime

import pytz
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from app.auth.Decorators import admin_required
from app.controllers.UltimaID import UltimaID
from app.models import MovimientoModel
from app.models.ProductoModel import ProductoModel


class Movimiento(Resource):
    def get(self, id: str) -> tuple:
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
            if respuesta["respuesta"] is None:
                return ({"msg": "No se encontró el movimiento"}), 404
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404

    @jwt_required()
    @admin_required
    def put(self, id: str) -> tuple:
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

        # movimiento = MovimientoModel.buscar_x_atributo({"id": id})
        # if not movimiento:
        #     return {"msg": "No se encontró el movimiento"}, 404

        # #! Obtener data
        # data = request.json
        # if not data:
        #     return {"msg": "Faltan datos"}, 400

        # #! Validar data
        # nuevo_movimiento = {}
        # try:
        #     if "movimiento" in data:
        #         nuevo_movimiento["movimiento"] = data["movimiento"]

        #     if "idProducto" in data:
        #         nuevo_movimiento["idProducto"] = data["idProducto"].upper()

        #     if "cantidad" in data:
        #         nuevo_movimiento["cantidad"] = float(data["cantidad"])
        #         if nuevo_movimiento["cantidad"] <= 0:
        #             return {"msg": "La cantidad no puede ser negativa o cero"}, 400

        #     if "vendedor" in data:
        #         nuevo_movimiento["vendedor"] = data["vendedor"]

        #     if "comentario" in data:
        #         nuevo_movimiento["comentario"] = data["comentario"]
        # except ValueError:
        #     return {"msg": "La cantidad debe ser un número válido"}, 400
        # except Exception as e:
        #     return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400

        # #! Actualizar movimiento
        # respuesta = MovimientoModel.actualizar(id, nuevo_movimiento)
        # if respuesta["estado"]:
        #     return {"msg": "Movimiento actualizado"}, 200
        # return {"msg": respuesta["respuesta"]}, 404
        return {"msg": "No se puede actualizar un movimiento"}, 400

    @jwt_required
    @admin_required
    def delete(self, id: str) -> tuple:
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

    def get(self) -> tuple:
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
            tienda = data.get("tienda")
            palabra_clave = data.get("palabra_clave")

            pagina = int(request.args.get("pagina", 1))
            por_pagina = int(request.args.get("por_pagina", 10))

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
        cantidad_total = MovimientoModel.total(filtro=filtro)

        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] is None:
                return ({"msg": "Error al cargar el total."}), 400
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
    def post(self, data=None) -> tuple:
        """
        Crea un movimiento.

        Args:
            data (dict, optional): Datos del movimiento. Si no se proporciona, se usa request.json.

        Returns:
            - dict: Movimiento creado
        """
        if data is None:
            data = request.json
        if not data:
            return {"msg": "Faltan datos"}, 400

        try:
            movimiento = data["movimiento"]
            id_producto = data["idProducto"].upper()
            cantidad = float(data["cantidad"])
            vendedor = data["vendedor"]
            comentario = data.get("comentario")
            tienda = data.get("tienda").lower()
        except KeyError as e:
            return {"msg": f"Falta el parámetro {str(e)}"}, 400
        except ValueError:
            return {"msg": "La cantidad debe ser un número válido"}, 400
        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400

        if cantidad <= 0:
            return ({"msg": "La cantidad no puede ser negativa o cero"}), 400

        respuesta1 = ProductoModel.buscar_x_atributo({"id": id_producto})
        if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
            return {"msg": "El producto no existe"}, 404

        buenos_aires_tz = pytz.timezone("America/Argentina/Buenos_Aires")
        #! Crear nuevo movimiento
        nuevo_movimiento = {
            "id": UltimaID.calcular_proximo_id("movimiento"),
            "movimiento": movimiento,
            "idProducto": id_producto,
            "cantidad": cantidad,
            "fecha": datetime.now(buenos_aires_tz).strftime("%Y-%m-%d %H:%M:%S"),
            "vendedor": vendedor,
            "comentario": comentario,
            "tienda": tienda,
        }

        if movimiento == "Entrada":
            # print("ENTRADA:", respuesta1["respuesta"][0][tienda]["cantidad"] + cantidad)
            ProductoModel.actualizar(
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
                # print("SALIDA:", respuesta1["respuesta"][0][tienda]["cantidad"] - cantidad)
                ProductoModel.actualizar(
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

        respuesta2 = MovimientoModel.crear(nuevo_movimiento)

        if respuesta2["estado"]:
            if respuesta2["respuesta"] is None:
                return {"msg": "No se pudo crear el movimiento"}, 404
            else:
                self.ultima_id_resource.put("movimiento")
                return {"msg": "Movimiento creado"}, 201
        return {"msg": respuesta2["respuesta"]}, 404
