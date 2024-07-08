from flask import Flask, g, current_app
from flask_jwt_extended import JWTManager
from flask_restful import Api
from pymongo import MongoClient
from Config import Config
import App.Resources as Resources


def get_db():
    if 'db' not in g:
        g.db = MongoClient(current_app.config['MONGO_URI'])[current_app.config['MONGO_DBNAME']]
    return g.db


def create_app(config_class=Config):

    #T* Crear la aplicación Flask
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    
    #T* Configurar JWT
    jwt = JWTManager(app)
    jwt.init_app(app)
    
    
    #T* Configurar la base de datos
    @app.before_request
    def before_request():
        if 'db' not in g:
            g.db = MongoClient(app.config['MONGO_URI'])[app.config['MONGO_DBNAME']]
    
    @app.teardown_appcontext
    def close_db(error):
        db = g.pop('db', None)
        if db is not None:
            db.client.close()
    
    
    #T* Configurar la API
    api = Api(app)
    api.add_resource(Resources.UsuariosResource, '/api/usuario/<id>')
    # api.add_resource(Resources.UsuariosResource, '/api/usuario')
    
    
    return app