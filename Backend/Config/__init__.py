import os
from dotenv import load_dotenv

def is_running_in_kubernetes():
    return os.path.exists('/var/run/secrets/kubernetes.io/serviceaccount')

class Config:
    def __init__(self):
        
        #! Revisar si se está ejecutando en Kubernetes o no
        if not is_running_in_kubernetes():
            load_dotenv()
        
        self.SECRET_KEY = os.environ.get('SECRET_KEY')
        self.MONGO_DBNAME = os.environ.get('MONGO_DBNAME')
        self.MONGO_URI = os.environ.get('MONGO_URI')
        self.MONGO_COLLECTIONS = os.environ.get('MONGO_COLLECTIONS', '').split(',')
        self.CONTRA_ADMIN = os.environ.get('CONTRA_ADMIN')
        self.JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
        
        self.BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
        
        #! Imágenes
        self.UPLOAD_FOLDER = os.path.join(self.BASE_DIR, 'uploads')
        self.IMG_SIZE = tuple(map(int, os.environ.get('IMG_SIZE', '960,960').split(',')))
        self.IMG_QUALITY = int(os.environ.get('IMG_QUALITY', '70'))
        
        #! Backup de la DB
        self.CONTRA_BACKUP = os.environ.get('CONTRA_BACKUP')

    def get(self, key, default=None):
        return getattr(self, key, default)