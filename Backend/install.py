import os, platform

if platform.system() == 'Windows':
    print("Instalando en Windows")
    os.system('install.bat')

else:
    print("Instalando en Linux")
    os.system('sh install.sh')