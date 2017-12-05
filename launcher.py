try:
    import discord
    from discord.ext.commands import Bot
except ImportError:
        print("Discord.py is not installed!")
try:
    import logging
except ImportError:
        print("Logging is not installed")
try:
    import config
except ImportError:
        print("A file is out of place: config.py was not found!")
import os
import signal
import sys
import platform
import time

IS_WINDOWS = os.name == "nt"
IS_MAC = sys.platform == "darwin"
INTERACTIVE_MODE = not len(sys.argv) > 1  # CLI flags = non-interactive

def clear_screen():
    if IS_WINDOWS:
        os.system("cls")
    else:
        os.system("clear")

logging.basicConfig(level=logging.INFO) # Configurates the logger
logger = logging.getLogger('discord')
description = '''Python'''
bot = Bot(command_prefix=config.PREFIX) # Sets the client and sets the prefix
@bot.command(pass_context=True)
async def game(ctx, game=None):
    """Set TerraBite's Game"""
    server = ctx.message.server
    author = ctx.message.author
    current_status = server.me.status if server is not None else None
    game = game.strip()
    await bot.change_presence(game=discord.Game(name=game),
status=current_status)
    await bot.say("Done! :smile:")
    await bot.whisper("Game was set to **{}**".format(game))
    print("Game was set to '({})' by ({})".format(game, author))
@bot.command(pass_context=True)
async def ping(ctx):
    """Pong."""
    em = discord.Embed(color=0x0BFCF2)
    t1 = time.perf_counter()
    await bot.send_typing(ctx.message.channel)
    t2 = time.perf_counter()
    em.add_field(name='Ping :ping_pong: ', value=(str(round((t2-t1)*1000)) + "ms"))

def windows_startup():
    print("Operating System is " + platform.system())
    print("Starting Bot For Windows System")
    print("Starting Bot")
    os.system("pm2 start index.js")
    signal.signal(signal.SIGINT, sig_handler)
    os.system("pm2 logs index")
    bot.run(config.TOKEN)

def linux_startup():
    print("Operating System is " + platform.system())
    print("Starting Bot")
    os.system("pm2 start index.js")
    signal.signal(signal.SIGINT, sig_handler)
    os.system("pm2 logs index")
    bot.run(config.TOKEN)
    
def mac_startup():
    print("Operating System is " + platform.system())
    print("Starting Bot")
    os.system("pm2 start index.js")
    signal.signal(signal.SIGINT, sig_handler)
    os.system("pm2 logs index")
    bot.run(config.TOKEN)

if len(sys.argv) > 1:
    if sys.argv[1] == "install":
        print("Installing Dependencies")
        os.system("npm install")
        print("Installing PM2")
        os.system("npm install -g pm2")
        bot.run(config.TOKEN)
clear_screen()
print("""                                                                                          
    __    ____  ___    ____  _____   ________             
   / /   / __ \/   |  / __ \/  _/ | / / ____/             
  / /   / / / / /| | / / / // //  |/ / / __               
 / /___/ /_/ / ___ |/ /_/ // // /|  / /_/ /  _    _    _  
/_____/\____/_/  |_/_____/___/_/ |_/\____/  (_)  (_)  (_) 
                                                                                                                                                                                                                                                                                                                              
""")
time.sleep(5)
clear_screen()

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
elif platform.system() == "macosx":
          mac_startup()
          
else:
          print("Unknown Operating System. Please use either Linux, Mac or Windows")

print("The Bot is Running. Press CTRL+C to Exit")
