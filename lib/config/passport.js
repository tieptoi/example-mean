// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    config = require('./config'),
    User = mongoose.model('User'),
    auth = require('../controllers/auth'),
    request = require('request'),
    jwt = require('jwt-simple');

// expose this function to our app using module.exports
module.exports = function (passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            console.log(req.body);
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({
                    email: email
                }, function (err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new User(req.body);

                        // set the user's credentials
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            delete newUser.password;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            // asynchronous
            process.nextTick(function () {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({
                    email: email
                }, function (err, user) {
                    // if there are any errors, return the error before anything else
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                    // if the user is found but the password is wrong
                    if (!user.isValidPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    delete user.password;
                    // all is well, return successful user
                    return done(null, user);
                });
            });
        }));
    /*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
    passport.facebook = function (req, res) {
        var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
        var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
        var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.facebookAuth.clientSecret,
            redirect_uri: req.body.redirectUri
        };

        // Step 1. Exchange authorization code for access token.
        request.get({
            url: accessTokenUrl,
            qs: params,
            json: true
        }, function (err, response, accessToken) {
            console.log(err);
            if (response.statusCode !== 200) {
                return res.status(500).send({
                    message: accessToken.error.message
                });
            }

            // Step 2. Retrieve profile information about the current user.
            request.get({
                url: graphApiUrl,
                qs: accessToken,
                json: true
            }, function (err, response, profile) {
                if (response.statusCode !== 200) {
                    return res.status(500).send({
                        message: profile.error.message
                    });
                }
                console.log(profile);
                if (req.headers.authorization) {
                    User.findOne({
                        facebook: profile.id
                    }, function (err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({
                                message: 'There is already a Facebook account that belongs to you'
                            });
                        }
                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.token_secret);
                        User.findById(payload.sub, function (err, user) {
                            if (!user) {
                                return res.status(400).send({
                                    message: 'User not found'
                                });
                            }
                            user.facebook = profile.id;
                            user.picture = user.picture || 'https://graph.facebook.com/v2.5/' + profile.id + '/picture?type=large';
                            user.displayName = user.displayName || profile.name;
                            user.save(function () {
                                delete user.password;
                                var token = auth.createJWT(user);
                                res.send({
                                    token: token,
                                    user: user
                                });
                            });
                        });
                    });
                } else {
                    // Step 3b. Create a new user account or return an existing one.
                    User.findOne({
                        facebook: profile.id
                    }, function (err, existingUser) {
                        if (existingUser) {
                            delete existingUser.password;
                            var token = auth.createJWT(existingUser);
                            return res.send({
                                token: token,
                                user: existingUser
                            });
                        }
                        var user = new User();
                        user.facebook = profile.id;
                        user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                        user.displayName = profile.name;
                        user.save(function () {
                            var token = auth.createJWT(user);
                            res.send({
                                token: token,
                                user: user
                            });
                        });
                    });
                }
            });
        });
    };

};
