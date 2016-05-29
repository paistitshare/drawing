var express = require('express');
var cloudinary = require('cloudinary');
var fs = require('fs');
var fileParser = require('connect-multiparty')();
var User = require('../models/user');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};

module.exports = function (passport) {
    cloudinary.config({
        cloud_name: 'paistitshare',
        api_key: '233287316764462',
        api_secret: 'yHSUvmziYP-TPn86LjHr86hAQ3I'
    });

    router.get('/', function (req, res) {
        res.render('index', {message: req.flash('message')});
    });


    router.post('/login', passport.authenticate('login', {
        successRedirect: '/draw',
        failureRedirect: '/',
        failureFlash: true
    }));


    router.get('/signup', function (req, res) {
        res.render('register', {message: req.flash('message')});
    });


    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/draw',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.post('/upload', fileParser, function (req, res) {
        var imageFile = req.files.image;
        cloudinary.uploader.upload(imageFile.path, function (result) {
            if (result.url) {
                User.findOneAndUpdate({
                    username: req.user.username
                }, {
                    $push: {
                        images: result.url
                    }
                }, function (err, rslt) {
                    if (err) throw err;
                    cloudinary.api.resources(function (items) {
                        res.render('draw', {user: req.user, images: items.resources, cloudinary: cloudinary});
                    });
                });
            } else {
                console.log('Error uploading to cloudinary: ', result);
                res.send('did not get url');
            }
        });
    });

    router.post('/workflow', function (req, res) {
        User.findOne({
            username: req.body.username
        }, function (err, result) {
            if (err) throw err;
            res.send(result.workflow);
        });
    });

    router.get('/draw', isAuthenticated, function (req, res, next) {
        cloudinary.api.resources(function (items) {
            res.render('draw', {user: req.user, images: items.resources, cloudinary: cloudinary});
        });
    });

    router.post('/save', isAuthenticated, function (req, res) {
        User.findOneAndUpdate({
            username: req.user.username
        }, {workflow: req.body.workflow}, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
