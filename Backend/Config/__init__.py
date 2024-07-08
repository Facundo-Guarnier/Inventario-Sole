import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/db-inventario-sole'
    MONGO_DBNAME = os.environ.get('MONGO_DBNAME') or 'db-inventario-sole.db'
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///DataBase.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'