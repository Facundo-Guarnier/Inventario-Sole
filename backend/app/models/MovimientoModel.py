import json

from app.db import mongo
from bson import json_util


class MovimientoModel:

    def buscar_x_atributo(
        self, filtro: dict, saltear: int = 0, por_pagina: int = 10
    ) -> dict:
        """
        Busca movimientos.

        Args:
            - filtro (dict): Datos a buscar

        Returns:
            - list: Movimientos encontradas
        """
        try:
            return {
                "estado": True,
                "respuesta": json.loads(
                    json_util.dumps(
                        mongo.db.movimientos.find(  #! Colección
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
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def crear(self, data: dict) -> dict:
        """
        Crea un movimiento.

        Returns:
            - dict: Estado de la operación
        """
        try:
            return {
                "estado": True,
                "respuesta": str(mongo.db.movimientos.insert_one(data)),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def actualizar(self, id: str, data: dict) -> dict:
        """
        Actualizar un movimiento.

        Args:
            - id (int): ID del movimiento
            - data (dict): Datos del movimiento a actualizar

        Returns:
            - dict: Estado de la operación
        """

        try:
            return {
                "estado": True,
                "respuesta": str(
                    mongo.db.movimientos.update_one({"id": id}, {"$set": data})
                ),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def eliminar(self, id: str) -> dict:
        """
        Elimina un movimiento.

        Args:
            - id (int): ID del movimiento

        Returns:
            - dict: Estado de la operación
        """
        try:
            return {
                "estado": True,
                "respuesta": str(mongo.db.movimientos.delete_one({"id": id})),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def total(self, filtro: dict) -> dict:
        """
        Devuelve el total de movimientos.
        """

        try:
            return {
                "estado": True,
                "respuesta": mongo.db.movimientos.count_documents(filtro),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
