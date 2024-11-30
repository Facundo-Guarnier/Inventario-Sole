from app.models.UsuarioModel import UsuarioModel
from werkzeug.security import generate_password_hash


class UsuarioService:
    def __init__(self):
        self.usuario_model = UsuarioModel()

    def buscar_por_alias(self, alias: str):
        """
        Busca un usuario por su alias.

        Args:
            - alias (str): Alias del usuario

        Returns:
            - dict: Usuario encontrado (alias y roles)
        """

        respuesta = self.usuario_model.buscar_x_alias(alias)
        if respuesta["estado"]:
            if respuesta["respuesta"] is None:
                return (f"Usuario con alias: {alias} no encontrado"), 404

            else:
                del respuesta["respuesta"]["_id"]
                del respuesta["respuesta"]["contraseña"]
                return respuesta["respuesta"], 200

    def actualizar(self, alias: str, datos: dict) -> tuple:
        """
        Actualiza un usuario.

        Args:
            - alias (str): Alias del usuario

        Returns:
            - dict: Usuario actualizado
        """

        #! Buscar si existe el usuario
        usuario_actual = self.usuario_model.buscar_x_alias(alias)
        if not usuario_actual["respuesta"]:
            return ({"msg": "No se encontró el usuario"}), 404

        #! Obtener datos a actualizar

        #! Crear diccionario con los datos a actualizar
        nuevo_usuario = {}
        nuevo_usuario["roles"] = datos["roles"]

        if datos.get("contraseña"):  #! Opcional
            nuevo_usuario["contraseña"] = generate_password_hash(datos["contraseña"])

        print("Nuevo usuario:", nuevo_usuario)
        #! Actualizar usuario
        respuesta = self.usuario_model.actualizar(alias, nuevo_usuario)
        if respuesta["estado"]:
            return {"msg": "Usuario actualizado"}, 200
        return {"msg": respuesta["respuesta"]}, 404

    def eliminar(self, alias: str) -> tuple:
        """
        Elimina un usuario.

        Args:
            - alias (str): Alias del usuario

        Returns:
            - dict: Usuario eliminado
        """
        #! Buscar si existe el usuario
        usuario_actual = self.usuario_model.buscar_x_alias(alias)
        if not usuario_actual:
            return ({"msg": "No se encontró el usuario"}), 404

        #! Eliminar usuario
        respuesta = self.usuario_model.eliminar(alias)
        if respuesta["estado"]:
            return ({"msg": "Usuario eliminado"}), 200
        return ({"msg": respuesta["respuesta"]}), 404

    def buscar_todos(self, pagina: int, por_pagina: int) -> tuple:
        """
        Busca todos los usuarios.

        Returns:
            - dict: Lista de usuarios
        """

        #! Paginación
        saltear = (pagina - 1) * por_pagina
        cantidad_total = self.usuario_model.total({})

        if cantidad_total["estado"]:
            if cantidad_total["respuesta"] is None:
                return ({"msg": "Error al cargar el total de ventas"}), 400
            else:
                cantidad_total = cantidad_total["respuesta"]
        else:
            return {"msg": cantidad_total["respuesta"]}, 404

        respuesta = self.usuario_model.buscar_x_atributo(
            filtro={},
            saltear=saltear,
            por_pagina=por_pagina,
        )
        if respuesta["estado"]:
            usuarios = respuesta["respuesta"]
            for usuario in usuarios:
                del usuario["_id"]
                del usuario["contraseña"]
            return {
                "usuarios": usuarios,
                "total": cantidad_total,
            }, 200
        return {"msg": respuesta["respuesta"]}, 404
