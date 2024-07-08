from flask import Flask, g, current_app
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from Config import Config
import App.Resources as Resources

db_sql = SQLAlchemy()

def db_mongo() -> MongoClient:
    if 'db_mongo' not in g:
        g.db_mongo = MongoClient(current_app.config['MONGO_URI'])[current_app.config['MONGO_DBNAME']]
    return g.db_mongo

def create_app(config_class=Config):

    #T* Crear la aplicación Flask
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    
    #T* Configurar JWT
    jwt = JWTManager(app)
    jwt.init_app(app)
    
    
    #T* CMongoDB
    @app.before_request
    def before_request_mongo():
        if 'db_mongo' not in g:
            g.db_mongo = MongoClient(app.config['MONGO_URI'])[app.config['MONGO_DBNAME']]
    
    @app.teardown_appcontext
    def close_db_mongo(error):
        db_mongo = g.pop('db_mongo', None)
        if db_mongo is not None:
            db_mongo.client.close()
    
    
    #t* Configurar SQLAlchemy
    db_sql.init_app(app)
    
    @app.before_request
    def before_request_sql():
        if 'db_sql' not in g:
            g.db_sql = db_sql
    
    @app.teardown_appcontext
    def close_db_sql(error):
        db_sql.session.remove()
    
    
    #T* Configurar la API
    api = Api(app)
    api.add_resource(Resources.UsuariosResource, '/api/usuario/<id>')
    
    
    return app