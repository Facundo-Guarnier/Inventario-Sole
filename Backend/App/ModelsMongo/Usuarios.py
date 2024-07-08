from App import db_mongo


class UsuarioModel:
    # def __init__(self, username, email, password, roles):
    #     self.username = username
    #     self.email = email
    #     self.password = password
    #     self.roles = roles

    @staticmethod
    def get_by_username(username):
        return db_mongo. users.find_one({"username": username})

    # @staticmethod
    # def create(username, email, password, roles):
    #     user = {
    #         "username": username,
    #         "email": email,
    #         "password": password,
    #         "roles": roles
    #     }
    #     result = db.users.insert_one(user)
    #     return result.inserted_id