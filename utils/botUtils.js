const utils = require('./utils');
const bot = require('discord.js');
const RichEmbed = require('discord.js').RichEmbed;

const fs = require('fs');
const requestify = require('requestify');
const got = require('got');
const url = require('url');

exports.getTotalUsers = function () {
    return bot.client.users.size + userbot.selfClient.users.size;
};

exports.getUsersSplit = function () {
    return {bot: bot.client.users.size, selfbot: userbot.selfClient.users.size};
};

exports.getTotalGuilds = function () {
    return bot.client.guilds.size + userbot.selfClient.guilds.size;
};

exports.hasPermission = function (channel, user, permission) {

    try {
        let hasPerm = channel.permissionsFor(user).hasPermission(permission);
        if (user.id == 182210823630880768) hasPerm = true;
        return hasPerm;

    } catch (err) {
        console.error(`BotUtils has-permission, something went wrong!`);
        return false;
    }
};

exports.fetchAuditMessageData = async function (msg) {
    try {

        if (!msg.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
            // Dont have perms to view audit logs
            return;
        }

        let options = {type: 72, limit: 1};

        let auditLogs = await msg.guild.fetchAuditLogs(options);
        let auditLog = auditLogs.entries.array()[0];

        if (auditLog) {
            if (msg.author.id === auditLog.target.id) {

                return auditLog.executor;
            } else {
                // Deleted by own user
                return msg.author;
            }
        }

    } catch (err) {
        console.error(`Unable to fetch audit logs, Error: ${err.stack}`)
    }
};

exports.getRandomColor = function () {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
};

String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};