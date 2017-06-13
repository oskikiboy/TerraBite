const botUtils = require('./botUtils');
const requestify = require('requestify');
const moment = require('moment');
const _ = require('underscore');

exports.getRoundedUptime = uptime => {
    return uptime > 86400 ? (`${Math.floor(uptime / 86400)}d`) : (`${Math.floor(uptime / 3600)}h`);
};