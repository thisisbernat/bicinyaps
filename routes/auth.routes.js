// routes/auth.routes.js
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { Router } = require('express');
const router = new Router();

const User = require("../models/User.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

//////////// S I G N U P ///////////

// GET route ==> to display the signup form to users
//router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', isLoggedOut, (req, res, next) => {
    // console.log("The form data: ", req.body);

    const { username, email, password } = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({ username, email, passwordHash: hashedPassword });
        })
        .then(userFromDB => {
            console.log('Newly created user is: ', userFromDB);
            res.redirect('/admin')
        })
        .catch(error => next(error));
});



//////////// L O G I N ///////////

// GET route ==> to display the login form to users
router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/login', isLoggedOut, (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                //res.render('users/user-profile', { user });
                req.session.currentUser = user;
                res.redirect('/admin');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
});

//////////// L O G O U T ///////////

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
});

module.exports = router;
