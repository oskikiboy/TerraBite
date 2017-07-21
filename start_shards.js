/*const Discord = require('discord.js');
const config = require('./config.json');
const Manager = new Discord.ShardingManager('./app.js', {
  token: config.token
});
Manager.spawn();*/

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager(`${__dirname}/app.js`, { totalShards: 2 });

manager.spawn();
manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
