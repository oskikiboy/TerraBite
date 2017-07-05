module.exports = function (config, app, passport, DiscordS) {

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

    app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
    app.get('/login/callback',
        passport.authenticate('discord', { failureRedirect: '/error' }), (req, res) => { { res.redirect('/') } console.log(`- ${req.user.username} has logged on.`); } // auth success
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



