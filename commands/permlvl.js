exports.run = async function (client, message) {
let perms = client.elevation(message)
message.reply("Your permission level is: " + perms)
};

exports.settings = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permlevel: 0
};

exports.about = {
  name: 'permlvl',
  description: 'Shows your permission level',
  usage: 'permlvl'
};
