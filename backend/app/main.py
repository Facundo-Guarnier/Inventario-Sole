import logging
import os

from app.db import mongo
from app.routes import (
    devolucion,
    foto,
    meli,
    movimiento,
    producto,
    ultima_id,
    usuario,
    validar_stock,
    venta,
)
from app.utils.backupDataBase import backupDataBase
from config import Config
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api
from werkzeug.security import generate_password_hash

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

api = Api()
jwt = JWTManager()


def initialize_database(app):
    """
    Inicializa la base de datos con las colecciones especificadas en la configuración.
    Crea un administrador si no existe.
    """
    collections = app.config["MONGO_COLLECTIONS"]
    existing_collections = mongo.db.list_collection_names()

    for collection in collections:
        if collection not in existing_collections:
            try:
                mongo.db.create_collection(collection)
                logger.info(f"Colección '{collection}' creada.")

                if collection == "ultimasIDs":
                    initial_data = [
                        {"coleccion": "giftcard", "id": "00000"},
                        {"coleccion": "movimiento", "id": "00000"},
                        {"coleccion": "producto", "id": "00000"},
                        {"coleccion": "regalo", "id": "00000"},
                        {"coleccion": "usuario", "id": "00000"},
                        {"coleccion": "venta", "id": "00000"},
                        {
                            "coleccion": "validacion-online",
                            "fecha": "2024-01-01 00:00:00",
                        },
                        {
                            "coleccion": "validacion-fisica",
                            "fecha": "2024-01-01 00:00:00",
                        },
                    ]
                    mongo.db.ultimasIDs.insert_many(initial_data)
            except Exception as e:
                logger.error(f"Error creando la colección {collection}: {str(e)}")
        else:
            logger.info(f"Colección '{collection}' ya existente.")

    try:
        admin = mongo.db.usuarios.find_one({"alias": "admin"})
        if admin is None:
            mongo.db.usuarios.insert_one(
                {
                    "alias": "admin",
                    "contraseña": generate_password_hash(app.config["CONTRA_ADMIN"]),
                    "roles": ["Admin"],
                    "created_at": mongo.db.command("serverStatus")["localTime"],
                }
            )
            logger.info("Admin creado.")
        else:
            mongo.db.usuarios.update_one(
                {"alias": "admin"},
                {
                    "$set": {
                        "roles": ["Admin"],
                        "contraseña": generate_password_hash(
                            app.config["CONTRA_ADMIN"]
                        ),
                    }
                },
                upsert=True,
            )
            logger.info("Admin actualizado.")
    except Exception as e:
        logger.error(f"Error al crear/actualizar el usuario admin: {str(e)}")


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    assert app.config.get("MONGO_URI"), "MONGO_URI no está configurada"
    assert app.config.get("CONTRA_ADMIN"), "CONTRA_ADMIN no está configurada"

    # Crear la carpeta de uploads si no existe
    if not os.path.exists(Config.UPLOAD_FOLDER):
        try:
            os.makedirs(Config.UPLOAD_FOLDER)
            logger.info(f"Directorio {Config.UPLOAD_FOLDER} creado.")
        except FileExistsError:
            pass

    CORS(app)
    mongo.init_app(app)
    jwt.init_app(app)

    initialize_database(app)

    api.init_app(app)

    # Registro de Blueprints
    app.register_blueprint(usuario.usuario)
    app.register_blueprint(ultima_id.ultima_id)
    app.register_blueprint(movimiento.movimiento)
    app.register_blueprint(producto.producto)
    app.register_blueprint(foto.foto)
    app.register_blueprint(venta.venta)
    app.register_blueprint(validar_stock.ronda_validacion)
    app.register_blueprint(validar_stock.validacion_stock)
    app.register_blueprint(devolucion.devolucion)
    app.register_blueprint(meli.meli)
    app.register_blueprint(backupDataBase.backup)

    return app
