import os

from app.main import create_app


def esta_en_entorno_virtual():
    """
    Comprueba si el script se está ejecutando dentro de un entorno virtual.

    Returns:
        bool: True si está en un entorno virtual, False en caso contrario.
    """
    print("VIRTUAL_ENV:", os.getenv("VIRTUAL_ENV"))
    return os.getenv("VIRTUAL_ENV") is not None


if __name__ == "__main__":
    if esta_en_entorno_virtual():
        print("[OK] El script se está ejecutando dentro de un entorno virtual.")
    else:
        print("El script NO se está ejecutando dentro de un entorno virtual.")
        exit(1)

    app = create_app()
    app.run(debug=True)
