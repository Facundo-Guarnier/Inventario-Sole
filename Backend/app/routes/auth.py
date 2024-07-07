from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user import User
from app.utils.jwt import admin_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = User.get_by_username(username)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@auth_bp.route('/register', methods=['POST'])
@admin_required
def register():
    username = request.json.get('username', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    roles = request.json.get('roles', ['user'])

    if User.get_by_username(username):
        return jsonify({"msg": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    user_id = User.create(username, email, hashed_password, roles)

    return jsonify({"msg": "User created successfully", "user_id": str(user_id)}), 201