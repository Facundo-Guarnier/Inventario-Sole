from app.services.validar_stock import RondaValidacionStockService, ValidarStockService
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

ronda_validacion = Blueprint(
    "/api/ronda-validacion", __name__, url_prefix="/api/ronda-validacion"
)
ronda_validacion_service = RondaValidacionStockService()


# @jwt_required()
@ronda_validacion.route("", methods=["GET"])
def productos_a_validar():

    try:
        data = request.args.to_dict()
        tienda = data.get("tienda")
        pagina = int(request.args.get("pagina", 1))
        por_pagina = int(request.args.get("por_pagina", 10))

    except Exception:
        return ({"error": "Datos inválidos"}), 400

    if not tienda or not pagina or not por_pagina:
        return ({"error": "Datos incompletos"}), 400

    return ronda_validacion_service.productos_a_validar(tienda, pagina, por_pagina)


@jwt_required()
@ronda_validacion.route("", methods=["POST"])
def iniciar_ronda():
    data = request.json
    tienda = data.get("tienda")

    if not tienda:
        return ({"error": "Datos incompletos"}), 400

    return ronda_validacion_service.iniciar_ronda(tienda)


validacion_stock = Blueprint(
    "/api/validacion-stock", __name__, url_prefix="/api/validacion-stock"
)
validacion_stock_service = ValidarStockService()


@jwt_required()
@validacion_stock.route("", methods=["POST"])
def validar_unidad():
    data = request.json
    id_producto = data.get("id")
    deshacer = data.get("deshacer", False)
    tienda = data.get("tienda")

    if not id_producto or not tienda:
        return ({"error": "Datos incompletos"}), 400

    return validacion_stock_service.validar_unidad(id_producto, tienda, deshacer)
