from flask import Flask, g, current_app
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from Config import Config

def get_db():
    if 'db' not in g:
        g.db = MongoClient(current_app.config['MONGO_URI'])[current_app.config['MONGO_DBNAME']]
    return g.db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    jwt = JWTManager(app)

    # Register blueprints
    from App.Routes import auth_bp, api_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')

    # Teardown context
    @app.teardown_appcontext
    def close_db(error):
        db = g.pop('db', None)
        if db is not None:
            db.client.close()

    # Make get_db function available to the app
    app.get_db = get_db

    return app