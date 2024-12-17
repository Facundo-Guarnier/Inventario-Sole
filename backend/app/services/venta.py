from datetime import datetime

import pytz
from app.models.ProductoModel import ProductoModel
from app.models.VentaModel import VentaModel
from app.services.movimiento import MovimientoService
from app.services.ultima_id import UltimaIdService


class VentaService:
    def __init__(self) -> None:
        self.movimientos = MovimientoService()
        self.ultima_id_resource = UltimaIdService()
        self.venta_model = VentaModel()
        self.producto_model = ProductoModel()

    def get_by_id(self, id: str) -> tuple:
        """
        Busca una venta por su id.

        Args:
            - id (int): ID de la venta

        Returns:
            - dict: Venta encontrada
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400

        respuesta = self.venta_model.buscar_x_atributo({"id": id})
        if respuesta["estado"]:  #! Sin error con la DB
            if respuesta["respuesta"] is None:  #! No se encontró la venta
                return ({"msg": "No se encontró la venta"}), 404
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404

    def actualizar(self, id: str, datos: dict) -> tuple:
        """
        Actualiza una venta.

        Args:
            - id (str): ID de la venta

        Returns:
            - dict: Venta actualizada
        """

        if not id:
            return ({"msg": "Falta el ID"}), 400

        #! Buscar si existe la venta
        venta_actual = self.venta_model.buscar_x_atributo({"id": id})
        if not venta_actual["estado"] or venta_actual["respuesta"] is None:
            return ({"msg": "No se encontró la venta"}), 404

        venta_actual = venta_actual["respuesta"][0]

        #! Obtener datos a actualizar

        #! Crear diccionario con los datos a actualizar
        nueva_venta = {}

        try:
            nueva_venta["cliente"] = datos["cliente"]
            nueva_venta["total"] = float(datos["total"])
            nueva_venta["tienda"] = datos["tienda"]
            nueva_venta["metodo"] = datos["metodo"]

        except KeyError as e:
            return {"msg": f"Falta el campo {str(e)}"}, 400
        except ValueError:
            return {"msg": "Valor inválido en los parámetros enviados"}, 400
        except Exception as e:
            return {"msg": f"Error en los parámetros enviados: {str(e)}"}, 400

        if nueva_venta["total"] <= 0:
            return ({"msg": "El total no puede ser negativo"}), 400

        movimientos_pendientes = []

        #! Revisar si hay cambios en los productos
        if datos.get("productos"):
            productos2 = []
            productos_actuales = {
                p["idProducto"]: p["cantidad"] for p in venta_actual["productos"]
            }

            for producto in datos["productos"]:
                try:
                    id_producto = producto["idProducto"].upper()
                    cantidad = int(producto["cantidad"])
                    precio = float(producto["precio"])
                    precio_original = float(producto["precio_original"])

                    #! Revisar si el producto existe
                    respuesta1 = self.producto_model.buscar_x_atributo(
                        {"id": id_producto}
                    )
                    if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
                        return {"msg": f"El producto {id_producto} no existe"}, 404

                    #! Revisar si la cantidad y el precio son válidos
                    if cantidad <= 0 or precio <= 0:
                        raise ValueError(
                            "La cantidad y el precio deben ser mayores que cero"
                        )

                    #! Calcular la diferencia en cantidad
                    diferencia = cantidad - productos_actuales.get(id_producto, 0)

                    #! Verificar si hay suficiente stock para la nueva cantidad
                    if diferencia > 0:
                        stock_actual = respuesta1["respuesta"][0][
                            str(nueva_venta["tienda"]).lower()
                        ]["cantidad"]
                        if stock_actual < diferencia:
                            return {
                                "msg": f"No hay suficiente stock del producto {id_producto}. Se necesitan {diferencia} unidades adicionales, pero solo hay {stock_actual} disponibles."
                            }, 400

                    productos2.append(
                        {
                            "idProducto": id_producto,
                            "cantidad": cantidad,
                            "precio": precio,
                            "precio_original": precio_original,
                            "comentario": producto.get("comentario", ""),
                        }
                    )

                    if diferencia != 0:
                        movimientos_pendientes.append(
                            {
                                "movimiento": "Salida" if diferencia > 0 else "Entrada",
                                "idProducto": id_producto,
                                "cantidad": abs(diferencia),
                                "vendedor": "-",
                                "comentario": f"Venta: {id} - Ajuste de cantidad.",
                                "tienda": nueva_venta["tienda"],
                            }
                        )

                except KeyError as e:
                    return {"msg": f"Falta el parámetro {str(e)} en productos"}, 400
                except ValueError as e:
                    return {"msg": f"Error en los datos del producto: {str(e)}"}, 400
                except Exception as e:
                    return {"msg": f"Error procesando los productos: {str(e)}"}, 400

            #! Productos eliminados de la venta
            for id_producto, cantidad in productos_actuales.items():
                if id_producto not in [p["idProducto"] for p in productos2]:
                    movimientos_pendientes.append(
                        {
                            "movimiento": "Entrada",
                            "idProducto": id_producto,
                            "cantidad": cantidad,
                            "vendedor": "-",
                            "comentario": f"Venta: {id} - Producto eliminado.",
                            "tienda": nueva_venta["tienda"],
                        }
                    )

            nueva_venta["productos"] = productos2

        #! Realizar los movimientos
        for mov in movimientos_pendientes:
            respuesta_movimiento = self.movimientos.crear(mov)
            if respuesta_movimiento[1] != 201:
                # TODO lógica para revertir los movimientos ya realizados
                return {
                    "msg": f"Error al actualizar el stock del producto {mov['idProducto']}"
                }, 500

        #! Actualizar venta
        if self.venta_model.actualizar(id, nueva_venta):
            return {"msg": "Venta actualizada y stock ajustado"}, 200
        else:
            # TODO lógica para revertir los movimientos ya realizados
            return {"msg": "Error al actualizar la venta"}, 500

    def eliminar(self, id: str) -> tuple:
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
        venta_actual = self.venta_model.buscar_x_atributo({"id": id})

        if not venta_actual["estado"] or venta_actual["respuesta"] == []:
            return ({"msg": "No se encontró la venta"}), 404

        venta_actual = venta_actual["respuesta"][0]
        productos_venta = venta_actual["productos"]

        #! Crear movimientos para la entrada de productos
        for p in productos_venta:
            respuesta = self.movimientos.crear(
                {
                    "movimiento": "Entrada",
                    "idProducto": p["idProducto"],
                    "cantidad": p["cantidad"],
                    "vendedor": "-",
                    "comentario": f"Venta: {id} - Venta eliminada",
                    "tienda": venta_actual["tienda"],
                }
            )

            if respuesta[1] != 201:
                # TODO lógica para revertir los movimientos ya realizados
                return {
                    "msg": f"Error al actualizar el stock del producto {p['idProducto']} al cancelar la venta"
                }, 500

        #! Eliminar venta
        if self.venta_model.eliminar(id):
            return ({"msg": "Venta eliminada"}), 200
        return ({"msg": respuesta}), 400

    def buscar_por_atributo(self, datos: dict, pagina: int, por_pagina: int):
        """
        Busca ventas en base a los atributos que se pasen.
        Sin atributos, devuelve todas las ventas.
        """

        #! Validar data
        try:
            id = datos.get("id")
            cliente = datos.get("cliente")
            fecha = datos.get("fecha")
            total = datos.get("total")
            tienda = datos.get("tienda")
            metodo_pago = datos.get("metodo")
            productos = datos.get("productos")
            palabra_clave = datos.get("palabra_clave")

        except Exception:
            return ({"msg": "Error en los parámetros enviados"}), 400

        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}

        if id:
            filtro["id"] = id
        if cliente:
            filtro["cliente"] = cliente
        if fecha:
            fecha_inicio, fecha_fin = fecha.split(" al ")
            fecha_inicio = datetime.strptime(fecha_inicio, "%d-%m-%Y")
            fecha_fin = datetime.strptime(fecha_fin, "%d-%m-%Y").replace(
                hour=23, minute=59, second=59
            )
            filtro["fecha"] = {
                "$gte": fecha_inicio.strftime("%Y-%m-%d %H:%M:%S"),
                "$lte": fecha_fin.strftime("%Y-%m-%d %H:%M:%S"),
            }
        if total:
            filtro["total"] = float(total)
        if tienda:
            filtro["tienda"] = tienda
        if metodo_pago:
            filtro["metodo"] = metodo_pago
        if productos:
            filtro["productos"] = productos

        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro["$or"] = [
                {"id": {"$regex": palabra_clave, "$options": "i"}},
                {"cliente": {"$regex": palabra_clave, "$options": "i"}},
                {"fecha": {"$regex": palabra_clave, "$options": "i"}},
                {"total": {"$regex": palabra_clave, "$options": "i"}},
                {"tienda": {"$regex": palabra_clave, "$options": "i"}},
                {"metodo": {"$regex": palabra_clave, "$options": "i"}},
                {
                    "productos": {
                        "$elemMatch": {
                            "$or": [
                                {
                                    "idProducto": {
                                        "$regex": palabra_clave,
                                        "$options": "i",
                                    }
                                },
                                {
                                    "cantidad": {
                                        "$regex": palabra_clave,
                                        "$options": "i",
                                    }
                                },
                                {"precio": {"$regex": palabra_clave, "$options": "i"}},
                                {
                                    "comentario": {
                                        "$regex": palabra_clave,
                                        "$options": "i",
                                    }
                                },
                            ]
                        }
                    }
                },
            ]

        #! Paginación
        saltear = (pagina - 1) * por_pagina
        cantidad_total = self.venta_model.total(filtro=filtro)

        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] is None:
                return ({"msg": "Error al cargar el total de ventas"}), 400
            else:
                cantidad_total = cantidad_total["respuesta"]
        else:
            return {"msg": cantidad_total["respuesta"]}, 404

        #! Buscar
        respuesta = self.venta_model.buscar_x_atributo(
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

    def crear(self, datos: dict) -> tuple:
        """
        Crea una venta.

        Returns:
            - dict: Venta creada
        """

        #! Validar datos
        try:
            cliente = datos["cliente"]
            total = float(datos["total"])
            tienda = datos["tienda"]
            metodo_pago = datos["metodo"]
            productos = datos["productos"]
            vendedor = datos.get("vendedor", "-")
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
                precio_original = float(producto["precio_original"])

                #! Revisar si el producto existe
                respuesta1 = self.producto_model.buscar_x_atributo({"id": id_producto})
                if respuesta1["estado"] and len(respuesta1["respuesta"]) == 0:
                    return {"msg": f"El producto {id_producto} no existe"}, 404

                #! Revisar si hay suficiente stock
                if (
                    respuesta1["respuesta"][0][str(tienda).lower()]["cantidad"]
                    < cantidad
                ):
                    return {
                        "msg": f"No hay suficiente stock del producto {id_producto}"
                    }, 400

                #! Revisar si la cantidad y el precio son válidos
                if cantidad <= 0 or precio <= 0:
                    raise ValueError(
                        "La cantidad y el precio deben ser mayores que cero"
                    )

                productos2.append(
                    {
                        "idProducto": id_producto,
                        "cantidad": cantidad,
                        "precio": precio,
                        "precio_original": precio_original,
                        "comentario": producto.get("comentario", ""),
                    }
                )

                #! Generar movimiento de salida para este producto
                movimientos_pendientes.append(
                    {
                        "movimiento": "Salida",
                        "idProducto": id_producto,
                        "cantidad": cantidad,
                        "vendedor": vendedor,
                        "comentario": f"Venta: {self.ultima_id_resource.calcular_proximo_id('venta')} - Venta creada.",
                        "tienda": tienda,
                    }
                )

            except KeyError as e:
                return {"msg": f"Falta el parámetro {str(e)} en productos"}, 400
            except ValueError as e:
                return {"msg": f"Fallo en los datos del producto: {str(e)}"}, 400
            except Exception as e:
                return {"msg": f"Fallo procesando los productos: {str(e)}"}, 400

        #! Hacer los movimientos
        for mov in movimientos_pendientes:
            respuesta_movimiento = self.movimientos.crear(mov)

            if respuesta_movimiento[1] != 201:
                # TODO lógica para revertir los movimientos ya realizados
                return {
                    "msg": f"Error al actualizar el stock del producto {id_producto}"
                }, 500

        buenos_aires_tz = pytz.timezone("America/Argentina/Buenos_Aires")
        #! Crear venta
        nueva_venta = {
            "id": self.ultima_id_resource.calcular_proximo_id("venta"),
            "cliente": cliente,
            "fecha": datetime.now(buenos_aires_tz).strftime("%Y-%m-%d %H:%M:%S"),
            "total": total,
            "tienda": tienda,
            "metodo": metodo_pago,
            "productos": productos2,
        }

        respuesta = self.venta_model.crear(nueva_venta)
        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return {"msg": "Error al crear la venta"}, 400
            else:
                self.ultima_id_resource.aumentar_id("venta")
                return {"msg": "Venta creada con éxito y stock actualizado"}, 201
        # TODO lógica para revertir los movimientos ya realizados
        return {"msg": respuesta["respuesta"]}, 400
