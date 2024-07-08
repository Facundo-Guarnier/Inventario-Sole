from flask import request, jsonify
from flask_jwt_extended import create_access_token
from Backend.App.Services.Usuarios import UserService
from . import api_bp

@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    try:
        user_id = UserService.create_user(
            data['username'], 
            data['email'], 
            data['password']
        )
        return jsonify({"msg": "User created successfully", "user_id": str(user_id)}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@api_bp.route('/auth/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    user = UserService.authenticate_user(username, password)
    if not user:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200