from .. import mongo as db_mongo
from bson import json_util
import json

class Devolucion: 
    @staticmethod
    def buscar_x_atributo(filtro: dict, saltear:int = 0, por_pagina:int = 10) -> list:
        """
        Busca devoluciones.
        
        Args:
            - filtro (dict): Datos  a buscar
        
        Returns:
            - list: Devoluciones encontradas
        """
        try:
            return {
                "estado": True,
                "respuesta": json.loads(json_util.dumps(
                    db_mongo.db
                    .devoluciones             #! Colección
                    .find(filtro)       #! Busca por los datos en base a 'filtro'
                    .skip(saltear)      #! Saltea los primeros 'x' registros
                    .limit(por_pagina)  #! Limita la cantidad de registros
                    .sort("_id", -1)    #! Ordena de forma descendente (el mas reciente primero)
                    ))
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    
    @staticmethod
    def crear(data: dict) -> dict:
        """
        Crea una devolucion.
        
        Returns:
            - dict: Estado de la operación
        """
        try: 
            return {
                "estado": True,
                "respuesta": str(db_mongo.db.devolucion.insert_one(data)),
            } 
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    
    @staticmethod
    def total(filtro: dict) -> dict:
        """
        Devuelve el total de devoluciones.
        """
        
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.devolucion.count_documents(filtro),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }