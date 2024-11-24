from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if 'Admin' in claims['roles'] or 'admin' in claims['roles']:
            return fn(*args, **kwargs)
        else:
            return 'Acceso único para administradores', 403
    return wrapper