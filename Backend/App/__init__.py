from flask import Flask, g, current_app
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_pymongo import PyMongo
from flask_cors import CORS

from Config import Config
import App.Resources as Resources

mongo = PyMongo()


def create_app(config_class=Config):

    #T* Crear la aplicación Flask
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)
    
    
    #T* Configurar JWT
    jwt = JWTManager(app)
    # jwt.init_app(app)
    
    
    #T* Configurar MOngoDB
    # mongo = PyMongo(app)
    mongo.init_app(app)
    
    
    #T* Configurar la API
    api = Api(app)
    api.add_resource(Resources.UsuariosResource, '/api/usuario/<id>')
    
    
    return app