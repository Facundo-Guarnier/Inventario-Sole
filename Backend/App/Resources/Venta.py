from datetime import datetime
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Models import VentaModel
from App.Resources.UltimaID import UltimaID
from App.Models.Producto import Producto
from App.Resources.Movimiento import Movimientos


class Venta(Resource):
    def __init__(self) -> None:
        self.movimientos = Movimientos()
    
    
    def get(self, id:str) -> dict:
        """
        Busca una venta por su id.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta encontrada
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        respuesta = VentaModel.buscar_x_atributo({"id": id})
        if respuesta["estado"]: #! Sin error con la DB
            if respuesta["respuesta"] == None:  #! No se encontró la venta
                return ({"msg": "No se encontró la venta"}), 404
            return ({"msg":respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    @jwt_required()
    def put(self, id:str) -> dict:
        """
        Actualiza una venta.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Venta actualizada
        """
        
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        #! Buscar si existe la venta
        venta_actual = VentaModel.buscar_x_atributo({"id": id})
        if not venta_actual["estado"] or venta_actual["respuesta"] is None:
            return ({"msg": "No se encontró la venta"}), 404
        
        venta_actual = venta_actual["respuesta"][0]     #? Esta bien?
        
        #! Obtener datos a actualizar
        data = request.json
        if not data:
            return ({"msg": "Faltan datos"}), 400
        
        #! Crear diccionario con los datos a actualizar
        nueva_venta = {}
        
        try: 
            nueva_venta["cliente"] = data["cliente"]
            nueva_venta["total"] = float(data["total"])
            nueva_venta["tienda"] = data["tienda"]
            nueva_venta["metodo"] = data["metodo"]
            
        except KeyError as e:
            return {"msg": f"Falta el campo {str(e)}"}, 400
        except ValueError as e:
            return {"msg": "Valor inválido en los parámetros enviados"}, 400
        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400
        
        if nueva_venta["total"] <= 0:
            return ({"msg": "El total no puede ser negativo"}), 400
        
        movimientos_pendientes = []
        
        #! Revisar si hay cambios en los productos
        if data.get("productos"):
            productos2 = []
            productos_actuales = {p["idProducto"]: p["cantidad"] for p in venta_actual["productos"]}
            
            for producto in data["productos"]:
                try:
                    id_producto = producto["idProducto"].upper()
                    cantidad = int(producto["cantidad"])
                    precio = float(producto["precio"])
                    
                    #! Revisar si el producto existe
                    respuesta1 = Producto.buscar_x_atributo({"id": id_producto})
                    if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
                            return {"msg": f"El producto {id_producto} no existe"}, 404
                    
                    
                    #! Revisar si la cantidad y el precio son válidos
                    if cantidad <= 0 or precio <= 0:
                        raise ValueError("La cantidad y el precio deben ser mayores que cero")
                    
                    productos2.append({
                        "idProducto": id_producto,
                        "cantidad": cantidad,
                        "precio": precio
                    })
                    
                    #! Calcular la diferencia en cantidad
                    diferencia = cantidad - productos_actuales.get(id_producto, 0)
                    
                    #! Verificar si hay suficiente stock para la nueva cantidad
                    if diferencia > 0:
                        stock_actual = respuesta1["respuesta"][0][str(nueva_venta["tienda"]).lower()]["cantidad"]
                        if stock_actual < diferencia:
                            return {"msg": f"No hay suficiente stock del producto {id_producto}. Se necesitan {diferencia} unidades adicionales, pero solo hay {stock_actual} disponibles."}, 400
                    
                    productos2.append({
                        "idProducto": id_producto,
                        "cantidad": cantidad,
                        "precio": precio
                    })
                    
                    if diferencia != 0:
                        movimientos_pendientes.append({
                            "movimiento": "Salida" if diferencia > 0 else "Entrada",
                            "idProducto": id_producto,
                            "cantidad": abs(diferencia),
                            "vendedor": "-",
                            "comentario": f"Ajuste de venta: {id}",
                            "tienda": nueva_venta["tienda"]
                        })
                    
                except KeyError as e:
                    return {"msg": f"Falta el parámetro {str(e)} en productos"}, 400
                except ValueError as e:
                    return {"msg": f"Error en los datos del producto: {str(e)}"}, 400
                except Exception as e:
                    return {"msg": f"Error procesando los productos: {str(e)}"}, 400
            
            #! Productos eliminados de la venta
            for id_producto, cantidad in productos_actuales.items():
                if id_producto not in [p["idProducto"] for p in productos2]:
                    movimientos_pendientes.append({
                        "movimiento": "Entrada",
                        "idProducto": id_producto,
                        "cantidad": cantidad,
                        "vendedor": "-",
                        "comentario": f"Producto eliminado de la venta: {id}",
                        "tienda": nueva_venta["tienda"]
                    })
            
            nueva_venta["productos"] = productos2
        
        #! Realizar los movimientos
        for mov in movimientos_pendientes:
            print("-------------------------", mov)
            respuesta_movimiento = self.movimientos.post(data=mov)
            if respuesta_movimiento[1] != 201:
                #TODO lógica para revertir los movimientos ya realizados
                print("+++++++++++++++++++++++++", respuesta_movimiento)
                return {"msg": f"Error al actualizar el stock del producto {mov['idProducto']}"}, 500
        
        #! Actualizar venta
        respuesta = VentaModel.actualizar(id, nueva_venta)
        if respuesta["estado"]:
            return {"msg": "Venta actualizada y stock ajustado"}, 200
        else:
            #TODO lógica para revertir los movimientos ya realizados
            return {"msg": "Error al actualizar la venta"}, 500
    
    @jwt_required()
    def delete(self, id:str) -> dict:
        """
        Elimina una venta.
        
        Args:
            - id (int): ID de la venta
        
        Returns:
            - dict: Confirmación de eliminación.
        """
        
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        #! Buscar si existe la venta
        venta = VentaModel.buscar_x_atributo({"id": id})
        if not venta["estado"]:
            return ({"msg": venta["respuesta"]}), 404
        if venta["respuesta"] == None:
            return ({"msg": "No se encontró la venta"}), 404
        
        #! Eliminar venta
        respuesta = VentaModel.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Venta eliminada"}), 200
        return ({"msg": respuesta["respuesta"]}), 400


class Ventas(Resource):
    def __init__(self):
        self.ultima_id_resource = UltimaID()
        self.movimientos = Movimientos()
    
    def get(self) -> list:
        """
        Busca ventas en base a los atributos que se pasen.
        Sin atributos, devuelve todas las ventas.
        """
        data = request.args.to_dict()
        
        #! Validar data
        try: 
            id = data.get("id")
            cliente = data.get("cliente")
            fecha = data.get("fecha")
            total = data.get("total")
            tienda = data.get("tienda")
            metodo_pago = data.get("metodo")
            productos = data.get("productos")
            palabra_clave = data.get("palabra_clave")
            
            pagina = int(request.args.get('pagina', 1))
            por_pagina = int(request.args.get('por_pagina', 10))
            
        except Exception as e:
            return ({"msg": "Error en los parámetros enviados"}), 400
        
        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}
        
        if id:
            filtro['id'] = id
        if cliente:
            filtro['cliente'] = cliente
        if fecha:
            fecha_inicio, fecha_fin = fecha.split(' al ')
            fecha_inicio = datetime.strptime(fecha_inicio, '%d-%m-%Y')
            fecha_fin = datetime.strptime(fecha_fin, '%d-%m-%Y').replace(hour=23, minute=59, second=59)
            filtro['fecha'] = {
                '$gte': fecha_inicio.strftime('%Y-%m-%d %H:%M:%S'),
                '$lte': fecha_fin.strftime('%Y-%m-%d %H:%M:%S')
            }
        if total:
            filtro['total'] = float(total)
        if tienda:
            filtro['tienda'] = tienda
        if metodo_pago:
            filtro['metodo'] = metodo_pago
        if productos:
            filtro['productos'] = productos
        
        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro['$or'] = [
                {"id": {"$regex": palabra_clave, "$options": "i"}},
                {"cliente": {"$regex": palabra_clave, "$options": "i"}},
                {"fecha": {"$regex": palabra_clave, "$options": "i"}},
                {"total": {"$regex": palabra_clave, "$options": "i"}},
                {"tienda": {"$regex": palabra_clave, "$options": "i"}},
                {"metodo": {"$regex": palabra_clave, "$options": "i"}},
                {"productos": {
                    "$elemMatch": {
                        "$or": [
                                {"idProducto": {"$regex": palabra_clave, "$options": "i"}},
                                {"cantidad": {"$regex": palabra_clave, "$options": "i"}},
                                {"precio": {"$regex": palabra_clave, "$options": "i"}},
                                {"comentario": {"$regex": palabra_clave, "$options": "i"}}
                            ]
                }}},
            ]
        
        #! Paginación
        saltear = (pagina - 1) * por_pagina
        cantidad_total = VentaModel.total(filtro=filtro)
        
        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] == None:
                return ({"msg": "Error al cargar el total de ventas"}), 400
            else:
                cantidad_total = cantidad_total["respuesta"] 
        else: 
            return {"msg": cantidad_total["respuesta"]}, 404
        
        #! Buscar
        respuesta = VentaModel.buscar_x_atributo(
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
        Crea una venta.
        
        Returns:
            - dict: Venta creada
        """
        data = request.json
        if not data:
            return {"msg": "Faltan datos"}, 400
        
        #! Validar datos
        try:
            cliente = data["cliente"]
            total = float(data["total"])
            tienda = data["tienda"]
            metodo_pago = data["metodo"]
            productos = data["productos"]
            vendedor = data.get("vendedor", "-")
        except KeyError as e:
            return {"msg": f"Falta el parámetro {str(e)}"}, 400
        except ValueError:
            return {"msg": "El total debe ser un número válido"}, 400
        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400
        
        if total <= 0:
            return {"msg": "El total no puede ser negativo o cero"}, 400
        
        if not productos:
            return {"msg": "Faltan datos de productos"}, 400
        
        productos2 = []
        movimientos_pendientes = []
        for producto in productos:
            try:
                id_producto = producto["idProducto"].upper()
                cantidad = int(producto["cantidad"])
                precio = float(producto["precio"])
                
                #! Revisar si el producto existe
                respuesta1 = Producto.buscar_x_atributo({"id": id_producto})
                if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
                        return {"msg": f"El producto {id_producto} no existe"}, 404
                
                #! Revisar si hay suficiente stock
                if respuesta1["respuesta"][0][str(tienda).lower()]["cantidad"] < cantidad:
                    return {"msg": f"No hay suficiente stock del producto {id_producto}"}, 400
                
                #! Revisar si la cantidad y el precio son válidos
                if cantidad <= 0 or precio <= 0:
                    raise ValueError("La cantidad y el precio deben ser mayores que cero")
                
                productos2.append({
                    "idProducto": id_producto,
                    "cantidad": cantidad,
                    "precio": precio
                })
                
                #! Generar movimiento de salida para este producto
                movimientos_pendientes.append({
                    "movimiento": "Salida",
                    "idProducto": id_producto,
                    "cantidad": cantidad,
                    "vendedor": vendedor,
                    "comentario": f"Venta: {self.ultima_id_resource.calcular_proximo_id('venta')}",
                    "tienda": tienda
                })
            
            except KeyError as e:
                return {"msg": f"Falta el parámetro {str(e)} en productos"}, 400
            except ValueError as e:
                return {"msg": f"Fallo en los datos del producto: {str(e)}"}, 400
            except Exception as e:
                return {"msg": f"Fallo procesando los productos: {str(e)}"}, 400
        
        #! Hacer los movimientos
        for mov in movimientos_pendientes:
            respuesta_movimiento = self.movimientos.post(data=mov)
            
            if respuesta_movimiento[1] != 201:
                #TODO lógica para revertir los movimientos ya realizados
                return {"msg": f"Error al actualizar el stock del producto {id_producto}"}, 500
        
        #! Crear venta
        nueva_venta = {
            "id": UltimaID.calcular_proximo_id("venta"),
            "cliente": cliente,
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total": total,
            "tienda": tienda,
            "metodo": metodo_pago,
            "productos": productos2
        }
        
        respuesta = VentaModel.crear(nueva_venta)
        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return {"msg": "Error al crear la venta"}, 400
            else:
                self.ultima_id_resource.put("venta")
                return {"msg": "Venta creada con éxito y stock actualizado"}, 201
        #TODO lógica para revertir los movimientos ya realizados
        return {"msg": respuesta["respuesta"]}, 400