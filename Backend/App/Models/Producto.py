from .. import mongo as db_mongo
from bson import json_util
import json


class Producto:
    @staticmethod
    def buscar_x_atributo(filtro: dict, saltear:int = 0, por_pagina:int = 10) -> list:
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
                "respuesta": json.loads(json_util.dumps(
                    db_mongo.db
                    .productos             #! Colección
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
    
    @staticmethod
    def total(filtro: dict) -> dict:
        """
        Devuelve el total de ventas.
        """
        
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.productos.count_documents(filtro),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }