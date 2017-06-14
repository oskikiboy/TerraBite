const config = require('../config.json');
    exports.run = async function (client, message, args) {

        const hexcols = [0xFFB6C1, 0x4C84C0, 0xAD1A2C, 0x20b046, 0xf2e807, 0xf207d1, 0xee8419];

        if (args.length < 1) {
            message.channel.send('', {
                embed: {
                    color: hexcols[~~(Math.random() * hexcols.length)],
                    title: "Error",
                    description: "You did not define what to ask!",
                    footer: {
                        text: `${message.author.username} needs to learn how to use my commands!`
                    }
                }
            }).catch(console.error);
        } else {
            var Say = args.slice(1).join(" ");
            var ch = "324240128350486529";
            if(ch) {
                if(!ch.permissionsFor(client.user).has(0x00000800)) {
                    return message.channel.send('I do not have the permission `SEND_MESSAGES` in the specified channel');
                }
            }
            if (!ch) {
                Say = args.slice(0).join(" ");
            }
            ch.send(Say);
            const embed = new Discord.RichEmbed()
                .setTitle('Question')
                .setColor('#ffe100')
                .addField('User:', `${message.author.username}#${message.author.discriminator}`)
                .addField('User ID:', `${message.author.id}`)
                .addField('From the server:', `${message.guild.name} (ID: ${message.guild.id})`)
                .addField('Question:', Say;)
            message.send(embed)
        };
    };

    exports.settings = {
        enabled: true,
        guildOnly: false,
        aliases: [],
        permlevel: 0
    };

    exports.about = {
        name: 'askdevs',
        description: 'Ask a question to the bot developers',
        usage: 'askdevs  <question>'
    };