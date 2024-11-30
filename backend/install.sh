#!/bin/bash

# Verificar si python3 está instalado y su versión
if ! command -v python3 >/dev/null 2>&1; then
    echo "🚀🚀 python3 no está instalado. Finalizando..."
    exit 1
else
    python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    echo "🚀🚀 python3 versión $python_version está instalado."
    if [[ "$python_version" < "3.6" ]]; then
        echo "🚀🚀 Se recomienda Python 3.6 o superior."
    fi
fi

# Verificar si python3-venv está instalado
if ! dpkg -l | grep -q python3-venv; then
    echo "🚀🚀 python3-venv no está instalado. Instalando python3-venv..."
    sudo apt-get install python3-venv -y
    if [[ $? -ne 0 ]]; then
        echo "🚀🚀 Fallo al instalar python3-venv. Finalizando..."
        exit 1
    fi
else
    echo "🚀🚀 python3-venv ya está instalado."
fi

# Crear y activar el entorno virtual
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "🚀🚀 Entorno virtual venv creado."
else
    echo "🚀🚀 El entorno virtual venv ya existe."
fi

# Activar el entorno virtual
. venv/bin/activate || {
    echo "🚀🚀 No se pudo activar el entorno virtual."
    exit 1
}
echo "🚀🚀 Entorno virtual activado: $VIRTUAL_ENV"

# Verificar si pip está instalado
if ! command -v pip >/dev/null 2>&1; then
    echo "🚀🚀 pip no está instalado. Instalando pip..."
    sudo apt-get install python3-pip -y
    if [[ $? -ne 0 ]]; then
        echo "🚀🚀 Fallo al instalar python3-pip. Finalizando..."
        exit 1
    fi
else
    echo "🚀🚀 pip ya está instalado."
fi

# Actualizar pip
python3 -m pip install --upgrade pip

# Instalar las dependencias desde requirements.txt
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "🚀🚀 El archivo requirements.txt no se encontró."
    exit 1
fi

# # Verificar si MongoDB está instalado
# if ! command -v mongod >/dev/null 2>&1; then
#     echo "🚀🚀 MongoDB no está instalado. Por favor, instálalo manualmente."
# else
#     echo "🚀🚀 MongoDB está instalado."
# fi

# # Crear archivo .env si no existe
# if [ ! -f ".env" ]; then
#     echo "SECRET_KEY=your-secret-key" > .env
#     echo "MONGO_URI=mongodb://localhost:27017/yourdatabase" >> .env
#     echo "MONGO_DBNAME=yourdatabase" >> .env
#     echo "JWT_SECRET_KEY=your-jwt-secret-key" >> .env
#     echo "🚀🚀 Archivo .env creado con valores predeterminados."
# else
#     echo "🚀🚀 El archivo .env ya existe."
# fi
echo . venv/bin/activate

echo "🚀🚀 Entorno virtual configurado correctamente."
echo "🚀🚀 Para activarlo manualmente, ejecuta: . venv/bin/activate"
echo "🚀🚀 Para desactivarlo, ejecuta: deactivate"