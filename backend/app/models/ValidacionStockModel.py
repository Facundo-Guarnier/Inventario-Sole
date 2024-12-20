import json
from datetime import datetime

import pytz
from app.db import mongo
from bson import json_util


class ValidacionStockModel:

    def obtener_productos_para_validar(
        self, fecha_ronda, tienda, saltear: int = 0, por_pagina: int = 10
    ):
        return json.loads(
            json_util.dumps(
                mongo.db.productos.find(
                    {
                        "$or": [
                            {
                                f"{tienda}.validacion.ultima_fecha": {
                                    "$ne": fecha_ronda
                                },
                                f"{tienda}.cantidad": {"$gte": 1},
                            },
                            {
                                f"{tienda}.validacion.ultima_fecha": fecha_ronda,
                                f"{tienda}.validacion.estado": {"$ne": "Validado"},
                                f"{tienda}.cantidad": {"$gte": 1},
                            },
                        ]
                    },
                    {  #! Se excluyen los campos que no se necesitan
                        "_id": 0,
                        "liquidacion": 0,
                        "fotos": 0,
                    },
                )
                .skip(saltear)  #! Saltea los primeros 'x' registros
                .limit(por_pagina)  #! Limita la cantidad de registros
                .sort(
                    "_id", -1
                )  #! Ordena de forma descendente (el mas reciente primero)
            )
        )

    def validar_unidad(self, id_producto, tienda):
        producto = mongo.db.productos.find_one({"id": id_producto})

        if not producto:
            return {"estado": False, "mensaje": "Producto no encontrado"}

        validacion = producto.get(tienda).get(
            "validacion",
            {"ultima_fecha": None, "cantidad_validada": 0, "estado": "no_iniciado"},
        )

        print("+++++++++++++Validacion: ", validacion)

        fecha_actual = ValidacionStockModel.obtener_ronda_actual(tienda)
        cantidad_fisica = producto[tienda]["cantidad"]

        #! Si la fecha actual es distinta a la fecha de la última validación, se reinicia la validación
        if fecha_actual != validacion["ultima_fecha"]:
            validacion["ultima_fecha"] = fecha_actual
            validacion["cantidad_validada"] = 0
            validacion["estado"] = "En proceso"

        validacion["cantidad_validada"] += 1  #! Se suma una unidad

        #! Entrar en discrepancia si ya está validado
        if (
            validacion["estado"] == "Validado"
            or validacion["cantidad_validada"] > cantidad_fisica
        ):
            validacion["estado"] = "Discrepancia"

        #! Si la cantidad validada es igual a la cantidad física, se marca como validado
        if validacion["cantidad_validada"] == cantidad_fisica:
            validacion["estado"] = "Validado"

        mongo.db.productos.update_one(
            {"id": id_producto}, {"$set": {f"{tienda}.validacion": validacion}}
        )

        return {
            "estado": True,
            "mensaje": "Unidad validada correctamente",
            "unidades_restantes": cantidad_fisica - validacion["cantidad_validada"],
            "estado_validacion": validacion["estado"],
        }

    def deshacer_validacion(self, id_producto, tienda):
        producto = mongo.db.productos.find_one({"id": id_producto})

        if not producto:
            return {"estado": False, "mensaje": "Producto no encontrado"}

        cantidad_fisica = producto[tienda]["cantidad"]

        validacion = producto.get(tienda).get("validacion")

        if not validacion:
            return {"estado": False, "mensaje": "No hay validación para deshacer"}

        #! Si la cantidad validada es 0, no hay nada que deshacer
        if validacion["cantidad_validada"] == 0:
            validacion["estado"] = "En proceso"
            return {
                "estado": False,
                "mensaje": "No hay unidades validadas para deshacer",
                "unidades_validadas": validacion["cantidad_validada"],
                "estado_validacion": validacion["estado"],
            }

        validacion["cantidad_validada"] -= 1

        #!
        if validacion["cantidad_validada"] < cantidad_fisica:
            validacion["estado"] = "En proceso"

        elif validacion["cantidad_validada"] == cantidad_fisica:
            validacion["estado"] = "Validado"

        elif validacion["cantidad_validada"] > cantidad_fisica:
            validacion["estado"] = "Discrepancia"

        mongo.db.productos.update_one(
            {"id": id_producto}, {"$set": {f"{tienda}.validacion": validacion}}
        )

        return {
            "estado": True,
            "mensaje": "Validación deshecha correctamente",
            "unidades_validadas": validacion["cantidad_validada"],
            "estado_validacion": validacion["estado"],
        }

    def iniciar_nueva_ronda(self, tienda):
        buenos_aires_tz = pytz.timezone("America/Argentina/Buenos_Aires")
        fecha_actual = datetime.now(buenos_aires_tz).strftime("%Y-%m-%d %H:%M:%S")
        mongo.db.ultimasIDs.update_one(
            {"coleccion": f"validacion-{tienda}"},
            {"$set": {"fecha": fecha_actual}},
            upsert=True,
        )
        return {"estado": True, "fecha_inicio": fecha_actual}

    def obtener_ronda_actual(self, tienda):
        ronda = mongo.db.ultimasIDs.find_one({"coleccion": f"validacion-{tienda}"})
        return ronda["fecha"] if ronda else None

    def total(self, fecha_ronda, tienda) -> dict:
        """
        Devuelve el total de ventas.
        """

        try:
            return {
                "estado": True,
                "respuesta": json.loads(
                    json_util.dumps(
                        mongo.db.productos.count_documents(
                            {
                                "$or": [
                                    {
                                        f"{tienda}.validacion.ultima_fecha": {
                                            "$ne": fecha_ronda
                                        },
                                        f"{tienda}.cantidad": {"$gte": 1},
                                    },
                                    {
                                        f"{tienda}.validacion.ultima_fecha": fecha_ronda,
                                        f"{tienda}.validacion.estado": {
                                            "$ne": "Validado"
                                        },
                                        f"{tienda}.cantidad": {"$gte": 1},
                                    },
                                ]
                                # },
                                # {   #! Se excluyen los campos que no se necesitan
                                #     "_id": 0,
                                #     "liquidacion": 0,
                                #     "fotos": 0
                            }
                        )
                    )
                ),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
