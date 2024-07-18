from flask_jwt_extended import jwt_required
from flask_restful import Resource


class RevisarStock(Resource):
    @jwt_required
    def get(self):
        return {'message': 'Revisar Stock'}

    def post(self):
        return {'message': 'Revisar Stock2'}

    def put(self):
        return {'message': 'Revisar Stock'}

    def delete(self):
        return {'message': 'Revisar Stock'}