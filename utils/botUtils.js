const utils = require('./utils');
const fs = require('fs');
const requestify = require('requestify');
const got = require('got');
const url = require('url');

exports.run = async function (client, message, args) {

    exports.getTotalUsers = function () {
        return client.users.size;
    };

    exports.getUsersSplit = function () {
        return {bot: client.users.size, selfbot: userbot.selfClient.users.size};
    };

    exports.getTotalGuilds = function () {
        return client.guilds.size + userbot.selfClient.guilds.size;
    };
}