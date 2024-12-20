import os  # type: ignore

import requests
from dotenv import load_dotenv

load_dotenv()
access_token = os.getenv("TOKEN")

# Define la URL de la API para actualizar el estado del ítem
item_id = "MLA1434402073"  # Reemplaza con el ID real del artículo
url = f"https://api.mercadolibre.com/items/{item_id}"

# Define los datos para activar la publicación
payload = {
    # "status": "active"
    "status": "paused"
}

# Define los encabezados de la solicitud
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
}

# Realiza la solicitud PUT para actualizar el estado
response = requests.put(url, json=payload, headers=headers)

# Imprime la respuesta de la solicitud
print(response.status_code)
print(response.json())

# {'id': 'MLA1434402073', 'site_id': 'MLA', 'title': 'Item De Test - No Ofertar', 'seller_id': 327259941, 'category_id': 'MLA3530', 'user_product_id': 'MLAU393376618', 'official_store_id': None, 'price': 350000, 'base_price': 350000, 'original_price': None, 'inventory_id': None, 'currency_id': 'ARS', 'initial_quantity': 10, 'available_quantity': 10, 'sold_quantity': 0, 'sale_terms': [{'id': 'WARRANTY_TIME', 'name': 'Tiempo de garantía', 'value_id': None, 'value_name': '90 días', 'value_struct': {'number': 90, 'unit': 'días'}, 'values': [{'id': None, 'name': '90 días', 'struct': {'number': 90, 'unit': 'días'}}], 'value_type': 'number_unit'}, {'id': 'WARRANTY_TYPE', 'name': 'Tipo de garantía', 'value_id': '2230280', 'value_name': 'Garantía del vendedor', 'value_struct': None, 'values': [{'id': '2230280', 'name': 'Garantía del vendedor', 'struct': None}], 'value_type': 'list'}], 'buying_mode': 'buy_it_now', 'listing_type_id': 'gold_special', 'start_time': '2024-06-24T14:49:27.076Z', 'stop_time': '2044-06-19T04:00:00.000Z', 'end_time': '2044-06-19T04:00:00.000Z', 'expiration_time': '2024-09-12T14:49:27.158Z', 'condition': 'new', 'permalink': 'http://articulo.mercadolibre.com.ar/MLA-1434402073-item-de-test-no-ofertar-_JM', 'pictures': [{'id': '742258-MLA77005212188_062024', 'url': 'http://http2.mlstatic.com/resources/frontend/statics/processing-image/1.0.0/O-ES.jpg', 'secure_url': 'https://http2.mlstatic.com/resources/frontend/statics/processing-image/1.0.0/O-ES.jpg', 'size': '500x500', 'max_size': '500x500', 'quality': ''}], 'video_id': None, 'descriptions': [], 'accepts_mercadopago': True, 'non_mercado_pago_payment_methods': [], 'shipping': {'mode': 'not_specified', 'local_pick_up': False, 'free_shipping': False, 'methods': [], 'dimensions': None, 'tags': [], 'logistic_type': 'not_specified', 'store_pick_up': False}, 'international_delivery_mode': 'none', 'seller_address': {'id': 1057757922, 'comment': 'Referencia: Vereda Roja Al Este, Rejas Blancas Entre: Julio A. Roca y Hernán Cortez', 'address_line': 'Rio Tunuyán 1891', 'zip_code': '5521', 'city': {'id': '', 'name': 'Villa Nueva De Guaymallen'}, 'state': {'id': 'AR-M', 'name': 'Mendoza'}, 'country': {'id': 'AR', 'name': 'Argentina'}, 'latitude': -32.892694, 'longitude': -68.77156, 'search_location': {'neighborhood': {'id': '', 'name': ''}, 'city': {'id': '', 'name': ''}, 'state': {'id': 'TUxBUE1FTmE5OWQ4', 'name': 'Mendoza'}}}, 'seller_contact': None, 'location': {}, 'geolocation': {'latitude': -32.892694, 'longitude': -68.77156}, 'coverage_areas': [], 'attributes': [{'id': 'BRAND', 'name': 'Marca', 'value_id': None, 'value_name': 'Marca del producto', 'values': [{'id': None, 'name': 'Marca del producto', 'struct': None}], 'value_type': 'string'}, {'id': 'ITEM_CONDITION', 'name': 'Condición del ítem', 'value_id': '2230284', 'value_name': 'Nuevo', 'values': [{'id': '2230284', 'name': 'Nuevo', 'struct': None}], 'value_type': 'list'}, {'id': 'GTIN', 'name': 'Código universal de producto', 'value_id': None, 'value_name': '7898095297749', 'values': [{'id': None, 'name': '7898095297749', 'struct': None}], 'value_type': 'string'}], 'warnings': [{'department': 'items', 'cause_id': 327, 'code': 'item.status.invalid', 'message': 'Item has pictures download pending and cannot be activated', 'references': ['item.status']}], 'listing_source': '', 'variations': [], 'thumbnail_id': '742258-MLA77005212188_062024', 'thumbnail': 'http://http2.mlstatic.com/resources/frontend/statics/processing-image/1.0.0/I-ES.jpg', 'status': 'paused', 'sub_status': ['picture_download_pending'], 'tags': ['immediate_payment'], 'warranty': 'Garantía del vendedor: 90 días', 'catalog_product_id': None, 'domain_id': 'MLA-UNCLASSIFIED_PRODUCTS', 'seller_custom_field': None, 'parent_item_id': None, 'differential_pricing': None, 'deal_ids': [], 'automatic_relist': False, 'date_created': '2024-06-24T14:49:27.247Z', 'last_updated': '2024-06-24T14:49:27.247Z', 'health': None, 'catalog_listing': False, 'item_relations': [], 'channels': ['marketplace', 'mshops']}
