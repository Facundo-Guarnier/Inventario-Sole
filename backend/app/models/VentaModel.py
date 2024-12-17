import json

from app.db import mongo
from bson import json_util


class VentaModel:
    def buscar_x_atributo(
        self, filtro: dict, saltear: int = 0, por_pagina: int = 10
    ) -> dict:
        """
        Busca ventas.

        Args:
            - filtro (dict): Datos de la venta a buscar

        Returns:
            - list: Ventas encontradas
        """
        try:
            return {
                "estado": True,
                "respuesta": json.loads(
                    json_util.dumps(
                        mongo.db.ventas.find(  #! Colección
                            filtro
                        )  #! Busca por los datos en base a 'filtro'
                        .skip(saltear)  #! Saltea los primeros 'x' registros
                        .limit(por_pagina)  #! Limita la cantidad de registros
                        .sort(
                            "_id", -1
                        )  #! Ordena de forma descendente (el mas reciente primero)
                    )
                ),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }

    def crear(self, data: dict) -> dict:
        """
        Crea una venta.

        Returns:
            - dict: Venta creada
        """
        try:
            return {
                "estado": True,
                "respuesta": str(mongo.db.ventas.insert_one(data)),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }

    def actualizar(self, id: str, data: dict) -> bool:
        """
        Actualiza una venta.

        Args:
            - id (int): ID de la venta

        Returns:
            - dict: Venta actualizada
        """
        try:
            mongo.db.ventas.update_one({"id": id}, {"$set": data}),
            return True
        except Exception:
            return False

    def eliminar(self, id: str) -> bool:
        """
        Elimina una venta.

        Args:
            - id (int): ID de la venta

        Returns:
            - dict: Venta eliminada
        """
        try:
            mongo.db.ventas.delete_one({"id": id})
            return True
        except Exception:
            return False

    def total(self, filtro: dict) -> dict:
        """
        Devuelve el total de ventas.
        """

        try:
            return {
                "estado": True,
                "respuesta": mongo.db.ventas.count_documents(filtro),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
