from .. import mongo as db_mongo
from bson import json_util
import json


class Producto:
    @staticmethod
    def buscar_x_atributo(filtro: dict) -> list:
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
                "respuesta": json.loads(json_util.dumps(db_mongo.db.productos.find(filtro)))
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def crear(data: dict) -> dict:
        """
        Crea una producto.
        
        Returns:
            - dict: Productos creada
        """
        try: 
            return {
                "estado": True,
                "respuesta": str(db_mongo.db.productos.insert_one(data)),
            } 
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def actualizar(id:str, data: dict) -> dict:
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
                "respuesta": db_mongo.db.productos.update_one({"id": id}, {"$set": data}),
            }
            
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def eliminar(id:str) -> dict:
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
                "respuesta": db_mongo.db.productos.delete_one({"id": id}),
            }
            
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }