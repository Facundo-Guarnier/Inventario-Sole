:: Crear entorno virtual
python -m venv Inventario-env 
call Inventario-env\Scripts\activate

:: Actualizar pip e instalar dependencias
python -m pip install --upgrade pip
pip install -r requirements.txt