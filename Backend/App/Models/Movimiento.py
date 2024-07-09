from .. import mongo as db_mongo
from bson import json_util

class Movimiento:
    
    @staticmethod
    def buscar_x_atributo(filtro: dict) -> dict:
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
                "respuesta": json_util.dumps(db_mongo.db.movimientos.find(filtro))
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
            - dict: Movimiento creado
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