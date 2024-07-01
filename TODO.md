# TO DO list
## General

* [ ] Botón para descargar la DB, para hacer una copia de seguridad.

## Mercado Shop

* [ ] Fotos para MS
* [ ] Hacer que el tonken no se venza cada 6 horas
* [ ] Ver la ubicación de los impuestos
* [ ] Ver el envío

# Preguntas sole

* [ ] Revisar campos
* [ ] Como hago para pasar de una tienda a la otra? Cada tienda tiene un ID producto propio? Combino los dos ID? Un producto físico tiene su propio ID y luego se comparte con las 2 tiendas?
  Cuando creo un producto, puedo hacer X unidades a la física y Y unidades a la online?
  Creo que lo mejor es que sea el mismo ID producto, y que tal vez tenga 2 campos para precio y 2 para cantidad (una para cada tienda)
* [ ] Cuando la cantidad es 0 en tienda online, debería desaparecer la publicación? Debería pausarse?
* [ ] Pagar una parte en efectivo y otra con tarjeta. O pagar con 2 tarjetas. etc
* [ ] Historial de entrada y salida de productos. Sea ventas, compras o movimientos entre las 2 tiendas?

# Tecnologías
## Backend:

* Lenguaje: Python
* Framework web: Flask
* ORM: SQLAlchemy
* Base de datos: PostgreSQL

## Frontend:

* Lenguaje de marcado: HTML
* Lenguaje de estilos: CSS
* Lenguaje de programación: JavaScript
* Framework CSS: Bootstrap
* Framework JavaScript: Angular

## Control de versiones:

* GitHub

# Pasos

## Diseño

* 01 HU ✅
* 02 Enmaquetado ✅
* 03 Diseño de la DB
* 04 Diseño de la API backend

## Implementación

* 05 Configurar un entorno de desarrollo aislado ✅
* 06 Implementar el backend
* 07 Implementar el frontend (ng generate component componentes/app-navbar)
* 08 Integrar backend y frontend

## ¿Pruebas?

* 09 Pruebas unitarias
* 10 Pruebas de integración
* 11 Test cases