from flask import jsonify
from . import api_bp
from app.utils.jwt import admin_required

@api_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    # Lógica para obtener usuarios
    return jsonify({"msg": "List of users"}), 200


@api_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    # Lógica para obtener un usuario específico
    return jsonify({"msg": f"Details of user {user_id}"}), 200