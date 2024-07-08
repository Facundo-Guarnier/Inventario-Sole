from .. import mongo as db_mongo

class Usuario:
    
    @staticmethod
    def register(data: dict) -> dict:
        """
        Inserta un usuario en la base.
        
        Args:
            - data (dict): usuario y contraseña
        """
        try: 
            return {
                "estado": True,
                "repuesta": str(db_mongo.db.usuarios.insert_one(data)),
            } 
        
        except Exception as e:
            return {
                "estado": False,
                "repuesta": f"Hubo un error al conectar con la DB: {str(e)}",
            }
    
    
    @staticmethod
    def get_alias(alias:str):
        return db_mongo.db.usuarios.find_one({"alias": alias})
    
    
    @staticmethod
    def acceder(username: str) -> dict:
        """
        Obtiene un usuario de la base.
        """
        return db_mongo.usuarios.find_one({"username": username})