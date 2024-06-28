import requests, os  # type: ignore
from dotenv import load_dotenv

load_dotenv()

# Definir la URL y los parámetros
url = "https://api.mercadolibre.com/oauth/token"
params = {
    "grant_type": "authorization_code",
    "client_id": os.getenv("CLIENT_ID"),
    "client_secret": os.getenv("CLIENT_SECRET"),
    "code": os.getenv("CODE"),
    "redirect_uri": os.getenv("REDIRECT_URI")
}

# Hacer la solicitud POST
response = requests.post(url, data=params)

# Verificar si la solicitud fue exitosa
if response.status_code == 200:
    # Convertir la respuesta JSON a un diccionario de Python
    token_data = response.json()
    print("Token data:", token_data["access_token"])
else:
    print(f"Error {response.status_code}: {response.text}")
