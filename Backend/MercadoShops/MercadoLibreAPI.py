import datetime, os, requests, time, json, base64, mimetypes
from requests_toolbelt.multipart.encoder import MultipartEncoder
from ConfigMESH import Config

class MercadoLibreAPI:
    def __init__(self, client_id, client_secret, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.access_token = None
        self.refresh_token = None
        self.expires_at = None
    
    
    def authenticate(self, code=None):
        if self.load_tokens():
            print("Token cargado desde el archivo.")
        elif code:
            url = "https://api.mercadolibre.com/oauth/token"
            data = {
                "grant_type": "authorization_code",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
                "redirect_uri": self.redirect_uri,
            }
            response = requests.post(url, data=data)
            if response.status_code == 200:
                token_info = response.json()
                self.access_token = token_info["access_token"]
                self.refresh_token = token_info["refresh_token"]
                self.expires_at = time.time() + token_info["expires_in"]
            else:
                raise Exception(f"Autenticación fallida: {response.text}")
            self.save_tokens()
        else:
            raise Exception("No tokens found and no authorization code provided")
    
    
    def refresh_access_token(self):
        if time.time() >= self.expires_at - 1800:  #! Recargar el token 30 minutos antes de que expire
            print("Refrescando token...")
            url = "https://api.mercadolibre.com/oauth/token"
            data = {
                "grant_type": "refresh_token",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": self.refresh_token
            }
            response = requests.post(url, data=data)
            if response.status_code == 200:
                token_info = response.json()
                self.access_token = token_info["access_token"]
                self.refresh_token = token_info["refresh_token"]
                self.expires_at = time.time() + token_info["expires_in"]
                print("Token refrescado.\n")
                self.save_tokens()
            else:
                raise Exception("Token refresh failed")
    
    
    def save_tokens(self):
        token_data = {
            "access_token": self.access_token,
            "refresh_token": self.refresh_token,
            "expires_at": self.expires_at
        }
        with open("ml_tokens.json", "w") as f:
            json.dump(token_data, f)
    
    
    def load_tokens(self):
        if os.path.exists("ml_tokens.json"):
            with open("ml_tokens.json", "r") as f:
                token_data = json.load(f)
            self.access_token = token_data["access_token"]
            self.refresh_token = token_data["refresh_token"]
            self.expires_at = token_data["expires_at"]
            return True
        return False
    
    
    def __str__(self) -> str:
        return  f"client_id: {self.client_id}\n" + \
                f"client_secret: {self.client_secret}\n" + \
                f"redirect_uri: {self.redirect_uri}\n" + \
                f"access_token: {self.access_token}\n" + \
                f"refresh_token: {self.refresh_token}\n" + \
                f"expires_at: {datetime.datetime.fromtimestamp(self.expires_at).strftime('%Y-%m-%d %H:%M:%S')}\n"
    
    
    def get(self, endpoint):
        self.refresh_access_token()
        url = f"https://api.mercadolibre.com{endpoint}"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(url, headers=headers)
        return response.json()
    
    
    def post(self, endpoint, data, is_json=True):
        self.refresh_access_token()
        url = f"https://api.mercadolibre.com{endpoint}"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        if is_json:
            headers["Content-Type"] = "application/json"
            response = requests.post(url, headers=headers, data=json.dumps(data))
        else:
            response = requests.post(url, headers=headers, data=data)
        
        # if response.status_code != 200:
        #     raise Exception(f"Error en la solicitud POST: {response.text}")
        
        return response.json()
    
    
    def publish_clothing_item(self):
        picture_paths = ["/home/guarnold/Repositorios_GitHub/Inventario-Sole/Backend/uploads/00001/resized_Pic_20240204_130256_4096x2160.png"]
        picture_ids = [self.upload_image(path) for path in picture_paths]
        
        item_data = {
            "title": "Remera de algodón para mujer",
            "category_id": "MLA109042",
            "price": 150000,
            "currency_id": "ARS",
            "available_quantity": 10,
            "buying_mode": "buy_it_now",
            "condition": "new",
            "channels": ["mshops"],
            "status": "paused",
            "listing_type_id": "gold_special",
            "description": {"plain_text": "Remera de algodón suave y cómoda para uso diario."},
            "pictures": [{"id": pic_id} for pic_id in picture_ids],
            "attributes": [
                {"id": "BRAND", "value_name": "Genérica"},
                {"id": "MODEL", "value_name": "Básico"},
                {"id": "GENDER", "value_name": "Mujer"},
                {"id": "GARMENT_TYPE", "value_name": "Remera"},
                {"id": "COLOR", "value_name": "Blanco"},
                {"id": "SIZE", "value_name": 38},
                {"id": "SLEEVE_TYPE", "value_name": "Sin manga"},
                {"id": "AGE_GROUP", "value_name": "Adultos"},  # Ajusta este valor según la respuesta de la API
                {"id": "SIZE_GRID_ID", "value_name": "Remeras"},  # Ajusta este valor según la respuesta de la API
            ]
        }
        
        
        
        return self.post("/items", item_data)


    def upload_image(self, image_path):
        #! URL para subir imágenes
        upload_url = "https://api.mercadolibre.com/pictures/items/upload"
        
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        
        #! Abrir y preparar el archivo
        with open(image_path, 'rb') as image_file:
            files = {
                'file': (os.path.basename(image_path), image_file, 'image/jpeg')
            }
            
            response = requests.post(upload_url, headers=headers, files=files)
        
        if response.status_code not in [200, 201]:
            print(f"Código de estado: {response.status_code}")
            print(f"Respuesta completa: {response.text}")
            raise Exception(f"Error al cargar la imagen: {response.text}")
        
        return response.json()["id"]


if __name__ == "__main__":
    conf = Config()
    
    #! Uso de la clase
    client_id = conf.MESH_CLIENT_ID
    client_secret = conf.MESH_CLIENT_SECRET
    redirect_uri = conf.MESH_REDIRECT_URI
    
    ml_api = MercadoLibreAPI(client_id, client_secret, redirect_uri)
    
    #! Autenticar (necesitas obtener el código de autorización primero)
    auth_code = conf.MESH_AUTH_CODE
    ml_api.authenticate(auth_code)
    ml_api.refresh_access_token()
    
    print(ml_api)
    
    #* --------------------------------- Mi detalle
    # print("RESULTADO:", json.dumps(ml_api.get("/users/me"), indent=2))
    
    #* --------------------------------- Ver mis productos
    # print(ml_api.get("/users/me/items/search?status=active"))
    
    #* --------------------------------- Publicar
    # print(json.dumps(ml_api.publish_clothing_item(), indent=2))
    
    #* --------------------------------- Categorías
    # print(json.dumps(ml_api.get("/sites/MLA/categories"), indent=2))  #! Ropa y Accesorios: MLA1430
    
    #* --------------------------------- Sub-Categorías
    # print(json.dumps(ml_api.get("/categories/MLA1430"), indent=2))   #! Remeras, Musculosas y Chombas: MLA109042
    
    #* ---------------------------------  SIZE_GRID_ID.
    # r = ml_api.get(f"/categories/MLA109042/attributes")
    # print(json.dumps(r, indent=2))