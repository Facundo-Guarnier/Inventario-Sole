#!/bin/bash

# Verificar si estamos en un repositorio git
if [ ! -d ".git" ]; then
    echo "🚀🚀 🚀🚀 Este directorio no es un repositorio Git."
    exit 1
fi

# Configurar Git para usar los hooks de la carpeta .githooks
echo "🚀🚀 Configurando Git para usar los hooks desde .githooks/..."

git config core.hooksPath .githooks

echo "🚀🚀 Configuración de hooks completada."

# Instalar dependencias de python usando el script de instalación
echo "🚀🚀 Instalando dependencias de Python..."
cd backend
./install.sh
echo "🚀🚀 Instalación de dependencias de Python completada."

cd ..

# Instalar dependencias de frontend
echo "🚀🚀 Instalando dependencias de Node.js..."
cd frontend
npm install
echo "🚀🚀 Instalación de dependencias de Node.js completada."

cd ..

echo "🚀🚀 Configuración completada."