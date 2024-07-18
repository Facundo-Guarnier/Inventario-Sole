from datetime import datetime
from .. import mongo as db_mongo
from bson import json_util, ObjectId
import json

class ValidacionStock:
    @staticmethod
    def obtener_productos_para_validar(fecha_ronda, tienda):
        return json.loads(json_util.dumps(db_mongo.db.productos.find(
            {
                "$or": [
                    {
                        f"{tienda}.validacion.ultima_fecha": {"$ne": fecha_ronda},
                        f"{tienda}.cantidad": {"$gte": 1},
                    },
                    {
                        f"{tienda}.validacion.ultima_fecha": fecha_ronda,
                        f"{tienda}.validacion.estado": {"$ne": "Validado"},
                        f"{tienda}.cantidad": {"$gte": 1},
                    }, 
                    
                ]
                },
                {   #! Se excluyen los campos que no se necesitan
                    "_id": 0,
                    "liquidacion": 0,
                    "fotos": 0
                }
            ).sort("_id", -1)))
    
    @staticmethod
    def validar_unidad(id_producto, tienda):
        producto = db_mongo.db.productos.find_one({"id": id_producto})
        
        if not producto:
            return {"estado": False, "mensaje": "Producto no encontrado"}
        
        validacion = producto.get(tienda).get("validacion", {
                "ultima_fecha": None,
                "cantidad_validada": 0,
                "estado": "no_iniciado"
            }
        )
        
        print("+++++++++++++Validacion: ", validacion)
        
        fecha_actual = ValidacionStock.obtener_ronda_actual(tienda)
        cantidad_fisica = producto[tienda]["cantidad"] 
        
        #! Si la fecha actual es distinta a la fecha de la última validación, se reinicia la validación
        if fecha_actual != validacion["ultima_fecha"]:
            validacion["ultima_fecha"] = fecha_actual
            validacion["cantidad_validada"] = 0
            validacion["estado"] = "En proceso"
        
        validacion["cantidad_validada"] += 1    #! Se suma una unidad
        
        #! Entrar en discrepancia si ya está validado
        if validacion["estado"] == "Validado" or validacion["cantidad_validada"] > cantidad_fisica:
            validacion["estado"] = "Discrepancia"
        
        #! Si la cantidad validada es igual a la cantidad física, se marca como validado
        if validacion["cantidad_validada"] == cantidad_fisica:
            validacion["estado"] = "Validado"
        
        db_mongo.db.productos.update_one(
            {"id": id_producto},
            {"$set": {f"{tienda}.validacion": validacion}}
        )
        
        return {
            "estado": True,
            "mensaje": "Unidad validada correctamente",
            "unidades_restantes": cantidad_fisica - validacion["cantidad_validada"],
            "estado_validacion": validacion["estado"]
        }
    
    @staticmethod
    def deshacer_validacion(id_producto, tienda):
        producto = db_mongo.db.productos.find_one({"id": id_producto})
        
        if not producto:
            return {"estado": False, "mensaje": "Producto no encontrado"}
        
        cantidad_fisica = producto[tienda]["cantidad"] 
        fecha_actual = ValidacionStock.obtener_ronda_actual(tienda)
        
        validacion = producto.get("validacion", {})
        
        if not validacion:
            return {"estado": False, "mensaje": "No hay validación para deshacer"}
        
        
        #! Si la cantidad validada es 0, no hay nada que deshacer
        if validacion["cantidad_validada"] == 0:
            validacion["estado"] = "En proceso"
            return  {
                "estado": False,
                "mensaje": "No hay unidades validadas para deshacer",
                "unidades_validadas": validacion["cantidad_validada"],
                "estado_validacion": validacion["estado"]
            }
        
        validacion["cantidad_validada"] -= 1
        
        #! 
        if validacion["cantidad_validada"] < cantidad_fisica:
            validacion["estado"] = "En proceso"
        
        elif validacion["cantidad_validada"] == cantidad_fisica:
            validacion["estado"] = "Validado"
        
        elif validacion["cantidad_validada"] > cantidad_fisica:
            validacion["estado"] = "Discrepancia"
        
        
        db_mongo.db.productos.update_one(
            {"id": id_producto},
            {"$set": {f"{tienda}.validacion": validacion}}
        )
        
        return {
            "estado": True,
            "mensaje": "Validación deshecha correctamente",
            "unidades_validadas": validacion["cantidad_validada"],
            "estado_validacion": validacion["estado"]
        }
    
    @staticmethod
    def iniciar_nueva_ronda(tienda):
        fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db_mongo.db.ultimasIDs.update_one(
            {"coleccion": f"validacion-{tienda}"},
            {"$set": {"fecha": fecha_actual}},
            upsert=True
        )
        return {"estado": True, "fecha_inicio": fecha_actual}
    
    @staticmethod
    def obtener_ronda_actual(tienda):
        ronda = db_mongo.db.ultimasIDs.find_one({ "coleccion": f"validacion-{tienda}" })
        return ronda["fecha"] if ronda else None