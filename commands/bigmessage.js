exports.run = async function (client, message, args) {

const eksdee = message.content.split(" ").slice(1);
  client.guilds.forEach(guild => {guild.defaultChannel.send({embed: {     
      color: 65280,
      title: 'TerraBite',
      description: eksdee.join(' ') + '\n\nRegards ' + message.author + '.'
}})})
};


exports.settings = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permlevel: 20
};

exports.about = {
  name: 'bigmessage',
  description: 'A bigmessage over the entire servers. Like a update message.',
  usage: 'bigmessage'
};
