const Discord = require('discord.js');
const config = require('../config.json');
exports.run = async function (client, message, args) {

  const hexcols = [0xFFB6C1, 0x4C84C0, 0xAD1A2C, 0x20b046, 0xf2e807, 0xf207d1, 0xee8419];

  const embed = new Discord.RichEmbed()
  .setTitle("TerraBite's Website")
  .setColor(hexcols[~~(Math.random() * hexcols.length)])
  .setDescription(`To view TerraBite's Website. Please visit the link below`)
  .addField(`View it here`, `[Website](https://terrabite.cf)`);

  message.channel.send({embed: embed});
};

exports.settings = {
  enabled: true,
  guildOnly: true,
  aliases: ['web'],
  permlevel: 0
};

exports.about = {
  name: 'website',
  description: 'Lets you view TerraBite\'s website',
  usage: 'website'
};
