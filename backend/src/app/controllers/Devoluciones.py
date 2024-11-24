
from datetime import datetime
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource
import pytz

from App.Models import DevolucionModel
from App.Models.Producto import Producto
from App.Resources.Movimiento import Movimientos

class Devoluciones(Resource):
    def __init__(self):
        self.movimientos = Movimientos()
        
    def get(self) -> list:
        """
        Busca todas las devoluciones en base a los atributos que se pasen.
        Sin atributos, devuelve todos las devoluciones.
        
        Returns:
            list: Lista de devoluciones.
        """
        
        data = request.args.to_dict()
        filtro = {}
        
        #! Paginación
        pagina = int(request.args.get('pagina', 1))
        por_pagina = int(request.args.get('por_pagina', 10))
        
        saltear = (pagina - 1) * por_pagina
        cantidad_total = DevolucionModel.total(filtro=filtro)
        
        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] == None:
                return ({"msg": "Error al cargar el total."}), 400
            else:
                cantidad_total = cantidad_total["respuesta"] 
        else: 
            return {"msg": cantidad_total["respuesta"]}, 404
        
        #! Buscar
        respuesta = DevolucionModel.buscar_x_atributo(
            filtro=filtro, 
            saltear=saltear, 
            por_pagina=por_pagina,
        )
        
        if respuesta["estado"]:
            return {
                "msg": respuesta["respuesta"],
                "total": cantidad_total,
                }, 200
        return {"msg": respuesta["respuesta"]}, 404
    
    @jwt_required()
    def post(self) -> dict:
        """
        Crea una devolución.
        
        Returns:
            - dict: Devolucion creada
        """
        
        data = request.json
        if not data:
            return {"msg": "Faltan datos"}, 400
        
        #! Validar datos
        try:
            id_producto = data["id"].upper()
            cantidad = float(data["cantidad"])
            tienda = data.get("tienda").lower()
            comentario = data.get("comentario", "-")
            
        except KeyError as e:
            return {"msg": f"Falta el parámetro {str(e)}"}, 400
        except ValueError:
            return {"msg": "La cantidad debe ser un número válido."}, 400
        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400
        
        if cantidad <= 0:
            return {"msg": "La cantidad debe ser mayor a 0."}, 400
        
        respuesta1 = Producto.buscar_x_atributo({"id": id_producto})
        if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
                return {"msg": "El producto no existe"}, 404
        
        
        #! Crear movimiento
        movimiento_data = {
            "movimiento": "Entrada",
            "idProducto": id_producto,
            "cantidad": cantidad,
            "vendedor": "-",
            "comentario": "Devolución de producto",
            "tienda": tienda
        }
        
        respuesta_movimiento = self.movimientos.post(movimiento_data)
        
        if respuesta_movimiento[1] != 201:
            return {"msg": "Error al actualizar el stock"}, 500
        
        buenos_aires_tz = pytz.timezone('America/Argentina/Buenos_Aires')
        #! Crear devolución
        nueva_Devolucion = {
            "id_producto":id_producto,
            "cantidad":cantidad,
            "tienda":tienda,
            "fecha_devolucion": datetime.now(buenos_aires_tz).strftime("%Y-%m-%d %H:%M:%S"),
            "descripcion_producto":respuesta1["respuesta"][0]["descripcion"],
            "comentario": comentario,
        }
        
        respuesta3 = DevolucionModel.crear(nueva_Devolucion)
        
        
        if respuesta3["estado"]:
            if respuesta3["respuesta"] is None:
                return {"msg": "No se pudo crear la devolucion"}, 404
            else:
                return {"msg": "Devolucion creada"}, 201
        return {"msg": respuesta3["respuesta"]}, 404