import os, platform

if platform.system() == 'Windows':
    print("Iniciando en Windows")
    os.system('boot.bat')

else:
    print("Iniciando en Linux")
    os.system('sh boot.sh')