from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Resource

from App.Models import UsuarioModel

class Usuario(Resource):
    
    def get(self, id: int):
        # Leer de la base de datos
        return UsuarioModel.put_registrar(id)
        return f"Usuario con ID: {id}"
    
    
    
    # def create_user(username, email, password):
    #     # Validar datos
    #     if UsuarioModel.get_by_username(username):
    #         raise ValueError("Username already exists")
        
    #     # Procesar datos
    #     hashed_password = generate_password_hash(password)
        
    #     # Guardar en la base de datos
    #     user_id = UsuarioModel.create(username, email, hashed_password)
    #     return user_id

    
    # def authenticate_user(username, password):
    #     user = UsuarioModel.get_by_username(username)
    #     if not user or not check_password_hash(password, user['password']):
    #         return None
    #     return user

    
    

    
    # def update_user(user_id, data):
    #     # Validar datos
    #     if 'username' in data and UsuarioModel.get_by_username(data['username']):
    #         raise ValueError("Username already exists")
        
    #     # Procesar datos
    #     if 'password' in data:
    #         data['password'] = generate_password_hash(data['password'])
        
    #     # Actualizar en la base de datos
    #     UsuarioModel.update(user_id, data)