const requestify = require('requestify');
const moment = require('moment');
const express = require('express');
const fs = require('fs');
var path = require('path');
const Discord = require("discord.js");
const bot = new Discord.Client();

module.exports = function (app, config, client, req) {

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname, 'static')));

    app.get("/", (req, res) => {
        try {
            function format(seconds){
        function pad(s){
            return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60*60));
        var minutes = Math.floor(seconds % (60*60) / 60);
        var seconds = Math.floor(seconds % 60);

        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    }

    let uptime = process.uptime();
    res.render('index', {
        botuptime: format(uptime),
        guildamount: client.guilds.size,
        useramount: client.users.size,
        title: 'TerraBite &bull; Home',
        support: config.support
    })
} catch (err) {
        renderErrorPage(req, res, err);
        console.error(`Unable to load home page, Error ${err.stack}`);
    }
});

    app.get('/blog', (req, res) => {

        try {

            res.render('blog', {
                title: 'Terrabite &bull; Blog',
                support: config.support,
        })

    } catch (err) {
        console.error(`Unable to load blog page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    app.get('/add', (req, res, config) => {

        try {

            res.redirect(config.invitelink);

        } catch (err) {
            console.error(`Unable to load add page, Error: ${err.stack}`);
            renderErrorPage(req, res, err);
    }

});
    // Work in progress
    app.get('/wip', (req, res) => {

        try {

            res.render('wip', {
                title: 'TerraBite &bull; WIP'
        })

    } catch (err) {
        console.error(`Unable to load WIP page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    // Error
    app.get("/error", (req, res) => {
        try {
            res.render('error', {
            error_code: 500,
            error_text: "Why did you go to this URL? Normally an error message will be displayed here.",
            title: 'TerraBite &bull; Error'
        })
    } catch (err) {
        console.error(`An error has occurred trying to load the error page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    //404 Error page (Must be the last route!)
    app.use(function (req, res, next) {
        try {
            res.render('error', {
                error_code: 404,
                error_text: "The page you requested could not be found or rendered. Please check your request URL for spelling errors and try again. If you believe this error is faulty, please contact a system administrator.",
                title: 'TerraBite &bull; Error'
            })
        } catch (err) {
            console.error(`An error has occurred trying to load the 404 page, Error: ${err.stack}`);
            renderErrorPage(req, res, err);
        }
    })

};

function renderErrorPage(req, res, err, errorText) {

    if (err) {
        console.error(`An error has occurred in Web.js, Error: ${err.stack}`);
        res.render('error', {
            error_code: 500,
            error_text: err
        })
    } else {
        res.render('error', {
            error_code: 500,
            error_text: errorText
        })
    }
}