from App.Models.Usuarios import UsuarioModel
from werkzeug.security import generate_password_hash, check_password_hash

class UserService:
    @staticmethod
    def create_user(username, email, password):
        # Validar datos
        if UsuarioModel.get_by_username(username):
            raise ValueError("Username already exists")
        
        # Procesar datos
        hashed_password = generate_password_hash(password)
        
        # Guardar en la base de datos
        user_id = UsuarioModel.create(username, email, hashed_password)
        return user_id

    @staticmethod
    def authenticate_user(username, password):
        user = UsuarioModel.get_by_username(username)
        if not user or not check_password_hash(password, user['password']):
            return None
        return user

    @staticmethod
    def get_user_by_id(user_id):
        # Leer de la base de datos
        return UsuarioModel.get_by_id(user_id)

    @staticmethod
    def update_user(user_id, data):
        # Validar datos
        if 'username' in data and UsuarioModel.get_by_username(data['username']):
            raise ValueError("Username already exists")
        
        # Procesar datos
        if 'password' in data:
            data['password'] = hash_password(data['password'])
        
        # Actualizar en la base de datos
        UsuarioModel.update(user_id, data)