import datetime
import json
import os
import time

import requests
from flask import current_app


class MeliService:
    def __init__(self) -> None:
        self.meli_api = MercadoLibreAPI(
            client_id=current_app.config["MESH_CLIENT_ID"],
            client_secret=current_app.config["MESH_CLIENT_SECRET"],
            redirect_uri=current_app.config["MESH_REDIRECT_URI"],
        )
        self.meli_api.authenticate(code=current_app.config["MESH_AUTH_CODE"])

    def get(self, url: str) -> tuple:
        return self.meli_api.get(url), 200

    # @jwt_required()
    # @admin_required
    def post(self, url: str, datos: dict) -> tuple:
        return self.meli_api.post(url, datos), 200


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
            print("Generando nuevo token...")
            url = "https://api.mercadolibre.com/oauth/token"
            data = {
                "grant_type": "authorization_code",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
                "redirect_uri": self.redirect_uri,
            }
            print(data)
            response = requests.post(url, data=data)
            try:
                token_info = response.json()
                self.access_token = token_info["access_token"]
                self.refresh_token = token_info["refresh_token"]
                self.expires_at = time.time() + token_info["expires_in"]
            except Exception as e:
                # TODO generar log de error
                raise Exception(f"Autenticación fallida: {response.text}") from e
            self.__save_tokens()
        else:
            raise Exception("No tokens found and no authorization code provided")

    def __refresh_access_token(self):
        if (
            time.time() >= self.expires_at - 1800
        ):  #! Recargar el token 30 minutos antes de que expire
            print("Refrescando token...")
            url = "https://api.mercadolibre.com/oauth/token"
            data = {
                "grant_type": "refresh_token",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": self.refresh_token,
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
        print("Guardando token en el archivo...")
        token_data = {
            "access_token": self.access_token,
            "refresh_token": self.refresh_token,
            "expires_at": self.expires_at,
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
        return (
            f"client_id: {self.client_id}\n"
            + f"client_secret: {self.client_secret}\n"
            + f"redirect_uri: {self.redirect_uri}\n"
            + f"access_token: {self.access_token}\n"
            + f"refresh_token: {self.refresh_token}\n"
            + f"expires_at: {datetime.datetime.fromtimestamp(self.expires_at).strftime('%Y-%m-%d %H:%M:%S')}\n"
        )

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
