//TerraBite Discord Bot by the TerraBite Dev Group
const opus = require('node-opus');
const yt = require('ytdl-core');
const sql = require('sqlite');
const Discord = require('discord.js');
const unirest = require('unirest');
const os = require('os');
const client = new Discord.Client({
  autoreconnect: true
});
const config = require('./config.json');
const fs = require('fs');
const moment = require('moment');
const express = require('express');
const app = exports.app = express();
const passport = require('passport');
const session = require('express-session');
const DiscordS = require('passport-discord').Strategy;
var sio = require('socket.io');
var shards = new Discord.ShardClientUtil(client);
var path = require('path');
var asciiart = `
╭━━━━╮╱╱╱╱╱╱╱╱╭━━╮╱╭╮
┃╭╮╭╮┃╱╱╱╱╱╱╱╱┃╭╮┃╭╯╰╮
╰╯┃┃┣┻━┳━┳━┳━━┫╰╯╰╋╮╭╋━━╮
╱╱┃┃┃┃━┫╭┫╭┫╭╮┃╭━╮┣┫┃┃┃━┫
╱╱┃┃┃┃━┫┃┃┃┃╭╮┃╰━╯┃┃╰┫┃━┫
╱╱╰╯╰━━┻╯╰╯╰╯╰┻━━━┻┻━┻━━╯

`

try {

if (config.maintenance) {
    console.log(`Starting in maintenance mode \n` + asciiart);
} else {
    console.log(`Starting \n` + asciiart);
}
} catch (err) {
  console.error(`Failed to display startup message ${err.stack}`)
}





    const web = exports.web = require('./web/web');
    const auth = exports.auth = require('./web/auth');


    require('./utils/eventLoader.js')(client);
    require('./web/web.js');
    require('./web/auth.js');

    client.login(config.token);

    function updateStats() {
        unirest.post(`https://discordbots.org/api/bots/${config.clientID}/stats`)
            .headers({
                'Authorization': `${config.discordbotstoken}`
            })
            .send({
                "server_count": client.guilds.size
            }).end(function(res) {
            console.log(res.body);
        });
    }



    client.on('guildDelete', guild => {
        const row = sql.get(`SELECT * FROM prefixes WHERE guildId ='${guild.id}'`);
    if (!row) {
        updateStats();

        return;
    } else {
        sql.run('DELETE FROM prefixes WHERE guildId =?', guild.id);
        console.log('Guild Removed and Prefix Cleared :(');
        updateStats();
    }
});

    client.on('guildCreate', guild => {
        updateStats();
        const hexcols = [0xFFB6C1, 0x4C84C0, 0xAD1A2C, 0x20b046, 0xf2e807, 0xf207d1, 0xee8419];
        const embed = new Discord.RichEmbed()
            .setAuthor('Hello there!')
            .setDescription('Thank you for inviting TerraBite to enhance your Discord experience! Before you begin there are some things you need to know and some roles you need to add.')
        embed.addField("Moderator Role:", `Moderator`, true)
        embed.addField("Administrator Role:", `Administrator`, true)
        embed.addField("Web Interface:", `[Link](https://terrabite.cf)`, true)
        embed.addField("Support Server", `[Link](https://discord.gg/JJAy6qw)`, true)
        embed.addField("Bot invite link", `[Link](https://discordapp.com/oauth2/authorize?client_id=295942672890331147&scope=bot&permissions=-1)`, true)
            .setColor(hexcols[~~(Math.random() * hexcols.length)]);
            return guild.owner.sendMessage({embed: embed});
});

    const log = message => {
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
    };

    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    fs.readdir('./commands/', (err, files) => {
        if (err) console.error(err);
    log(`Loading ${files.length} commands`);
    files.forEach(fname => {
        let props = require(`./commands/${fname}`);
    client.commands.set(props.about.name, props);
    props.settings.aliases.forEach(alias => {
        client.aliases.set(alias, props.about.name);
});
});
    exports.cmdcount = files.length;
});

    client.reload = command => {
        //This reloads the given command by clearing it from cache
        return new Promise((resolve, reject) => {
                try {
                    delete require.cache[require.resolve(`./commands/${command}`)];
        let cmd = require(`./commands/${command}`);
        client.commands.delete(command);
        client.aliases.forEach((cmd, alias) => {
            if (cmd === command) client.aliases.delete(alias);
    });
        client.commands.set(command, cmd);
        cmd.settings.aliases.forEach(alias => {
            client.aliases.set(alias, cmd.about.name);
    });
        resolve();
    } catch (e) {
            reject(e);
        }
    });
    };

    try {
    }catch (err) {
        console.error(`An error occurred during the web interface module initialisation, Error: ${err.stack}`);
    }

    client.elevation = message => {
        var permlvl = 0;
        if(!message.guild) return;
        let modrole = message.guild.roles.find("name", config.controller_role_name)
        if(modrole && message.member.roles.has(modrole.id)) permlvl = 2; // If the member has the mod role, will his/her permlvl be 2
        let adminrole = message.guild.roles.find("name", config.administrator_role_name)
        if(adminrole && message.member.roles.has(adminrole.id)) permlvl = 4; // If the member has the admin role, will his/her permlvl be 4
        if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 6; // Everyone with the Admin perm will have perm lvl 6
        if(message.author.id === message.guild.owner.id) permlvl = 8; // The owner of the server will have perm lvl 8
        if(config.developers.includes(message.author.id)) permlvl = 10; // The developers will have perm lvl 10
        if(config.owners.includes(message.author.id)) permlvl = 20; // The owners will have perm lvl 20
        return permlvl; // Returning the system.

    };

    if (shards.id < 1) {
        try {
            /*const httpServer = http.createServer(app);
             httpServer.listen(config.server_port, (err) => {
             if (err) {
             console.error(`FAILED TO OPEN WEB SERVER, ERROR: ${err.stack}`);
             return;
             }
             console.info(`Successfully started server..listening on port ${config.server_port}`);
             })*/
            auth(config, app, passport, DiscordS, client);
            web(app, config, client, express);
        } catch (err) {
            console.error(`An error occurred during the web interface module initialisation, Error: ${err.stack}`)
        }
    }
    else {

    }

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception' + err.stack);
});