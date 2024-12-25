# TO DO list

1 Revisar endpoint con el front para saber si funcionan todos

2 Eliminar lo relacionado a mercado libre:

3 Crear producto, dejar campos:

- ID
- Titulo
- Color
- Talle
- Descripcion
- Marca
- Genero
- Liquidación

4 Crear producto, En el front, agregar un switch para activar o no los campos de meli (por ahora siempre desactivado), de esta forma nos ahorramos todo lo relacionado a meli.

5 Implementar mercado libre:

- Que los productos tenga un campo datos_meli de tipo json, donde se guardan los otros valores sin validar.
- No debería afectar a los productos actuales.

Despues del primer entregable:

- IMPLEMENTAR DTOs para todas las validaciones de los endpoints
- Incluir o arreglar restauracion DB con imágenes
- Los services no deberían devolver una tupla con el dato y código de de respuesta de HTTP
- Hacer algún test como en Kamina del backend

## Mercado Shop

- [ ] Fotos para MS
- [ ] Ver la ubicación de los impuestos
- [ ] Ver el envío

# Extra

node: v22.3.0
npm: 10.8.1
ng new Inventario-Sole --version=14.2.4
npm install bootstrap@5.2.2
npm install bootstrap-icons
