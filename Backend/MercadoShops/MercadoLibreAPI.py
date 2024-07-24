import base64
import datetime, os, requests, time, json
from requests_toolbelt.multipart.encoder import MultipartEncoder
import mimetypes
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
        print("+++++++++++++++")
        if time.time() >= self.expires_at - 1800:  #! Recargar el token 30 minutos antes de que expire
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
    
    
    def publish_clothing_item(self, title, category_id, price, currency_id, available_quantity, 
                          condition, description, picture_paths, brand, color, size):
        # Primero, subimos las imágenes
        picture_ids = [self.upload_image(path) for path in picture_paths]
        
        item_data = {
            "title": title,
            "category_id": category_id,
            "price": price,
            "currency_id": currency_id,
            "available_quantity": available_quantity,
            "buying_mode": "buy_it_now",
            "condition": condition,
            
            "channels": ["mshops"],
            # "status": "inactive",
            "status": "paused",
            
            "listing_type_id": "gold_special",
            "description": {"plain_text": description},
            "pictures": [{"id": pic_id} for pic_id in picture_ids],
            "attributes": [
                {"id": "BRAND", "value_name": brand},
                {"id": "COLOR", "value_name": color},
                {"id": "SIZE", "value_name": size}
            ]
        }
        
        return self.post("/items", item_data)


    def upload_image(self, image_path):
        # URL para subir imágenes
        upload_url = "https://api.mercadolibre.com/pictures/items/upload"
        
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        
        # Abrir y preparar el archivo
        with open(image_path, 'rb') as image_file:
            files = {
                'file': (os.path.basename(image_path), image_file, 'image/jpeg')
            }
            
            response = requests.post(upload_url, headers=headers, files=files)
        
        if response.status_code not in [200, 201]:
            print(f"Código de estado: {response.status_code}")
            print(f"Respuesta completa: {response.text}")
            raise Exception(f"Error al cargar la imagen: {response.text}")
        
        upload_info = response.json()
        
        # Devolvemos el ID de la imagen
        return upload_info["id"]


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
    
    #* ---------------------------------
    # print("RESULTADO:", json.dumps(ml_api.get("/users/me"), indent=2))
    
    #* ---------------------------------
    # print(ml_api.get("/users/me/items/search?status=active"))
    
    #* ---------------------------------
    # result = ml_api.publish_clothing_item(
    #     title="Item de test2 - No Ofertar",
    #     category_id="MLA3530",  # Categoría para Ropa y Accesorios > Camisetas
    #     price=1500000,
    #     currency_id="ARS",
    #     available_quantity=0,
    #     condition="new",
    #     description="Camiseta de algodón 100%, muy cómoda y duradera.",
    #     picture_paths=["/home/guarnold/Repositorios_GitHub/Inventario-Sole/Backend/uploads/00001/resized_Pic_20240204_130256_4096x2160.png"],
    #     brand="MiMarca",
    #     color="Negro",
    #     size="M"
    # )
    
    # print(json.dumps(result, indent=2))
    
    #* ---------------------------------