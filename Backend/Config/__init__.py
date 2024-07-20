import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    MONGO_DBNAME = os.environ.get('MONGO_DBNAME')
    MONGO_URI = os.environ.get('MONGO_URI')
    MONGO_COLLECTIONS = os.environ.get('MONGO_COLLECTIONS', '').split(',')
    CONTRA_ADMIN = os.environ.get('CONTRA_ADMIN')
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    
    #! Imágenes
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    IMG_SIZE = tuple(map(int, os.environ.get('IMG_SIZE').split(',')))
    IMG_QUALITY = int(os.environ.get('IMG_QUALITY'))
    
    #! Backup de la DB
    CONTRA_BACKUP = os.environ.get('CONTRA_BACKUP')
    
    # print("Configuración cargada.", \
    #     f"SECRET_KEY {SECRET_KEY}", \
    #     f"MONGO_DBNAME {MONGO_DBNAME}", \
    #     f"MONGO_URI {MONGO_URI}", \
    #     f"MONGO_COLLECTIONS {MONGO_COLLECTIONS}", \
    #     f"CONTRA_ADMIN {CONTRA_ADMIN}", \
    #     f"JWT_SECRET_KEY {JWT_SECRET_KEY}", \
    #     f"BASE_DIR {BASE_DIR}", \
    #     f"UPLOAD_FOLDER {UPLOAD_FOLDER}", \
    #     f"IMG_SIZE {IMG_SIZE}", \
    #     f"IMG_QUALITY {IMG_QUALITY}", \
    #     f"CONTRA_BACKUP {CONTRA_BACKUP}", \
    #     sep='\n'
    # )