import express from 'express';
import passport from 'passport';
const router = express.Router();

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

// TODO: fix on angular side to handle the JWT token

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure', session: false }),
    (req, res) => {
        const { token } = req.user;

        // Redireciona para o frontend Angular, passando o token JWT via query string
        res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
    }
);


/*
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure', session: false }),
    (req, res) => {
        const { token } = req.user;
        //console.log(req)
        res.json({ token });
        //res.json({ message: 'Authenticated with Google', token });
    }
);
*/

export default router;
