from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_pymongo import PyMongo
from flask_cors import CORS
# from flask_mail import Mail
from flask import current_app

from Config import Config


api = Api()
mongo = PyMongo()
jwt = JWTManager()
# mailsender = Mail()   #! Para los emails


def initialize_database(app):
    """
    Inicializa la base de datos con las colecciones especificadas en la configuración.
    Crea un administrador si no existe.
    """
    collections = app.config['MONGO_COLLECTIONS']
    existing_collections = mongo.db.list_collection_names()
    
    for collection in collections:
        if collection not in existing_collections:
            mongo.db.create_collection(collection)
            print(f"Colección '{collection}' creada.")
            
        else:
            print(f"Colección '{collection}' ya existente.")
    
    admin = mongo.db.usuarios.find_one({"roles": {"$in": ["admin"]}})    
    if admin == None:
        from werkzeug.security import generate_password_hash
        mongo.db.usuarios.insert_one(
            {
            "alias": "admin",
            'contraseña': generate_password_hash(app.config['CONTRA_ADMIN']),
            "roles": ["admin"],
            }
        )
        print("Admin creado.")
    
    else:
        print("Admin ya existente.")



def create_app(config_class=Config):
    
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)
    
    mongo.init_app(app)
    
    initialize_database(app)
    
    jwt.init_app(app)
    
    import App.Resources as Resources
    api.add_resource(Resources.UsuarioResource, '/api/usuario/<alias>')
    # api.add_resource(Resources.AutenticacionResource, '/api/registro')
    
    api.add_resource(Resources.VentaResource, '/api/venta/<id>') #! buscar_x_id
    api.add_resource(Resources.VentasResource, '/api/ventas') #! buscar_x_atributo, buscar_todos
    
    api.init_app(app)
    jwt.init_app(app)
    # mailsender.init_app(app)  #! Para los emails
    
    from App.Auth import Autenticacion
    app.register_blueprint(Autenticacion.auth)
    
    return app