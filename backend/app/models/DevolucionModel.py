import json

from app.db import mongo
from bson import json_util


class DevolucionModel:

    def buscar_x_atributo(
        self, filtro: dict, saltear: int = 0, por_pagina: int = 10
    ) -> dict:
        """
        Busca devoluciones.

        Args:
            - filtro (dict): Datos  a buscar

        Returns:
            - list: Devoluciones encontradas
        """
        try:
            print("🚀🚀🚀", filtro)

            return {
                "estado": True,
                "respuesta": json.loads(
                    json_util.dumps(
                        mongo.db.devoluciones.find(  #! Colección
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
        Crea una devolucion.

        Returns:
            - dict: Estado de la operación
        """
        try:
            return {
                "estado": True,
                "respuesta": str(mongo.db.devoluciones.insert_one(data)),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def total(self, filtro: dict) -> dict:
        """
        Devuelve el total de devoluciones.
        """

        try:
            return {
                "estado": True,
                "respuesta": mongo.db.devoluciones.count_documents(filtro),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
