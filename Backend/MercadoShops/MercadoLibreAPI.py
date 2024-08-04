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
        if self.__load_tokens():
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
                print("+++++++++++++++++++++++++")
                print(response.json())
                print("+++++++++++++++++++++++++")
                raise Exception(f"Autenticación fallida: {response.text}")
            self.__save_tokens()
        else:
            raise Exception("No tokens found and no authorization code provided")
    
    
    def __refresh_access_token(self):
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
            print(response.json())
            if response.status_code == 200:
                token_info = response.json()
                self.access_token = token_info["access_token"]
                self.refresh_token = token_info["refresh_token"]
                self.expires_at = time.time() + token_info["expires_in"]
                print("Token refrescado.\n")
                self.__save_tokens()
            else:
                raise Exception("Token refresh failed")
    
    
    def __save_tokens(self):
        token_data = {
            "access_token": self.access_token,
            "refresh_token": self.refresh_token,
            "expires_at": self.expires_at
        }
        with open("ml_tokens.json", "w") as f:
            json.dump(token_data, f)
    
    
    def __load_tokens(self):
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
        self.__refresh_access_token()
        url = f"https://api.mercadolibre.com{endpoint}"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(url, headers=headers)
        return response.json()
    
    
    def post(self, endpoint, data, is_json=True):
        self.__refresh_access_token()
        url = f"https://api.mercadolibre.com{endpoint}"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        if is_json:
            headers["Content-Type"] = "application/json"
            response = requests.post(url, headers=headers, data=json.dumps(data))
        else:
            response = requests.post(url, headers=headers, data=data)
        
        return response.json()
    
    
    def publicar_producto(self):
        picture_paths = ["/home/guarnold/Repositorios_GitHub/Inventario-Sole/Backend/uploads/00001/resized_1.png"]
        picture_ids = [self.upload_image(path) for path in picture_paths]
        
        item_data = {
            "title": "Remera de algodón para mujer - Item de test - No ofertar",
            # "category_id": "MLA109042",
            "category_id": "MLA417371",
            "price": 150000,
            "currency_id": "ARS",
            "available_quantity": 10,
            "buying_mode": "buy_it_now",
            "condition": "new",
            "listing_type_id": "gold_special",
            "sale_terms": [
                {"id": "WARRANTY_TYPE", "value_name": "Garantía del vendedor"},
                {"id": "WARRANTY_TIME", "value_name": "10 días"}
            ],
            "pictures": [{"id": pic_id} for pic_id in picture_ids],
            
            "channels": ["mshops"],
            "status": "paused",
            # "description": {"plain_text": "Remera de algodón suave y cómoda para uso diario."}, #! La descripcion se envía después
            
            "attributes": [
                #! Atributos obligatorios
                {"id": "BRAND", "value_name": "Genérica"},
                {"id": "MODEL", "value_name": "Básico"},
                {"id": "GENDER", "value_name": "Mujer"},
                {"id": "GARMENT_TYPE", "value_name": "Remera"},
                {"id": "COLOR", "value_name": "Blanco"},
                {"id": "SLEEVE_TYPE", "value_name": "Sin manga"},
                
                #! Atributos opcionales
                {"id": "SIZE", "value_name": 38},
                {"id": "AGE_GROUP", "value_name": "Adultos"},
                {"id": "SIZE_GRID_ID", "value_name": "Remeras"},
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
    
    # print(ml_api)
    
    #* --------------------------------- Mi detalle
    # print("\n\nMi detalle:\n", json.dumps(ml_api.get("/users/me"), indent=2))
    
    
    
    
    #* --------------------------------- Predecir categoria
    
    # #! Posibles categorías
    # domain_discovery_response:list = ml_api.get('/sites/MLA/domain_discovery/search?q=Remera Genérica mujer adulto')
    # # print(f"\n\nDomain:\n{json.dumps(domain_discovery_response, indent=2)}")    #! Ej: {"domain_id": "MLA-T_SHIRTS","domain_name": "Remeras","category_id": "MLA4979","category_name": "Remeras, Musculosas y Chombas","attributes": []}
    
    # #! Atributos obligatorios por categoría
    # # domain_discovery_response=[domain_discovery_response[0]]
    # for cat in domain_discovery_response:
    #     print(f'\n\n{cat["category_id"]}')
        
    #     atributos:list = ml_api.get(f"/categories/{cat['category_id']}/attributes")
        
    #     for att in atributos:
    #         if att["tags"].get("required", False):
    #             print(f' {att["name"]}: {att["id"]}')     #! MLA4979, MLA109042, MLA6551, MLA414238, MLA417869, MLA417371

    
    
    
    #* --------------------------------- Ver mis productos
    # print(ml_api.get("/users/me/items/search?status=active"))
    
    #* --------------------------------- Publicar
    # #! Crear publicación
    # re= ml_api.publicar_producto()
    # print(f"\nPublicación:\n{json.dumps(re, indent=2)}")
    
    # if re.get("error"):
    #     exit()
    # #! Agregar descripción (si o si se debe hacer después de crear la publicación)
    # re = ml_api.post(f"/items/{re['id']}/description", {"plain_text": "Remera de algodón suave y cómoda para uso diario."})
    
    
    
    #* --------------------------------- Categorías
    # print(json.dumps(ml_api.get("/sites/MLA/categories"), indent=2))  #! Ropa y Accesorios: MLA1430
    
    #* --------------------------------- Sub-Categorías
    # print(json.dumps(ml_api.get("/categories/MLA1430"), indent=2))   #! Remeras, Musculosas y Chombas: MLA109042
    
    #* ---------------------------------  SIZE_GRID_ID.
    # r = ml_api.get(f"/categories/MLA109042/attributes")
    # print(json.dumps(r, indent=2))
    
    
    domain_id = "MLA-T_SHIRTS"
    # #T* Buscar una Guía de Talles:
    # search_charts_payload = {
    #     "domain_id": "T_SHIRTS",
    #     "site_id": "MLA",
    #     "seller_id":  "327259941",
    #     "attributes": [
    #         {
    #             "id": "GENDER",
    #             "values": [
    #                 {
    #                     "name": "Mujer"
    #                 }
    #             ]
    #         },
    #         {
    #             "id": "BRAND",
    #             "values": [
    #                 {
    #                     "name": "generico"
    #                 }
    #             ]
    #         }
    #     ]
    # }
    # search_charts_response = ml_api.post("/catalog/charts/search", search_charts_payload)
    # print(f"\n\nSearch Chart:\n{json.dumps(search_charts_response, indent=2)}")
    
    #T* Crear una Nueva Guía de Talles:
    # #! Consultar la ficha técnica del dominio
    # technical_specs_response = ml_api.get(f"/domains/{domain_id}/technical_specs")
    # # print(f"\n\nTechnical Specs:\n{json.dumps(technical_specs_response, indent=2)}")
    
    # #! Consultar la ficha técnica de la guía de talles
    # required_attributes = []
    # for group in technical_specs_response["input"]["groups"]:
    #     for component in group["components"]:
    #         if "attributes" in component:
    #             for attribute in component["attributes"]:
    #                 if "grid_template_required" in attribute.get("tags", []):
    #                     required_attributes.append(attribute["id"])
    
    # grid_technical_specs_payload = {
    #     "attributes": [
    #         {"id": attribute_id, "value_name": "Mujer"}  # Asegúrate de proporcionar los valores apropiados para cada atributo requerido
    #         for attribute_id in required_attributes
    #     ]
    # }
    # grid_technical_specs_response = ml_api.post(f"/domains/{domain_id}/technical_specs?section=grids", grid_technical_specs_payload)
    # print(f"\n\nGrid Technical Specs:\n{json.dumps(grid_technical_specs_response, indent=2)}")
    
    # #! Construir la guía de talles
    # create_chart_payload = {
    #     "names": {"MLA": "Guía de Talles para Remeras de Mujer"},
    #     "domain_id": domain_id,
    #     "site_id": "MLA",
    #     "main_attribute": {  # Define el atributo principal para la guía de talles (ej: SIZE)
    #         "attributes": [
    #             {
    #                 "site_id": "MLA",
    #                 "id": "SIZE"  # O el ID del atributo que corresponda
    #             }
    #         ]
    #     },
    #     "attributes": [
    #         {
    #             "id": "GENDER",
    #             "values": [
    #                 {
    #                     "name": "Mujer"
    #                 }
    #             ]
    #         }
    #         # ... (otros atributos requeridos)
    #     ],
    #     "rows": [
    #         {
    #             "attributes": [
    #                 {"id": "SIZE", "values": [{"name": "S"}]},
    #                 # ... (otros atributos requeridos para las filas)
    #             ]
    #         },
    #         # ... (más filas con diferentes tallas)
    #     ]
    # }
    
    # create_chart_response = ml_api.post("/catalog/charts", create_chart_payload)
    # print(f"\n\nCreate Chart:\n{json.dumps(create_chart_response, indent=2)}")
    
    
    