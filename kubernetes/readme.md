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

## Para borrar los datos 
Los datos no se borran al eliminar el PVs. 
Para eliminarlos de forma permanente se debe hacer:

```bash
# Revisar el contendio si es el correcto
rm -rf /mnt/data/*
rm -rf /path/to/uploads/*
```