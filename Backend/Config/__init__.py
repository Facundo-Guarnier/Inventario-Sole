import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/db-inventario-sole'
    MONGO_DBNAME = os.environ.get('MONGO_DBNAME') or 'db-inventario-sole.db'
    MONGO_COLLECTIONS = os.environ.get('MONGO_COLLECTIONS') or ['usuarios', 'productos', 'movimientos', 'ventas', "regalos", "gift_cards", "ultimasIDs"]
    CONTRA_ADMIN = os.environ.get('CONTRA_ADMIN') or 'admin1234'
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'