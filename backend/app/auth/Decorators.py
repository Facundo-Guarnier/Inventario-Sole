from functools import wraps

from flask_jwt_extended import get_jwt, verify_jwt_in_request


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if "Admin" in claims["roles"] or "admin" in claims["roles"]:
            return fn(*args, **kwargs)
        else:
            return "Acceso único para administradores", 403

    return wrapper
