const User = require('../Models/user');

module.exports = {
    signUp: async (req, res, next) => {
        console.log('UsersController.signUp called');
        const { email, password } = req.body;

        // Check if there is a user with the same email
        const foundUser = await User.findOne({ email })

        if (foundUser) {
            return res.status(403)
                .json({ error: 'Account is already created'});
        }

        // Create a new user
        const newUser = new User({ email, password });

        const createdUser = await newUser.save();

        // Respond with token
        res.json({ user: createdUser })
    },
    signIn: async (req, res, next) => {
        // Generate token
        console.log('UsersController.signIn called');
    },
    secret: async (req, res, next) => {
        console.log('UsersController.secret called');
    }
}