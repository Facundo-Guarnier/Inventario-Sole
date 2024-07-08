# from App import get_db_mongo
# db_mongo = get_db_mongo()

# from flask import g
# db_mongo = g.db_mongo

# from flask import current_app
from .. import mongo as db_mongo

class Usuario:
    
    
    @staticmethod
    def put_registrar(data: dict) -> dict:
        """
        Inserta un usuario en la base.
        
        Args:
            - data (dict): usuario y contraseña
        """
        # db_mongo = current_app.extensions['pymongo']
        data =  { "username": "admin", "password": "admin"}
        
        # return db_mongo.usuarios.insert_one(data)
        return "Usuario registrado con éxito."
    
    
    
    # @staticmethod
    # def get_acceder(username: str) -> dict:
    #     """
    #     Obtiene un usuario de la base.
    #     """
    #     return db_mongo.usuarios.find_one({"username": username})
    
    
    # @staticmethod
    # def get_by_username(username):
    #     return db_mongo.users.find_one({"username": username})
    
    
    # @staticmethod
    # def create(username, email, password, roles):
    #     user = {
    #         "username": username,
    #         "email": email,
    #         "password": password,
    #         "roles": roles
    #     }
    #     result = db.users.insert_one(user)
    #     return result.inserted_id