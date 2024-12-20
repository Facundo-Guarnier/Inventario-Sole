from datetime import datetime

import pytz
from app.models.ProductoModel import ProductoModel
from app.services.foto import FotoService
from app.services.ultima_id import UltimaIdService


class ProductoService:
    def __init__(self) -> None:
        self.fotoResource = FotoService()
        self.ultima_id_resource = UltimaIdService()
        self.producto_model = ProductoModel()

    def buscar_por_id(self, id: str) -> tuple:
        """
        Busca una producto por su id.

        Args:
            - id (int): ID del producto

        Returns:
            - dict: Producto encontrado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400

        respuesta = self.producto_model.buscar_x_atributo({"id": id})
        if respuesta["estado"]:  #! Sin error con la DB
            if respuesta["respuesta"] is None:  #! No se encontró el producto
                return ({"msg": "No se encontró el producto"}), 404
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404

    def actualizar(self, id: str, datos: dict) -> tuple:
        """
        Actualiza una producto.

        Args:
            - id (int): ID del producto

        Returns:
            - dict: Producto actualizado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400

        #! Buscar si existe el producto
        viejo_producto = self.producto_model.buscar_x_atributo({"id": id})
        if not viejo_producto:
            return ({"msg": "No se encontró el producto"}), 404

        #! Validar datos
        cod_ms = datos.get("cod_ms")
        marca = datos.get("marca")
        descripcion = datos.get("descripcion")
        talle = datos.get("talle")
        fisica = datos.get("fisica")
        online = datos.get("online")
        liquidacion = datos.get("liquidacion")
        fotos = datos.get("fotos")

        if (
            not cod_ms
            or not marca
            or not descripcion
            or not talle
            or not fisica
            or not online
            or liquidacion is None
            or not fotos
        ):
            return ({"msg": "Faltan datos"}), 400

        #! Validar tiendas
        try:
            fisica["precio"] = float(fisica["precio"])
            fisica["cantidad"] = int(fisica["cantidad"])
            online["precio"] = float(online["precio"])
            online["cantidad"] = int(online["cantidad"])

        except Exception:
            return ({"msg": "Error en los parámetros enviados"}), 400

        if (
            fisica["precio"] <= 0
            or fisica["cantidad"] < 0
            or online["precio"] <= 0
            or online["cantidad"] < 0
        ):
            return ({"msg": "Los precios y cantidades deben ser mayores a 0"}), 400

        #! Crear diccionario con los datos a actualizar
        nuevo_producto = {
            "id": id,
            "cod_ms": cod_ms,
            "marca": marca,
            "descripcion": descripcion,
            "talle": talle,
            "fisica": fisica,
            "online": online,
            "liquidacion": liquidacion,
            "fotos": fotos,
        }

        #! Actualizar producto
        respuesta = self.producto_model.actualizar(id, nuevo_producto)
        if respuesta["estado"]:

            #! Borra las fotos que no se usan
            fotos_nuevas_nombre = []
            for f in nuevo_producto[
                "fotos"
            ]:  #! Ej: [00026/resized_Pic_20240204_165151_4096x2160.png', ...]
                foto = f.split("/")[-1]
                fotos_nuevas_nombre.append(foto)
            self.fotoResource.eliminar_fotos_viejas_producto(id, fotos_nuevas_nombre)

            return ({"msg": "Producto actualizada"}), 200

        return ({"msg": respuesta["respuesta"]}), 400

    def eliminar(self, id: str) -> tuple:
        """
        Elimina una producto.

        Args:
            - id (int): ID del producto

        Returns:
            - dict: Producto eliminado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400

        #! Buscar si existe el producto
        producto = self.producto_model.buscar_x_atributo({"id": id})
        if not producto:
            return ({"msg": "No se encontró el producto"}), 404

        #! Eliminar producto
        respuesta = self.producto_model.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Producto eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 400

    def buscar_por_filtro(self, filtro: dict, pagina: int, por_pagina: int) -> tuple:
        """
        Busca productos en base a los atributos que se pasen.
        Sin atributos, devuelve todas las productos.
        """

        #! Validar filtro
        try:
            id = filtro.get("id")
            cod_ms = filtro.get("cod_ms")
            marca = filtro.get("marca")
            descripcion = filtro.get("descripcion")
            talle = filtro.get("talle")
            fisica = filtro.get("fisica")
            online = filtro.get("online")
            liquidacion = filtro.get("liquidacion")
            palabra_clave = filtro.get("palabra_clave")
            tienda = filtro.get("tienda")

        except Exception:
            return ({"msg": "Error en los parámetros enviados"}), 400

        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}

        if id:
            filtro["id"] = id
        if cod_ms:
            filtro["cod_ms"] = cod_ms
        if marca:
            filtro["marca"] = marca
        if descripcion:
            filtro["descripcion"] = descripcion
        if talle:
            filtro["talle"] = talle
        if fisica:
            filtro["fisica"] = fisica
        if online:
            filtro["online"] = online
        if liquidacion:
            if liquidacion.lower() in ["true", "si", "sí"]:
                liquidacion = True
            elif liquidacion.lower() in ["false", "no"]:
                liquidacion = False
            filtro["liquidacion"] = liquidacion

        #! Filtro por tienda con stock
        if tienda:
            if (
                tienda.lower() == "todos"
            ):  #! No filtra para mostrar todos los productos (con/sin stock)
                pass
            elif tienda.lower() == "fisica":
                filtro["fisica.cantidad"] = {"$gte": 1}
            elif tienda.lower() == "online":
                filtro["online.cantidad"] = {"$gte": 1}

        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            try:
                #! Si la palabra clave es un número, busca en los campos numéricos
                numero_clave = float(palabra_clave)
                filtro["$or"] = [
                    {"id": {"$regex": palabra_clave, "$options": "i"}},
                    {"cod_ms": {"$regex": palabra_clave, "$options": "i"}},
                    {"marca": {"$regex": palabra_clave, "$options": "i"}},
                    {"descripcion": {"$regex": palabra_clave, "$options": "i"}},
                    {"talle": {"$regex": palabra_clave, "$options": "i"}},
                    {"fisica.precio": numero_clave},
                    {"fisica.cantidad": numero_clave},
                    {"online.precio": numero_clave},
                    {"online.cantidad": numero_clave},
                    {"liquidacion": {"$regex": palabra_clave, "$options": "i"}},
                ]
            except ValueError:
                #! Si no se puede convertir a número, usa solo búsqueda de texto
                filtro["$or"] = [
                    {"id": {"$regex": palabra_clave, "$options": "i"}},
                    {"cod_ms": {"$regex": palabra_clave, "$options": "i"}},
                    {"marca": {"$regex": palabra_clave, "$options": "i"}},
                    {"descripcion": {"$regex": palabra_clave, "$options": "i"}},
                    {"talle": {"$regex": palabra_clave, "$options": "i"}},
                    {"liquidacion": {"$regex": palabra_clave, "$options": "i"}},
                ]

        #! Paginación
        saltear = (pagina - 1) * por_pagina
        cantidad_total = self.producto_model.total(filtro)

        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] is None:
                return ({"msg": "Error al cargar el total de ventas"}), 400
            else:
                cantidad_total = cantidad_total["respuesta"]
        else:
            return {"msg": cantidad_total["respuesta"]}, 404

        #! Buscar productos
        respuesta = self.producto_model.buscar_x_atributo(
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
        Crea una producto.

        Returns:
            - dict: Producto creado
        """
        print("++++DATOS DEL PRODUCTO NUEVO:", datos)
        # {'id': '00027', 'titulo': 'pantalon ', 'liquidacion': False, 'dominio': 'Ropa y Accesorios > Pantalones', 'BRAND': 'generico',
        # 'MODEL': 'pantalon2000', 'GENDER': 'Mujer', 'COLOR': 'Coral', 'SIZE': '28', 'MAIN_MATERIAL': 'Lana',
        # 'PANT_TYPE': 'Pantalón', 'dominioObj': {'domain_id': 'MLA-PANTS', 'domain_name': 'Pantalones', 'category_id': 'MLA109282',
        # 'category_name': 'Pantalones', 'attributes': [], 'path_completo': 'Ropa y Accesorios > Pantalones'}, 'fisica': {'precio': 100, 'cantidad': 100},
        # 'online': {'precio': 200, 'cantidad': 200}, 'fotos': ['00027/resized_pngtree-tech-color-offline-color-twitch-design-banner-background-image_520015.jpg']}
        return ({"msg": "En construcción"}), 400

        cod_ms = datos.get("cod_ms")
        marca = datos.get("marca")
        descripcion = datos.get("descripcion")
        talle = datos.get("talle")
        fisica = datos.get("fisica")
        online = datos.get("online")
        liquidacion = datos.get("liquidacion")
        fotos = datos.get("fotos")

        if (
            not cod_ms
            or not marca
            or not descripcion
            or not talle
            or not fisica
            or not online
            or liquidacion is None
            or not fotos
        ):
            return ({"msg": "Faltan datos"}), 400

        #! Validar tiendas
        try:
            fisica["precio"] = float(fisica["precio"])
            fisica["cantidad"] = int(fisica["cantidad"])
            online["precio"] = float(online["precio"])
            online["cantidad"] = int(online["cantidad"])

        except Exception:
            return ({"msg": "Error en los parámetros enviados"}), 400

        if (
            fisica["precio"] <= 0
            or fisica["cantidad"] < 0
            or online["precio"] <= 0
            or online["cantidad"] < 0
        ):
            return ({"msg": "Los precios y cantidades deben ser mayores a 0"}), 400

        buenos_aires_tz = pytz.timezone("America/Argentina/Buenos_Aires")
        #! Crear el objeto de validación con la fecha actual
        validacion = {
            "ultima_fecha": datetime.now(buenos_aires_tz).strftime("%Y-%m-%d"),
            "cantidad_validada": 0,
            "estado": "En proceso",
        }

        #! Agregar validación a física y online
        fisica["validacion"] = validacion.copy()
        online["validacion"] = validacion.copy()

        respuesta = self.producto_model.crear(
            {
                "id": self.ultima_id_resource.calcular_proximo_id("producto"),
                "cod_ms": cod_ms,
                "marca": marca,
                "descripcion": descripcion,
                "talle": talle,
                "fisica": fisica,
                "online": online,
                "liquidacion": liquidacion,
                "fotos": fotos,
            }
        )

        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return ({"msg": "Error al crear el producto"}), 400
            else:
                self.ultima_id_resource.put("producto")
                return ({"msg": "Producto creado con éxito"}), 201
        return ({"msg": respuesta["respuesta"]}), 400
