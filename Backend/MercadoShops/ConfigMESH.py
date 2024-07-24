import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MESH_CLIENT_ID = os.environ.get('MESH_CLIENT_ID')
    MESH_CLIENT_SECRET = os.environ.get('MESH_CLIENT_SECRET')
    MESH_REDIRECT_URI = os.environ.get('MESH_REDIRECT_URI')
    MESH_AUTH_CODE = os.environ.get('MESH_AUTH_CODE')