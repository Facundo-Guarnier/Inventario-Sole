import json

from app.db import mongo
from bson import json_util


class UsuarioModel:

    def crear(self, data: dict) -> dict:
        """
        Inserta un usuario en la base.

        Args:
            - data (dict): usuario y contraseña
        """
        try:
            return {
                "estado": True,
                "respuesta": str(mongo.db.usuarios.insert_one(data)),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def buscar_x_alias(self, alias: str) -> dict:
        try:
            return {
                "estado": True,
                "respuesta": mongo.db.usuarios.find_one({"alias": alias}),
            }
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def buscar_x_atributo(
        self, filtro: dict, saltear: int = 0, por_pagina: int = 10
    ) -> dict:
        """
        Busca usuarios.

        Args:
            - filtro (dict): Datos de los usuarios a buscar

        Returns:
            - list: usuarios encontrados
        """
        try:
            return {
                "estado": True,
                "respuesta": json.loads(
                    json_util.dumps(
                        mongo.db.usuarios.find(  #! Colección
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

    def actualizar(self, alias: str, data: dict) -> dict:
        """
        Actualiza un usuario en la base.

        Args:
            - alias (str): Alias del usuario
            - data (dict): roles y/o contraseña
        """
        try:
            return {
                "estado": True,
                "respuesta": mongo.db.usuarios.update_one(
                    {"alias": alias}, {"$set": data}
                ),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def eliminar(self, alias: str) -> dict:
        """
        Elimina un usuario de la base.
        """
        try:
            return {
                "estado": True,
                "respuesta": mongo.db.usuarios.delete_one({"alias": alias}),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def total(self, filtro: dict) -> dict:
        """
        Devuelve el total de ventas.
        """

        try:
            return {
                "estado": True,
                "respuesta": mongo.db.usuarios.count_documents(filtro),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
