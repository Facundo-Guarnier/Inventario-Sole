import datetime, os, requests, time, json

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
    
    
    def make_api_request(self, endpoint):
        self.refresh_access_token()
        url = f"https://api.mercadolibre.com{endpoint}"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(url, headers=headers)
        return response.json()
    
    
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


if __name__ == "__main__":
    conf = Config()
    
    # Uso de la clase
    client_id = conf.MESH_CLIENT_ID
    client_secret = conf.MESH_CLIENT_SECRET
    redirect_uri = conf.MESH_REDIRECT_URI
    
    ml_api = MercadoLibreAPI(client_id, client_secret, redirect_uri)
    
    #! Autenticar (necesitas obtener el código de autorización primero)
    auth_code = conf.MESH_AUTH_CODE
    ml_api.authenticate(auth_code)
    
    print(ml_api)
    
    #! Hacer una solicitud a la API
    result = ml_api.make_api_request("/users/me")
    print("RESULTADO:", json.dumps(result, indent=2))
