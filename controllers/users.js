const JWT = require('jsonwebtoken');

const User = require('../Models/user');
const { JWT_SECRET } = require('../configuration');

signToken = user => {
    return JWT.sign({
        iss: 'cj',
        sub: user._id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) //current time + 1 day ahead
    }, JWT_SECRET);// second argument is the secret
}

module.exports = {
    signUp: async (req, res, next) => {
        console.log('UsersController.signUp called');
        const { email, password } = req.body;

        // Check if there is a user with the same email
        const foundUser = await User.findOne({ email });

        if (foundUser) {
            return res.status(403)
                .json({ error: 'Account is already created'});
        }

        // Create a new user
        const newUser = new User({ email, password });

        await newUser.save().catch(err => console.log(err));

        // Generate token
        const token = signToken(newUser);

        // Respond with token
        res.status(200).json({ token })
    },
    signIn: async (req, res, next) => {
        console.log('UsersController.signIn called');
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    secret: async (req, res, next) => {
        console.log('UsersController.secret called');
        res.status(200).json({ secret: JWT_SECRET });
    }
}