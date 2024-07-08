from flask import Flask
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from Config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    jwt = JWTManager(app)
    mongo = MongoClient(app.config['MONGO_URI'])
    app.db = mongo[app.config['MONGO_DBNAME']]

    # Register blueprints
    from App.Routes import auth_bp, api_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')

    return app