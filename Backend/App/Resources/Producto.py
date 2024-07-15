from datetime import datetime
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from App.Models import ProductoModel
from App.Resources.UltimaID import UltimaID


class Producto(Resource):
    def get(self, id:str) -> dict:
        """
        Busca una producto por su id.
        
        Args:
            - id (int): ID del producto
        
        Returns:
            - dict: Producto encontrado
        """
        if not id:
            return ({"msg": "Falta el ID"}), 400
        
        respuesta = ProductoModel.buscar_x_atributo({"id": id})
        if respuesta["estado"]: #! Sin error con la DB
            if respuesta["respuesta"] == None:  #! No se encontró el producto
                return ({"msg": "No se encontró el producto"}), 404
            return ({"msg":respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    @jwt_required()
    def put(self, id:str) -> dict:
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
        producto = ProductoModel.buscar_x_atributo({"id": id})
        if not producto:
            return ({"msg": "No se encontró el producto"}), 404
        
        #! Obtener datos a actualizar
        data = request.json
        if not data:
            return ({"msg": "Faltan datos"}), 400
        
        
        #! Validar data
        cod_ms = data.get("cod_ms")
        marca = data.get("marca")
        descripcion = data.get("descripcion")
        talle = data.get("talle")
        fisica = data.get("fisica")
        online = data.get("online")
        liquidacion = data.get("liquidacion")
        fotos = data.get("fotos")
        
        if not cod_ms or \
        not marca or \
        not descripcion or \
        not talle or \
        not fisica or \
        not online or \
        liquidacion is None  or \
        not fotos:
            return ({"msg": "Faltan datos"}), 400
        
        #! Crear diccionario con los datos a actualizar
        nueva_producto = {
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
        
        print(nueva_producto)
        
        #! Actualizar producto
        respuesta = ProductoModel.actualizar(id, data)
        if respuesta["estado"]:
            return ({"msg": "Producto actualizada"}), 200
        return ({"msg": respuesta["respuesta"]}), 400
    
    @jwt_required()
    def delete(self, id:str) -> dict:
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
        producto = ProductoModel.buscar_x_atributo({"id": id})
        if not producto:
            return ({"msg": "No se encontró el producto"}), 404
        
        #! Eliminar producto
        respuesta = ProductoModel.eliminar(id)
        if respuesta["estado"]:
            return ({"msg": "Producto eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 400


class Productos(Resource):
    def __init__(self):
        self.ultima_id_resource = UltimaID()
        
    def get(self) -> list:
        """
        Busca productos en base a los atributos que se pasen.
        Sin atributos, devuelve todas las productos.
        """
        data = request.args.to_dict()
        
        #! Validar data
        id = data.get("id")
        cod_ms = data.get("cod_ms")
        marca = data.get("marca")
        descripcion = data.get("descripcion")
        talle = data.get("talle")
        fisica = data.get("fisica")
        online = data.get("online")
        liquidacion = data.get("liquidacion")
        fotos = data.get("fotos")
        palabra_clave = data.get("palabra_clave")
        
        #! Añadir condiciones al filtro si se proporcionan
        filtro = {}
        
        if id:
            filtro['id'] = id
        if cod_ms:
            filtro['cod_ms'] = cod_ms
        if marca:
            filtro['marca'] = marca
        if descripcion:
            filtro['descripcion'] = descripcion
        if talle:
            filtro['talle'] = talle
        if fisica:
            filtro['fisica'] = fisica
        if online:
            filtro['online'] = online
        if liquidacion:
            if liquidacion == "true" or liquidacion == "True" or liquidacion == "Si" or liquidacion == "si" or liquidacion == "Sí" or liquidacion == "sí":
                liquidacion = True
            elif liquidacion == "false" or liquidacion == "False" or liquidacion == "No" or liquidacion == "no":
                liquidacion = False
            filtro['liquidacion'] = liquidacion
        if fotos:
            filtro['fotos'] = fotos
        
        #! Búsqueda de palabra clave en los campos relevantes
        if palabra_clave:
            filtro['$or'] = [
                {"id": {"$regex": palabra_clave, "$options": "i"}},
                {"cod_ms": {"$regex": palabra_clave, "$options": "i"}},
                {"marca": {"$regex": palabra_clave, "$options": "i"}},
                {"descripcion": {"$regex": palabra_clave, "$options": "i"}},
                {"talle": {"$regex": palabra_clave, "$options": "i"}},
                {"fisica": {"$regex": palabra_clave, "$options": "i"}},
                {"online": {"$regex": palabra_clave, "$options": "i"}},
                {"liquidacion": {"$regex": palabra_clave, "$options": "i"}},
                {"fotos": {"$regex": palabra_clave, "$options": "i"}},
                
            ]
        respuesta = ProductoModel.buscar_x_atributo(filtro)
        print(filtro)
        if respuesta["estado"]:
            return ({"msg": respuesta["respuesta"]}), 200
        return ({"msg": respuesta["respuesta"]}), 404
    
    @jwt_required()
    def post(self) -> dict:
        """
        Crea una producto.
        
        Returns:
            - dict: Producto creado
        """
        data = request.json
        
        cod_ms = data.get("cod_ms")
        marca = data.get("marca")
        descripcion = data.get("descripcion")
        talle = data.get("talle")
        fisica = data.get("fisica")
        online = data.get("online")
        liquidacion = data.get("liquidacion")
        fotos = data.get("fotos")
        
        if not cod_ms or \
        not marca or \
        not descripcion or \
        not talle or \
        not fisica or \
        not online or \
        liquidacion is None  or \
        not fotos:
            return ({"msg": "Faltan datos"}), 400
        
        respuesta = ProductoModel.crear(
            {
                "id": UltimaID.calcular_proximo_id("producto"),
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
            if respuesta["respuesta"] == None:
                return ({"msg": "Error al crear el producto"}), 400
            
            else:
                self.ultima_id_resource.put("producto")
                return ({"msg": "Producto creado con éxito"}), 201
        return ({"msg": respuesta["respuesta"]}), 400