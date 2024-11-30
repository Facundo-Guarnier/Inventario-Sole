import json

from app.db import mongo
from bson import json_util


class UltimaIDModel:

    def buscar_id(self, coleccion: str) -> dict:
        """
        Busca el último ID de una colección.

        Args:
            - coleccion (str): Nombre de la colección

        Returns:
            - dict: ID encontrado
        """
        try:
            return {
                "estado": True,
                "respuesta": json.loads(
                    json_util.dumps(
                        mongo.db.ultimasIDs.find_one({"coleccion": coleccion})
                    )
                ),
            }

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }

    def actualizar(self, colecion: str, id: str) -> dict:
        """
        Actualiza el último ID de una colección.

        Args:
            - coleccion (str): Nombre de la colección
            - id (str): ID actualizado

        Returns:
            - dict: ID actualizado
        """
        try:
            mongo.db.ultimasIDs.update_one(
                {"coleccion": colecion}, {"$set": {"id": id}}
            )
            return {"estado": True, "respuesta": "ID actualizado"}

        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
