from .. import mongo as db_mongo
from datetime import datetime
from bson import json_util


class Venta: 
    
    @staticmethod
    def buscar_x_id(id:int) -> dict:
        """
        Busca una venta por su id.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta encontrada
        """
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.ventas.find_one({"id": id}),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    
    @staticmethod
    def buscar_x_atributo(filtro: dict) -> list:
        """
        Busca ventas.
        
        Args:
            - filtro (dict): Datos de la venta a buscar
        
        Returns:
            - list: Ventas encontradas
        """
        return json_util.dumps(db_mongo.db.ventas.find(filtro))
    
    
    @staticmethod
    def crear(data: dict) -> dict:
        """
        Crea una venta.
        
        Returns:
            - dict: Venta creada
        """
        try: 
            return {
                "estado": True,
                "respuesta": str(db_mongo.db.ventas.insert_one(data)),
            } 
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    
    @staticmethod
    def actualizar(id:int, data: dict) -> dict:
        """
        Actualiza una venta.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta actualizada
        """
        return db_mongo.db.ventas.update_one({"id": id}, {"$set": data})