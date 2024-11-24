from .. import mongo as db_mongo
from bson import json_util
import json

class UltimaID:
    @staticmethod
    def buscar_id(coleccion:str) -> dict:
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
                "respuesta": json.loads(json_util.dumps(db_mongo.db.ultimasIDs.find_one({"coleccion": coleccion})))
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
    
    @staticmethod
    def actualizar(colecion:str, id:str) -> dict:
        """
        Actualiza el último ID de una colección.
        
        Args:
            - coleccion (str): Nombre de la colección
            - id (str): ID actualizado
        
        Returns:
            - dict: ID actualizado
        """
        try:
            db_mongo.db.ultimasIDs.update_one({"coleccion": colecion}, {'$set':{"id": id}})
            return {
                "estado": True,
                "respuesta": "ID actualizado"
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }