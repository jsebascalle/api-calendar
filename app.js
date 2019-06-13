var express = require('express');
var passport = require('passport');
var Event = require('./calendar-client');
var cookieSession = require('cookie-session');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var secrets = require("./config/secrets");

var app = express();

app.set('view engine', 'pug');

app.use(cookieSession({
	keys: ['asjdahjsdhkashdkaskda','asdbjashjdhnjasnhdnjgcvvvvd']
}))

app.use(passport.initialize());
app.use(passport.session());


// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: secrets.google.consumerKey ,
    clientSecret: secrets.google.consumerSecret,
    callbackURL: secrets.google.callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
      var user = {
      		accessToken : accessToken,
      		refreshToken : refreshToken,
      		profile : profile
      };

      return cb(null,user);
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.get('/', function (req, res) {

  if (isLogginIn(req)) {

  	var event = new Event(req.session.passport.user.accessToken);

  	event.all(function(data){
  		res.send(data);
  	});

  	//res.render('home');
  }else{
  	res.render('index');
  }

});


app.post('/login',
  passport.authenticate('google', { scope: ['profile','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/userinfo.email'] })
);

app.get('/logout',function(req,res){
  if (isLogginIn(req)) {
  	req.session.passport.user = null;
  }

  res.redirect('/');
});

app.get('/auth/google/callback', passport.authenticate('google',{failureRedirect:'/'}),function(req,res){
	res.send(req.session);
});


function isLogginIn(req){
	return typeof req.session.passport !== "undefined" && req.session.passport.user;
}	


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
