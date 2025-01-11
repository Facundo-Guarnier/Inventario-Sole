## Para hacer deploy

1. Crear las imágenes de docker actualizadas:
```bash
cd backend
docker build -t facundoguarnier/inventario-sole-backend:<version> .
cd frontend
docker build -t facundoguarnier/inventario-sole-frontend:<version> .
```

2. Actualizar los archivos `backend.yaml` y `frontend.yaml` con la version correcta de la imagen de docker

3. Hacer un pull en el server para traer los nuevos `.yaml`.

4. Hacer `k apply -f .` en la carpeta de kubernetes del proyecto.