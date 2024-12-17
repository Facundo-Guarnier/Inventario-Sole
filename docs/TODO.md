# TO DO list

Eliminar lo relacionado a mercado libre:

- Crear producto, Dejar campos como:
  - color
  - talle
  - marca
  - titulo
  - genero
- Crear producto, En el front, agregar un switch para activar o no los campos de meli (por ahora siempre desactivado), de esta forma nos ahorramos todo lo relacionado a meli.

Implementar mercado libre:

- Que los productos tenga un campo datos_meli de tipo json, donde se guardan los otros valores sin validar.
- No debería afectar a los productos actuales.

Despues del primer entregable:

- IMPLEMENTAR DTOs para todas las validaciones de los endpoints
- Incluir o arreglar restauracion DB con imágenes
- Los services no deberían devolver una tupla con el dato y código de de respuesta de HTTP
- Hacer algún test como en Kamina del backend

## Mercado Shop

- [ ] Fotos para MS
- [ ] Hacer que el tonken no se venza cada 6 horas
- [ ] Ver la ubicación de los impuestos
- [ ] Ver el envío

# Extra

node: v22.3.0
npm: 10.8.1
ng new Inventario-Sole --version=14.2.4
npm install bootstrap@5.2.2
npm install bootstrap-icons
