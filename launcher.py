import os
import signal
import sys
import platform

def windows_startup():
    print("Operating System is Windows")
    print("Starting Bot")
    os.system("pm2 start app.js --name=TerraBite")
    signal.signal(signal.SIGINT, sig_handler)
    os.system("pm2 logs TerraBite")

def linux_startup():
    print("Operating System is Linux")
    print("Starting Bot")
    os.system("pm2 start app.js --name=TerraBite")
    signal.signal(signal.SIGINT, sig_handler)
    os.system("pm2 logs index")
    
def mac_startup():
    print("Operating System is MacOS or Darwin")
    print("Starting Bot")
    os.system("pm2 start app.js --name=TerraBite")
    signal.signal(signal.SIGINT, sig_handler)
    os.system("pm2 logs TerraBite")

if len(sys.argv) > 1:
    if sys.argv[1] == "install":
        print("Installing Dependencies")
        os.system("npm install")
        print("Installing PM2")
        os.system("npm install -g pm2")

print("""                                                                                          
    __    ____  ___    ____  _____   ________             
   / /   / __ \/   |  / __ \/  _/ | / / ____/             
  / /   / / / / /| | / / / // //  |/ / / __               
 / /___/ /_/ / ___ |/ /_/ // // /|  / /_/ /  _    _    _  
/_____/\____/_/  |_/_____/___/_/ |_/\____/  (_)  (_)  (_) 
                                                                                                                                                                                                                                                                                                                              
""")

print("Terrabite Discord Bot by: Oskikiboy, Motasim, Cringy Adam, Haxmat, Blackberry Pi and Codefox")

def sig_handler(signal, frame):
    print("Shutting Down")
    os.system("pm2 kill")
    sys.exit(0)

print("Checking Operating System")

if platform.system() == "Windows":
          windows_startup()
elif platform.system() == "Linux":
          linux_startup()
elif platform.system() == "Darwin":
          mac_startup()
          
else:
    print("Operating System is " + platform.system())
    print("Starting Bot")
    os.system("pm2 start app.js --name=TerraBite")
    signal.signal(signal.SIGINT, sig_handler)
    os.system("pm2 logs TerraBite")
