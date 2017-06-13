const requestify = require('requestify');
const moment = require('moment');
const express = require('express');
const fs = require('fs');
var path = require('path');

module.exports = function (app, config) {

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname, 'static')));

    app.get('/', (req, res) => {
        try {

            let uptime = process.uptime();
    res.render('index', {
    })
} catch (err) {
        renderErrorPage(req, res, err);
    }
});

    app.get('/blog', (req, res) => {

        try {

            res.render('blog', {
        })

    } catch (err) {
        console.error(`Unable to load blog page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    app.get('/wip', (req, res) => {

        try {

            res.render('wip', {
        })

    } catch (err) {
        console.error(`Unable to load blog page, Error: ${err.stack}`);
        renderErrorPage(req, res, err);
    }
});

    // Error
    app.get("/error", (req, res) => {
        try {
            res.render('error', {
            error_code: 500,
            error_text: "Why did you go to this URL? Normally an error message will be displayed here.",
            googleAnalyticsCode: config.googleAnalyticsCode
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