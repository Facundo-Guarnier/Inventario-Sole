
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from App.Models import UltimaIDModel


class UltimaID(Resource):
    
    @jwt_required()
    def get(self, coleccion:str) -> dict:
        """
        Busca la proxima ID de una colección.
        
        Args:
            - coleccion (str): Nombre de la colección
        
        Returns:
            - dict: ID encontrado
        """
        
        if not coleccion:
            return ({"msg": "Faltan datos"}), 400
        
        return UltimaID.calcular_proximo_id(coleccion)
        
    
    @jwt_required()
    def put(self, coleccion:str) -> dict:
        """
        Actualiza el último ID de una colección.
        
        Args:
            - coleccion (str): Nombre de la colección
        
        Returns:
            - dict: ID actualizado
        """
        
        if not coleccion:
            return ({"msg": "Faltan datos"}), 400
        
        respuesta = UltimaIDModel.buscar_id(coleccion)
        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return (f"ID de '{coleccion}' no encontrada"), 404
            else:
                nuevo_id = increment_id(respuesta['respuesta']['id'])
                
                UltimaIDModel.actualizar(coleccion, nuevo_id)
                return {"msg": f"ID de la colección: {coleccion} actualizado a {nuevo_id}"}, 200
        else:
            return ({"msg": respuesta["respuesta"]}), 500
    
    @staticmethod
    def calcular_proximo_id(coleccion:str) -> str:
        """
        Calcula el próximo ID de una colección.
        
        Args:
            - coleccion (str): Nombre de la colección
        
        Returns:
            - str: Próximo ID
        """
        respuesta = UltimaIDModel.buscar_id(coleccion)
        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return ""
            else:
                return increment_id(respuesta['respuesta']['id'])
        else:
            return ""


def base36_decode(s:str) -> int:
    """
    Decodifica un número en base 36 a base 10.
    """
    return int(s, 36)

def base36_encode(num:int) -> str:
    """
    Codifica un número en base 10 a base 36.
    """
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    result = []
    while num > 0:
        num, rem = divmod(num, 36)
        result.append(chars[rem])
    return ''.join(reversed(result))

def increment_id(current_id:str) -> str:
    """
    Incrementa un ID en base 36.
    """
    #! Decodificar el ID actual de base 36 a base 10
    num = base36_decode(current_id)
    #! Incrementar el número
    num += 1
    #! Convertir de nuevo a base 36
    next_id = base36_encode(num)
    #! Asegurar que el nuevo ID tiene el mismo formato que el original
    while len(next_id) < len(current_id):
        next_id = '0' + next_id
    return next_id