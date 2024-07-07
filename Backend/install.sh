#!/bin/bash

# Verificar si python3 está instalado y su versión
if ! command -v python3 >/dev/null 2>&1; then
    echo "[ERROR] python3 no está instalado. Finalizando..."
    exit 1
else
    python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    echo "[OK] python3 versión $python_version está instalado."
    if [[ "$python_version" < "3.6" ]]; then
        echo "[WARNING] Se recomienda Python 3.6 o superior."
    fi
fi

# Verificar si python3-venv está instalado
if ! dpkg -l | grep -q python3-venv; then
    echo "[WARNING] python3-venv no está instalado. Instalando python3-venv..."
    sudo apt-get install python3-venv -y
    if [[ $? -ne 0 ]]; then
        echo "[ERROR] Fallo al instalar python3-venv. Finalizando..."
        exit 1
    fi
else
    echo "[OK] python3-venv ya está instalado."
fi

# Crear y activar el entorno virtual
if [ ! -d "Inventario-env" ]; then
    python3 -m venv Inventario-env
    echo "[OK] Entorno virtual Inventario-env creado."
else
    echo "[OK] El entorno virtual Inventario-env ya existe."
fi

# Activar el entorno virtual
. Inventario-env/bin/activate || {
    echo "[ERROR] No se pudo activar el entorno virtual."
    exit 1
}
echo "[OK] Entorno virtual activado: $VIRTUAL_ENV"

# Verificar si pip está instalado
if ! command -v pip >/dev/null 2>&1; then
    echo "[WARNING] pip no está instalado. Instalando pip..."
    sudo apt-get install python3-pip -y
    if [[ $? -ne 0 ]]; then
        echo "[ERROR] Fallo al instalar python3-pip. Finalizando..."
        exit 1
    fi
else
    echo "[OK] pip ya está instalado."
fi

# Actualizar pip
python3 -m pip install --upgrade pip

# Instalar las dependencias desde requirements.txt
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "[ERROR] El archivo requirements.txt no se encontró."
    exit 1
fi

# # Verificar si MongoDB está instalado
# if ! command -v mongod >/dev/null 2>&1; then
#     echo "[WARNING] MongoDB no está instalado. Por favor, instálalo manualmente."
# else
#     echo "[OK] MongoDB está instalado."
# fi

# # Crear archivo .env si no existe
# if [ ! -f ".env" ]; then
#     echo "SECRET_KEY=your-secret-key" > .env
#     echo "MONGO_URI=mongodb://localhost:27017/yourdatabase" >> .env
#     echo "MONGO_DBNAME=yourdatabase" >> .env
#     echo "JWT_SECRET_KEY=your-jwt-secret-key" >> .env
#     echo "[OK] Archivo .env creado con valores predeterminados."
# else
#     echo "[OK] El archivo .env ya existe."
# fi

echo "[OK] Entorno virtual configurado correctamente."
echo "[OK] Para activarlo manualmente, ejecuta: . Inventario-env/bin/activate"
echo "[OK] Para desactivarlo, ejecuta: deactivate"