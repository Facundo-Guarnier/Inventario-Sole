import json

from app.db import mongo
from bson import json_util


class ProductoModel:
    def buscar_x_atributo(
        self, filtro: dict, saltear: int = 0, por_pagina: int = 10
    ) -> dict:
        """
        Busca productos.

        Args:
            - filtro (dict): Datos del producto a buscar

        Returns:
            - list: Productoss encontradas
        """
        try:
            return {
                "estado": True,
                "respuesta": json.loads(
                    json_util.dumps(
                        mongo.db.productos.find(  #! Colección
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
        Crea una producto.

        Returns:
            - dict: Productos creada
        """
        try:
            return {
                "estado": True,
                "respuesta": str(mongo.db.productos.insert_one(data)),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def actualizar(self, id: str, data: dict) -> dict:
        """
        Actualiza una producto.

        Args:
            - id (int): ID del producto

        Returns:
            - dict: Productos actualizada
        """
        try:
            return {
                "estado": True,
                "respuesta": mongo.db.productos.update_one({"id": id}, {"$set": data}),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }

    def eliminar(self, id: str) -> dict:
        """
        Elimina una producto.

        Args:
            - id (int): ID del producto

        Returns:
            - dict: Productos eliminada
        """
        try:
            return {
                "estado": True,
                "respuesta": mongo.db.productos.delete_one({"id": id}),
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
                "respuesta": mongo.db.productos.count_documents(filtro),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
