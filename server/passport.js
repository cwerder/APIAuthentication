const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

// JSON WEB TOKENS STRATEGY
const { JWT_SECRET, oauth } = require('./configuration');
const User = require('./Models/user');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // find the user specified in token
        const user = await User.findById(payload.sub);

        // if user does not exist, handle it
        if (!user) {
            return done(null, false);
        }

        // otherwise, return the user
        done(null, user);
        // sets user to req.user
    } catch (err) {
        done(err, false);
    }
}));

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: oauth.google.clientID,
    clientSecret: oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        // check if the current user exists in our database
        const existingUser = await User.findOne({ "google.id": profile.id});
        if (existingUser) {
            console.log('User already exists in our database.')
            return done(null, existingUser);
        }

        console.log('User doesn\'t exist in our database. Creating a new one.');

        // If new account
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: oauth.facebook.clientID,
    clientSecret: oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);
    }
    catch (error) {
        console.log('err', error);
        done(error, false, error.message)
    }
} ));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({
            "local.email": email
        });

        // If not, handle it
        if (!user) {
            return done(null, false);
        }

        // If found, check if the password is correct
        const isMatch = await user.isValidPassword(password);

        // otherwise, handle it
        if (!isMatch) {
            return done(null, false);
        }

        // success
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));
