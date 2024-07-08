from flask import Blueprint

api_bp = Blueprint('api', __name__)

from . import Auth, other_routes

# Import and register other route modules here