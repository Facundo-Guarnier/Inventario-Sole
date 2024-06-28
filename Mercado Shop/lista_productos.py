import requests, os  # type: ignore
from dotenv import load_dotenv

load_dotenv()
access_token = os.getenv("TOKEN")
# Define la URL de la API para obtener los ítems del usuario
url = 'https://api.mercadolibre.com/users/me/items/search?status=active'

# Define los encabezados de la solicitud
headers = {
    'Authorization': f'Bearer {access_token}'
}

# Realiza la solicitud GET para obtener la lista de ítems
response = requests.get(url, headers=headers)

# Imprime la respuesta de la solicitud
print(response.status_code)
print(response.json())
