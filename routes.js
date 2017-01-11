var path = require("path");
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser')
var User = require('./models/user');
var flash = require('connect-flash');

module.exports = function(app) {

    function isLoggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    // passport config
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use(cookieParser('secretString'));
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: 'super cereal',
        cookie: {
            maxAge: 60000,
        }
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.param('username', function(req, res, next, username) {
        User.findOne({
            'username': username
        }, function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log("User not found!\n" + user);
            }

            req.user = user;
            return next();
        });
    });

    app.get("/", function(req, res) {
        res.redirect('/home');
    })

    app.get("/home", function(req, res) {
        res.render('home');
    })

    app.get("/profile/:username", isLoggedIn, function(req, res) {
        res.render('profile', req.user);
    })

    app.get('/login', function(req, res, next) {
        res.render('login', req.flash());
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error', info.message);
                req.flash('username', req.body.username);

                res.redirect('/login');
            } else {
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/profile/' + user.username);
                });
            }
        })(req, res, next);
    });

    app.get("/register", function(req, res) {
        res.render('register', req.body);
    })

    app.post('/register', function(req, res) {
        User.register(new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            favouriteWebsite: req.body.favouriteWebsite,
            favouriteColour: req.body.favouriteColour
        }), req.body.password, function(err, user) {
            if (err) {
                req.body.error = err
                res.render('register', req.body);
            } else {
                passport.authenticate('local')(req, res, function() {
                    return res.redirect('/profile/' + req.user.username);
                });
            }
        });
    });

    app.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/home');
    });

};
