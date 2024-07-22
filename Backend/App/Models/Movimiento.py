from .. import mongo as db_mongo
from bson import json_util
import json

class Movimiento:
    @staticmethod
    def buscar_x_atributo(filtro: dict, saltear:int = 0, por_pagina:int = 10) -> dict:
        """
        Busca movimientos.
        
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
                    .movimientos             #! Colección
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
        Crea un movimiento.
        
        Returns:
            - dict: Estado de la operación
        """
        try: 
            return {
                "estado": True,
                "respuesta": str(db_mongo.db.movimientos.insert_one(data)),
            } 
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def actualizar(id:str, data:dict) -> dict:
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
                "respuesta": str(db_mongo.db.movimientos.update_one({"id": id}, {"$set": data})),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def eliminar(id:str) -> dict:
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
                "respuesta": str(db_mongo.db.movimientos.delete_one({"id": id})),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def total(filtro: dict) -> dict:
        """
        Devuelve el total de ventas.
        """
        
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.movimientos.count_documents(filtro),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }