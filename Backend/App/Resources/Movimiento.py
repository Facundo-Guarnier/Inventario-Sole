
from datetime import datetime
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Auth.Decorators import admin_required
from App.Models import MovimientoModel
from App.Resources.UltimaID import UltimaID
from App.Models.Producto import Producto


class Movimiento(Resource):
    def get(self, id:str) -> dict:
        """
        Busca un movimiento por su id.
        
        Args:
            - id (int): ID del movimiento
        
        Returns:
            - dict: Movimiento encontrado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        respuesta = MovimientoModel.buscar_x_atributo({"id": id})
        if respuesta["estado"]:
            if respuesta["respuesta"] == None:
                return ({"msg": "No se encontró el movimiento"}), 404
            return ({"msg":respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    @jwt_required()
    @admin_required
    def put(self, id:str) -> dict:
        """
        Actualiza un movimiento.
        
        Args:
            - id (int): ID del movimiento
        
        Returns:
            - dict: Movimiento actualizado
        """
        # #! Verificar si se puede actualizar el ID
        # if not id:
        #     return {"msg": "Falta el ID"}, 400
        
        # movimiento = MovimientoModel.buscar_x_atributo({"id": id})
        # if not movimiento:
        #     return {"msg": "No se encontró el movimiento"}, 404
        
        # #! Obtener data
        # data = request.json
        # if not data:
        #     return {"msg": "Faltan datos"}, 400
        
        # #! Validar data
        # nuevo_movimiento = {}
        # try:
        #     if "movimiento" in data:
        #         nuevo_movimiento["movimiento"] = data["movimiento"]
            
        #     if "idProducto" in data:
        #         nuevo_movimiento["idProducto"] = data["idProducto"].upper()
            
        #     if "cantidad" in data:
        #         nuevo_movimiento["cantidad"] = float(data["cantidad"])
        #         if nuevo_movimiento["cantidad"] <= 0:
        #             return {"msg": "La cantidad no puede ser negativa o cero"}, 400
            
        #     if "vendedor" in data:
        #         nuevo_movimiento["vendedor"] = data["vendedor"]
            
        #     if "comentario" in data:
        #         nuevo_movimiento["comentario"] = data["comentario"]
        # except ValueError:
        #     return {"msg": "La cantidad debe ser un número válido"}, 400
        # except Exception as e:
        #     return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400
        
        # #! Actualizar movimiento
        # respuesta = MovimientoModel.actualizar(id, nuevo_movimiento)
        # if respuesta["estado"]:
        #     return {"msg": "Movimiento actualizado"}, 200
        # return {"msg": respuesta["respuesta"]}, 404
        return {"msg": "No se puede actualizar un movimiento"}, 400
    
    @jwt_required
    @admin_required
    def delete(self, id:str) -> dict:
        """
        Elimina un movimiento.
        
        Args:
            - id (int): ID del movimiento
        
        Returns:
            - dict: Movimiento eliminado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        respuesta = MovimientoModel.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Movimiento eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 404


