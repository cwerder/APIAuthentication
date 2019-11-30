require('express');
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportJWT = passport.authenticate('jwt', {session: false});
const passportLocal = passport.authenticate('local', {session: false});

router.post('/signup', validateBody(schemas.authSchema), UsersController.signUp);

router.post('/signin', validateBody(schemas.authSchema), 
    passportLocal, UsersController.signIn);

router.get('/secret', passportJWT, UsersController.secret);

module.exports = router;