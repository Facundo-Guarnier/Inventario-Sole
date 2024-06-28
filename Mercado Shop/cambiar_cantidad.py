import requests, os  # type: ignore
from dotenv import load_dotenv

load_dotenv()
access_token = os.getenv("TOKEN")

# Define la URL de la API para actualizar la cantidad disponible del ítem
item_id = 'MLA1434402073'  # Reemplaza con el ID real del artículo
url = f'https://api.mercadolibre.com/items/{item_id}'

# Define los datos para actualizar la cantidad disponible
payload = {
    "available_quantity": 1  # Reemplaza con la cantidad nueva
}

# Define los encabezados de la solicitud
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

# Realiza la solicitud PUT para actualizar la cantidad disponible
response = requests.put(url, json=payload, headers=headers)

# Imprime la respuesta de la solicitud
print(response.status_code)
print(response.json())
