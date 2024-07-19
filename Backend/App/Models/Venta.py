from .. import mongo as db_mongo
from bson import json_util
import json

class Venta: 
    @staticmethod
    def buscar_x_atributo(filtro: dict, saltear:int = 0, por_pagina:int = 10) -> list:
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
                "respuesta": json.loads(json_util.dumps(
                    db_mongo.db
                    .ventas             #! Colección de 'ventas'
                    .find(filtro)       #! Busca por los datos en base a 'filtro'
                    .skip(saltear)      #! Saltea los primeros 'x' registros
                    .limit(por_pagina)  #! Limita la cantidad de registros
                    .sort("_id", -1)    #! Ordena de forma descendente (el mas reciente primero)
                    ))
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
    
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
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
    
    @staticmethod
    def actualizar(id:str, data: dict) -> dict:
        """
        Actualiza una venta.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta actualizada
        """
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.ventas.update_one({"id": id}, {"$set": data}),
            }
            
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
    
    @staticmethod
    def eliminar(id:str) -> dict:
        """
        Elimina una venta.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta eliminada
        """
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.ventas.delete_one({"id": id}),
            }
            
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }
    
    @staticmethod
    def total() -> dict:
        """
        Devuelve el total de ventas.
        """
        
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.ventas.count_documents({}),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }