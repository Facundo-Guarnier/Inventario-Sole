import os
from dotenv import load_dotenv

def is_running_in_kubernetes():
    return os.path.exists('/var/run/secrets/kubernetes.io/serviceaccount')

class Config:
    
    #! Revisar si se está ejecutando en Kubernetes o no
    if not is_running_in_kubernetes():
        load_dotenv()
    
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MONGO_DBNAME = os.environ.get('MONGO_DBNAME')
    MONGO_URI = os.environ.get('MONGO_URI')
    MONGO_COLLECTIONS = os.environ.get('MONGO_COLLECTIONS', '').split(',')
    CONTRA_ADMIN = os.environ.get('CONTRA_ADMIN')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    
    #! Imágenes
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    IMG_SIZE = tuple(map(int, os.environ.get('IMG_SIZE', '960,960').split(',')))
    IMG_QUALITY = int(os.environ.get('IMG_QUALITY', '70'))
    
    #! Backup de la DB
    CONTRA_BACKUP = os.environ.get('CONTRA_BACKUP')
    
    #! Meli
    MESH_CLIENT_ID = os.environ.get('MESH_CLIENT_ID')
    MESH_CLIENT_SECRET = os.environ.get('MESH_CLIENT_SECRET')
    MESH_REDIRECT_URI = os.environ.get('MESH_REDIRECT_URI')
    MESH_AUTH_CODE = os.environ.get('MESH_AUTH_CODE')