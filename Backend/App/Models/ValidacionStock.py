from datetime import datetime
from .. import mongo as db_mongo
from bson import json_util, ObjectId
import json

class ValidacionStock:
    #TODO: Documentar bien estos métodos y revisar si datetime va en Resources o en Models
    @staticmethod
    def obtener_productos_para_validar(fecha_ronda):
        return json.loads(json_util.dumps(db_mongo.db.productos.find({
            "$or": [
                {"validacion.ultima_fecha": {"$ne": fecha_ronda}},
                {"validacion": {"$exists": False}}
            ]
        })))
    
    @staticmethod
    def validar_unidad(id_producto):
        producto = db_mongo.db.productos.find_one({"id": id_producto})
        if not producto:
            return {"estado": False, "mensaje": "Producto no encontrado"}
        
        validacion = producto.get("validacion", {
            "ultima_fecha": None,
            "cantidad_validada": 0,
            "estado": "no_iniciado"
        })
        
        fecha_actual = datetime.now().strftime("%Y-%m-%d")
        cantidad_fisica = producto["fisica"]["cantidad"]
        
        if validacion["estado"] == "validado":
            validacion["estado"] = "discrepancia"
        
        elif validacion["cantidad_validada"] < cantidad_fisica:
            validacion["cantidad_validada"] += 1
            validacion["ultima_fecha"] = fecha_actual
            validacion["estado"] = "en_proceso" if validacion["cantidad_validada"] < cantidad_fisica else "validado"
        
        db_mongo.db.productos.update_one(
            {"id": id_producto},
            {"$set": {"validacion": validacion}}
        )
        
        return {
            "estado": True,
            "mensaje": "Unidad validada correctamente",
            "unidades_restantes": cantidad_fisica - validacion["cantidad_validada"],
            "estado_validacion": validacion["estado"]
        }
    
    @staticmethod
    def iniciar_nueva_ronda():
        fecha_actual = datetime.now().strftime("%Y-%m-%d")
        db_mongo.db.ultimasIDs.update_one(
            {"coleccion": "validacion"},
            {"$set": {"fecha": fecha_actual}},
            upsert=True
        )
        return {"estado": True, "fecha_inicio": fecha_actual}
    
    @staticmethod
    def obtener_ronda_actual():
        ronda = db_mongo.db.ultimasIDs.find_one({"coleccion": "validacion"})
        return ronda["fecha"] if ronda else None