const requestify = require('requestify');
const moment = require('moment');
const fs = require('fs');
const express = require('express')
var path = require('path');
const getAuthUser = user => {
    return {
        username: user.username,
        id: user.id,
        avatar: user.avatar ? (`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`) : "/static/img/discord-icon.png"
    };
};

module.exports = function (app, config, client, req) {

    app.set('view engine', 'ejs');


    // Maintenance mode
    app.use(function (req, res, next) {
        if (config.maintenance === true) {

            // Need this condition to avoid redirect loop
            if (req.url !== '/maintenance') {
                res.redirect('/maintenance');
            } else {
                next();
            }
            return
        } else {
            next();
        }
    });

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
        authUser: req.isAuthenticated() ? getAuthUser(req.user) : null,
        loggedInStatus: req.isAuthenticated(),
        userRequest: req.user || false,
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
                loggedInStatus: req.isAuthenticated(),
                userRequest: req.user || false,
                title: 'Terrabite &bull; Blog',
                support: config.support,
        })

    } catch (err) {
        console.error(`Unable to load blog page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    app.get('/add', (req, res) => {
        try {
            res.redirect(config.invitelink);

} catch (err) {
        console.error(`An error occurred trying to redirect to the bot page, Error: ${err.stack}`);
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

    // Policy
    app.get('/paperwork', (req, res) => {

        try {

            res.render('policy', {
            title: 'TerraBite &bull; Paperwork'
        })

    } catch (err) {
        console.error(`Unable to load policy page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    app.get("/maintenance", (req, res) => {
        try {
            res.render('maintenance', {
            error_code: 503,
            message: config.maintenance_msg,
            title: 'TerraBite &bull; Error'
        })
    } catch (err) {
        console.error(`An error has occurred trying to load the error page, Error: ${err.stack}`);
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
    });
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