import os  # type: ignore

import requests
from dotenv import load_dotenv

load_dotenv()
access_token = os.getenv("TOKEN")

# Define la URL de la API para actualizar el ítem
item_id = "MLA1434402073"  # Reemplaza con el ID real del artículo
url = f"https://api.mercadolibre.com/items/{item_id}/description?api_version=2"

# Define los datos para cambiar el canal de publicación a Mercado Shop
payload = {"plain_text": "Esta es una descripción del producto de prueba. No ofertar."}

# Define los encabezados de la solicitud
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
}

# Realiza la solicitud PUT para actualizar el canal de publicación
response = requests.put(url, json=payload, headers=headers)

# Imprime la respuesta de la solicitud
print(response.status_code)
print(response.json())

# {'text': None, 'plain_text': 'Esta es una descripción del producto de prueba. No ofertar.', 'last_updated': '2024-06-24T15:12:35.057Z', 'date_created': '2024-06-24T15:12:35.057Z'}
