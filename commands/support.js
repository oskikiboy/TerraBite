const Discord = require("discord.js");
exports.run = async function (client, message, args) {
  let support_reason = args.slice(1).join(" ")
  if(support_reason.length < 1) return message.reply("Please provide a question for the developers.")
  message.guild.defaultChannel.createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(invite => {
          const embed = new Discord.RichEmbed()
          .setTitle("Support requested")
          .setDescription("There is support requested by " + message.author)
          .addField("User:", message.author.tag + ` (${message.author.id})`)
          .addField("Guild:", message.guild.name + ` (${message.guild.id})`)
          .addField("Support reason:", support_reason)
          .addField("Invite code:", invite.code)
          bot.channels.get("325998799128494080").send({embed: embed})
          })
};

exports.settings = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permlevel: 4
};

exports.about = {
  name: 'support',
  description: 'Ask the developers for support.',
  usage: 'support [question]'
};
