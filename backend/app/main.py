import os

from config import Config
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_restful import Api

api = Api()
mongo = PyMongo()
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
            mongo.db.create_collection(collection)
            print(f"Colección '{collection}' creada.")

            if collection == "ultimasIDs":
                mongo.db.ultimasIDs.insert_one({"coleccion": "giftcard", "id": "00000"})
                mongo.db.ultimasIDs.insert_one(
                    {"coleccion": "movimiento", "id": "00000"}
                )
                mongo.db.ultimasIDs.insert_one({"coleccion": "producto", "id": "00000"})
                mongo.db.ultimasIDs.insert_one({"coleccion": "regalo", "id": "00000"})
                mongo.db.ultimasIDs.insert_one({"coleccion": "usuario", "id": "00000"})
                mongo.db.ultimasIDs.insert_one({"coleccion": "venta", "id": "00000"})

                mongo.db.ultimasIDs.insert_one(
                    {"coleccion": "validacion-online", "fecha": "2024-01-01 00:00:00"}
                )
                mongo.db.ultimasIDs.insert_one(
                    {"coleccion": "validacion-fisica", "fecha": "2024-01-01 00:00:00"}
                )

        else:
            print(f"Colección '{collection}' ya existente.")

    admin = mongo.db.usuarios.find_one({"alias": "admin"})
    from werkzeug.security import generate_password_hash

    if admin is None:
        mongo.db.usuarios.delete_one({"alias": "admin"})
        mongo.db.usuarios.insert_one(
            {
                "alias": "admin",
                "contraseña": generate_password_hash(app.config["CONTRA_ADMIN"]),
                "roles": ["Admin"],
            }
        )
        print("Admin creado.")

    else:
        print("Admin actualizado.")
        mongo.db.usuarios.update_one(
            {"alias": "admin"},
            {
                "$set": {
                    "roles": ["Admin"],
                    "contraseña": generate_password_hash(app.config["CONTRA_ADMIN"]),
                }
            },
        )


def create_app(config_class=Config):

    app = Flask(__name__)
    app.config.from_object(config_class)

    #! Crear la carpeta de uploads si no existe
    if not os.path.exists(Config.UPLOAD_FOLDER):
        try:
            os.makedirs(Config.UPLOAD_FOLDER)
        except FileExistsError:
            #! La carpeta ya existe, lo cual está bien
            pass

    CORS(app)

    mongo.init_app(app)

    initialize_database(app)

    jwt.init_app(app)

    import app.controllers as controllers

    api.add_resource(controllers.UsuarioResource, "/api/usuario/<alias>")
    api.add_resource(controllers.UsuariosResource, "/api/usuarios")

    api.add_resource(
        controllers.MovimientoResource, "/api/movimiento/<id>"
    )  #! buscar_x_id
    api.add_resource(
        controllers.MovimientosResource, "/api/movimientos"
    )  #! buscar_x_atributo, buscar_todos

    api.add_resource(
        controllers.ProductoResource, "/api/producto/<id>"
    )  #! buscar_x_id, actualizar, eliminar
    api.add_resource(
        controllers.ProductosResource, "/api/productos"
    )  #! buscar_x_atributo, buscar_todos, crear

    api.add_resource(
        controllers.FotoResource, "/api/foto/<id_prod>/<filename>"
    )  #! buscar foto
    api.add_resource(controllers.FotosResource, "/api/fotos")  #! subir foto

    api.add_resource(
        controllers.VentaResource, "/api/venta/<id>"
    )  #! buscar_x_id, actualizar, eliminar
    api.add_resource(
        controllers.VentasResource, "/api/ventas"
    )  #! buscar_x_atributo, buscar_todos, crear

    api.add_resource(
        controllers.UltimaIDResource, "/api/ultimaid/<coleccion>"
    )  #! buscar_id, aumentar_id

    api.add_resource(
        controllers.RondaValidacionStockResource, "/api/ronda-validacion"
    )  #! iniciar, obtener_productos
    api.add_resource(
        controllers.ValidarStockResource, "/api/validar"
    )  #! validar_unidad

    api.add_resource(
        controllers.DevolucionesResource, "/api/devoluciones"
    )  #! buscar_x_atributo, crear

    api.add_resource(controllers.MeliResource, "/api/meli")

    api.init_app(app)
    jwt.init_app(app)

    from app.auth import Autenticacion

    app.register_blueprint(Autenticacion.auth)

    from app.utils.backupDataBase import BackupDataBase

    app.register_blueprint(BackupDataBase.backup)

    return app
