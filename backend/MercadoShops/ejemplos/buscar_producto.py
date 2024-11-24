import requests, os  # type: ignore
from dotenv import load_dotenv

load_dotenv()
access_token = os.getenv("TOKEN")

# Define la URL de la API para obtener la información del ítem
item_id = 'MLA1434402073'  # Reemplaza con el ID real del artículo
url = f'https://api.mercadolibre.com/items/{item_id}'

# Define los encabezados de la solicitud
headers = {
    'Authorization': f'Bearer {access_token}'
}

# Realiza la solicitud GET para obtener la información del ítem
response = requests.get(url, headers=headers)

# Imprime la respuesta de la solicitud
print(response.status_code)
print(response.json())
