const requestify = require('requestify');
const moment = require('moment');
const sio = require("socket.io");
const fs = require('fs');
const minify = require('express-minify');
const express = require('express')
const config = require("../config.json")
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const RateLimit = require("express-rate-limit");
const http = require('http');
let connection;
var path = require('path');
var minifyHTML = require('express-minify-html');

module.exports = function(app, config, client, req, passport, DiscordS) {


    const server = http.createServer(app).listen(config.server_port, (err) => {
            if (err) {
                console.error(`FAILED TO OPEN WEB SERVER, ERROR: ${err.stack}`);
                return;
            }
            console.info(`Successfully started server.. listening on port ${config.server_port}`);
})
    const io = sio(server);


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, 'static')))
    app.use(minifyHTML({
        override:      true,
        exception_url: false,
        htmlMinifier: {
            removeComments:            true,
            collapseWhitespace:        true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes:     true,
            removeEmptyAttributes:     true,
            minifyJS:                  true
        }
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieSession({
        name: 'loginSession',
        keys: [config.clientID, config.session_secret],
        maxAge: 12 * 60 * 60 * 1000 // 48 hours
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    const scopes = [
        'identify',
        'guilds'
    ];

    passport.serializeUser((user, done) => {
        done(null, user);
});

    passport.deserializeUser((obj, done) => {
        done(null, obj);
});

    passport.use(new DiscordS({
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: `${config.host}/login/callback`,
            scopes: scopes

        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
            return done(null, profile);
});
}));


    // Data API
    app.use("/api/", new RateLimit({
        windowMs: 3600000, // 150 requests/per hr
        max: 150,
        delayMs: 0
    }));
    app.get("/api", (req, res) => {
        res.json({
        server_count: client.guilds.size,
        user_count: client.users.size
    });
});

    app.get('/login', passport.authenticate('discord', {
        scope: scopes
    }), function(req, res) {});
    app.get('/login/callback',
        passport.authenticate('discord', {
            failureRedirect: '/error'
        }), (req, res) => {
    {
        res.redirect('/dashboard')
    }
    console.log(`- ${req.user.username} has logged on.`);
} // auth success
    );


    app.get("/debug", checkAuth, (req, res) => {
        res.json(req.user);
});

    app.get("/logout", (req, res) => {
        req.logout();
    res.redirect("/");
})

    // Maintenance mode
    app.use(function(req, res, next) {
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
            function format(seconds) {
        function pad(s) {
            return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60 * 60));
        var minutes = Math.floor(seconds % (60 * 60) / 60);
        var seconds = Math.floor(seconds % 60);

        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    }
    let uptime = process.uptime();

    res.render('index', {
        loggedInStatus: req.isAuthenticated(),
        userRequest: req.user || false,
        botuptime: format(uptime),
        guildamount: client.guilds.size,
        useramount: client.users.size,
        title: "The Best Discord Bot you'll ever come across.",
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
            title: 'Blog',
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

    app.get("/maintenance", (req, res) => {
        try {
            res.render('maintenance', {
            error_code: 503,
            message: config.maintenance_msg,
            title: 'Maintenance'
        })
    } catch (err) {
        console.error(`An error has occurred trying to load the error page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    app.get('/dashboard', checkAuth, (req, res) => {

        try {
            res.render('dashboard', {
            loggedInStatus: req.isAuthenticated(),
            userRequest: req.user || false,
            title: 'Dashboard',
            support: config.support
        })

    } catch (err) {
        console.error(`Unable to load dashboard, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    app.get('/global-options', checkAuth, (req, res) => {
        if (config.developers.indexOf(req.user.id) > -1 || config.owners.indexOf(req.user.id) > -1) {

        try {

            let superMaintainer = config.developers.indexOf(req.user.id) > -1 || config.owners.indexOf(req.user.id) > -1;

            res.render('global', {
                loggedInStatus: req.isAuthenticated(),
                userRequest: req.user || false,
                title: 'Global Dashboard',
                superMaintainer: superMaintainer,
                support: config.support
            });

        } catch (err) {
            console.error(`Unable to load maintainer page, Error: ${err.stack}`);
            renderErrorPage(req, res, err);
        }
    } else {
        req.session.redirect = req.path;
        res.status(403);
        res.render('badLogin', {
            loggedInStatus: req.isAuthenticated(),
            userRequest: req.user || false,
            title: 'Unauthorised',
            support: config.support
        });
    }
});



    // Error
    app.get("/error", (req, res) => {
        try {
            res.render('error', {
            loggedInStatus: req.isAuthenticated(),
            userRequest: req.user || false,
            error_code: 500,
            error_text: "Why did you go to this URL? Normally an error message will be displayed here.",
            title: 'Error',
            support: config.support
        })
    } catch (err) {
        console.error(`An error has occurred trying to load the error page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    //404 Error page (Must be the last route!)
    app.use(function(req, res, next) {
        try {
            res.render('error', {
                error_code: 404,
                error_text: "The page you requested could not be found or rendered. Please check your request URL for spelling errors and try again. If you believe this error is faulty, please contact a system administrator.",
                title: 'Error',
                loggedInStatus: req.isAuthenticated(),
                userRequest: req.user || false,
                support: config.support
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
            error_text: err,
            title: 'Error',
            loggedInStatus: req.isAuthenticated(),
            userRequest: req.user || false,
            support: config.support
        })
    } else {
        res.render('error', {
            error_code: 500,
            error_text: errorText,
            title: 'Error',
            loggedInStatus: req.isAuthenticated(),
            userRequest: req.user || false,
            support: config.support
        })
    }
}

function checkAuth(req, res, next) {
    try {

        if (req.isAuthenticated()) return next();

        req.session.redirect = req.path;
        res.status(403);
        res.render('badLogin', {
            loggedInStatus: req.isAuthenticated(),
            userRequest: req.user || false,
            title: 'Unauthorised',
            support: config.support
        });
    } catch (err) {
        console.error(`An error has occurred trying to check auth, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
}