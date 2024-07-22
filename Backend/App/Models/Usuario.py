from bson import json_util
import json
from .. import mongo as db_mongo

class Usuario:
    @staticmethod
    def crear(data: dict) -> dict:
        """
        Inserta un usuario en la base.
        
        Args:
            - data (dict): usuario y contraseña
        """
        try: 
            return {
                "estado": True,
                "respuesta": str(db_mongo.db.usuarios.insert_one(data)),
            } 
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def buscar_x_alias(alias:str) -> dict:
        try:
            return {
                "estado": True,
                "respuesta": db_mongo.db.usuarios.find_one({"alias": alias})
                }
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def buscar_x_atributo(filtro: dict, saltear:int = 0, por_pagina:int = 10) -> list:
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
                "respuesta": json.loads(json_util.dumps(
                    db_mongo.db
                    .usuarios             #! Colección
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
    def actualizar(alias: str, data: dict) -> dict:
        """
        Actualiza un usuario en la base.
        
        Args:
            - alias (str): Alias del usuario
            - data (dict): roles y/o contraseña
        """
        try:
            return {
                "estado": True,
                "respuesta": db_mongo.db.usuarios.update_one({"alias": alias}, {"$set": data})
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    @staticmethod
    def eliminar(alias: str) -> dict:
        """
        Elimina un usuario de la base.
        """
        try: 
            return {
                "estado": True,
                "respuesta": db_mongo.db.usuarios.delete_one({"alias": alias})
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
                "respuesta": db_mongo.db.usuarios.count_documents(filtro),
            }
        
        except Exception as e:
            return {
                "estado": False,
                "respuesta": f"Hubo un error en la DB {str(e)}",
            }