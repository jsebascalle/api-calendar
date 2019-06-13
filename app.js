var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var secrets = require("./config/secrets");

var app = express();

app.set('view engine', 'pug');

app.use(passport.initialize());
app.use(passport.session());


// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: secrets.googleStrategy.consumerKey ,
    clientSecret: secrets.googleStrategy.consumerSecret,
    callbackURL: secrets.googleStrategy.callbackURL
  },
  function(token, tokenSecret, profile, done) {
      var user = {
      		token : token,
      		tokenSecret : tokenSecret,
      		profile : profile
      };

      return done(null,user);
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, user);
});


app.get('/', function (req, res) {
  res.render('index');
});


app.post('/login',
  passport.authenticate('google', { scope: ['profile','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/userinfo.email'] })
);

app.get('/auth/google/callback', passport.authenticate('google',{failureRedirect:'/'}),function(req,res){
	res.send(req.session);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
