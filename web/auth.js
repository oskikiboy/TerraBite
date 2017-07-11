const express = require("express")
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const RateLimit = require("express-rate-limit");

module.exports = function (config, app, passport, DiscordS, client) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieSession({
        name: 'loginSession',
        keys: [config.clientID, config.session_secret],
        maxAge: 12 * 60 * 60 * 1000 // 48 hours
    }));

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

    app.use(passport.initialize());
    app.use(passport.session());


    // Data API
    app.use("/api/", new RateLimit({
        windowMs: 3600000,	// 150 requests/per hr
        max: 150,
        delayMs: 0
    }));
    app.get("/api", (req, res) => {
        res.json({
        server_count: client.guilds.size,
        user_count: client.users.size
    });
});

    app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
    app.get('/login/callback',
        passport.authenticate('discord', { failureRedirect: '/error' }), (req, res) => { { res.redirect('/dashboard') } console.log(`- ${req.user.username} has logged on.`); } // auth success
    );


    app.get("/info", checkAuth, (req, res) => {
        res.json(req.user);
});

    app.get("/logout", (req, res) => {
        req.logout();
    res.redirect("/");
})
};

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.json('Sorry it appears you aren\'t logged in!');
}



