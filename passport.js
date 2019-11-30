const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

// JSON WEB TOKENS STRATEGY
const { JWT_SECRET } = require('./configuration');
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

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({ email });

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
        console.log('tres')
        done(err, false);
    }
}));