class Movimientos(Resource):
    def __init__(self) -> None:
        self.ultima_id_resource = UltimaID()
    
    
    def get(self) -> list:
        """
        Busca movimientos en base a los atributos que se pasen.
        Sin atributos, devuelve todos los movimientos.
        
        Returns:
            - list: Movimientos encontrados
        """
        data = request.args.to_dict()
        
        #! Validar data
        try:
            id = data.get("id")
            movimiento = data.get("movimiento")
            id_producto = data.get("idProducto")
            cantidad = data.get("cantidad")
            vendedor = data.get("vendedor")
            comentario = data.get("comentario")
            fecha = data.get("fecha")
            palabra_clave = data.get("palabra_clave")
            
            pagina = int(request.args.get('pagina', 1))
            por_pagina = int(request.args.get('por_pagina', 10))
        
        except Exception as e:
            return ({"msg": "Error en los parámetros enviados"}), 400
        
        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}
        
        if id:
            filtro['id'] = id
        if movimiento:
            filtro['movimiento'] = movimiento
        if id_producto:
            filtro['idProducto'] = id_producto
        if cantidad:
            filtro['cantidad'] = cantidad
        if vendedor:
            filtro['vendedor'] = vendedor
        if comentario:
            filtro['comentario'] = comentario
        if fecha:
            fecha_inicio, fecha_fin = fecha.split(' al ')
            fecha_inicio = datetime.strptime(fecha_inicio, '%d-%m-%Y')
            fecha_fin = datetime.strptime(fecha_fin, '%d-%m-%Y').replace(hour=23, minute=59, second=59)
            filtro['fecha'] = {
                '$gte': fecha_inicio.strftime('%Y-%m-%d %H:%M:%S'),
                '$lte': fecha_fin.strftime('%Y-%m-%d %H:%M:%S')
            }
        
        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro['$or'] = [
                {"id": {"$regex": palabra_clave, "$options": "i"}},
                {"movimiento": {"$regex": palabra_clave, "$options": "i"}},
                {"idProducto": {"$regex": palabra_clave, "$options": "i"}},
                {"cantidad": {"$regex": palabra_clave, "$options": "i"}},
                {"vendedor": {"$regex": palabra_clave, "$options": "i"}},
                {"comentario": {"$regex": palabra_clave, "$options": "i"}},
                {"fecha": {"$regex": palabra_clave, "$options": "i"}},
            ]
        
        #! Paginación
        saltear = (pagina - 1) * por_pagina
        cantidad_total = MovimientoModel.total(filtro=filtro)
        
        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] == None:
                return ({"msg": "Error al cargar el total de ventas"}), 400
            else:
                cantidad_total = cantidad_total["respuesta"] 
        else: 
            return {"msg": cantidad_total["respuesta"]}, 404
        
        #! Buscar
        respuesta = MovimientoModel.buscar_x_atributo(
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
        Crea un movimiento.
        
        Returns:
            - dict: Movimiento creado
        """
        data = request.json
        if not data:
            return {"msg": "Faltan datos"}, 400
        
        try:
            movimiento = data["movimiento"]
            id_producto = data["idProducto"].upper()
            cantidad = float(data["cantidad"])
            vendedor = data["vendedor"]
            comentario = data.get("comentario")
            tienda = data.get("tienda").lower()
        except KeyError as e:
            return {"msg": f"Falta el parámetro {str(e)}"}, 400
        except ValueError:
            return {"msg": "La cantidad debe ser un número válido"}, 400
        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400
        
        if cantidad <= 0:
            return ({"msg": "La cantidad no puede ser negativa o cero"}), 400
        
        respuesta1 = Producto.buscar_x_atributo({"id": id_producto})
        if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
                return {"msg": "El producto no existe"}, 404
        
        
        #! Crear nuevo movimiento
        nueva_venta = {
            "id": UltimaID.calcular_proximo_id("movimiento"),
            "movimiento": movimiento,
            "idProducto": id_producto,
            "cantidad": cantidad,
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "vendedor": vendedor,
            "comentario": comentario,
            "tienda": tienda,
        }
        
        
        if  movimiento == "Entrada":
            print("ENTRADA:", respuesta1["respuesta"][0][tienda]["cantidad"] + cantidad)
            respuesta3 = Producto.actualizar(id_producto, { tienda: { 
                "cantidad": respuesta1["respuesta"][0][tienda]["cantidad"] + cantidad,
                "precio": respuesta1["respuesta"][0][tienda]["precio"]
            } } )
        elif movimiento == "Salida":
            if respuesta1["respuesta"][0][tienda]["cantidad"] >= cantidad:
                print("SALIDA:", respuesta1["respuesta"][0][tienda]["cantidad"] - cantidad)
                respuesta3 = Producto.actualizar(id_producto, { tienda: { 
                    "cantidad": respuesta1["respuesta"][0][tienda]["cantidad"] - cantidad,
                    "precio": respuesta1["respuesta"][0][tienda]["precio"]
                } } )
            else:
                return {"msg": "No hay suficientes productos en el inventario"}, 400
        else:
            return {"msg": "El movimiento no es válido"}, 400
        
        
        respuesta2 = MovimientoModel.crear(nueva_venta)
        
        if respuesta2["estado"]:
            if respuesta2["respuesta"] is None:
                return {"msg": "No se pudo crear el movimiento"}, 404
            else:
                self.ultima_id_resource.put("movimiento")
                return {"msg": "Movimiento creado"}, 201
        return {"msg": respuesta2["respuesta"]}, 404