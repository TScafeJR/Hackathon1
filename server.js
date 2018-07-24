'use strict';

var express = require('express');
var app = express();
var exphbs = require('express-handlebars'); 
var path = require('path');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var util = require('util');
var flash = require('connect-flash');
const router = express.Router();
var bodyParser = require('body-parser');
var models = require('./models/models');
var bcrypt = require('bcrypt');

var User = models.User

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

var REQUIRED_ENV = ['MONGODB_URI'];
REQUIRED_ENV.forEach(function(el) {
  if (!process.env[el])
    throw new Error("Missing required env var " + el);
});

var IS_DEV = app.get('env') === 'development';

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
    .catch(function(error) {
        console.log('deserialize error', error)
        done(error);
    })
});

  // passport strategy
  passport.use(new LocalStrategy(function(username, password, done) {
    var uname = username.toLowerCase();

    User.findOne({ where: { username: uname }})
    .then(user => {
      if(user) {
        bcrypt.compare(password, user.password, function(err, res){
            if (res){
                done(null, user);
            } else {
                console.log(`The hash did not work for you \n ${err}`);
                done(null, false);
            }
        });
      } else {
        done(null, false);
      }
    })
    .catch(function(error){
        console.log(`There was an error with the Local Strategy\n ${error}`);
    })
}));

var validateReq = function(userData) {
    if (userData.password !== userData.passwordRepeat) {
        console.log("Passwords don't match.")
      return "Passwords don't match.";
    }

    if (!userData.username) {
        console.log("No username entered")
        return "Please enter a username.";
    }

    if (!userData.password) {
        console.log("No password entered")
        return "Please enter a password.";
    }
};

app.get('/register', (req, res) => {
    res.json({success: true})
})

app.post('/register', (req, res, next) => {
    var error = validateReq(req.body);

    if (error) {
        console.log('there was an error', error)
        res.json({error: error})
    }

    const saltRounds = 10;

    bcrypt.hash(req.body.password, saltRounds)
    .then(function(hash) {
        var uname = req.body.username.toLowerCase()

        var user = new User ({
            username : uname,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })

        user.save(function(err){
            if (err){
                console.log('there was an error', err)
                return res.redirect(500, '/register');
            }
        })
    })
    .then(function(){
        return res.json({success: true});
    })
    .catch(function(error) {
      console.log(`There was an error registering the User\n ${error}`)
    });
})

app.get('/login', (req, res) => {
    res.json({success: true})
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/activity',
    failureRedirect: '/login'
  }));

app.get('/activity', (req, res) => {
    res.json({success: true, user: req.user})
});

app.post('/activity', (req, res) => {
    res.json({success: true})
});

app.get('/activity/:sport', (req, res) => {
    res.json({success: true, currentSport: req.params.sport})
})

app.post('activity/:sport', (req, res) => {
    res.json({success: true}
    )
})

app.get('/users', (req, res) => {
    User.find({}, function(err, users){
        if (err){
            console.log('there was an error', err)
            res.json({success: false})
        }
        res.json({success: true, users: users})
    })
})

app.get('/profile', (req, res) => {
    console.log(req.user)
    if (req.user){
        res.send({
            success: true,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username
        })
    } else {
        res.send({
            success: false
        })
    }
})

app.get('/profile/:username', (req, res) => {
    User.find({username: req.params.username})
    .then((user)=>{
        if (user[0]){
            user[0].password = undefined;
            res.json({success: true, user: user[0]})
        } else {
            res.json({success: false});
        }
    })
    .catch((error)=>{
        console.log('there was an error', error)
        res.json({success: false});
    })
})

app.get('/messages:userId', (req, res) => {
    User.findById(req.params.userId, function(err, user){
        if (err){
            console.log('there was an error', err)
            res.json({success: false})
        }
        res.json({success: true, user: user})
    })
})

app.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.json({success: true})
        res.redirect('/login');
    });
});


module.exports = router;

app.listen(process.env.PORT || 3000, function () {
    console.log('server listening on: 3000');
});