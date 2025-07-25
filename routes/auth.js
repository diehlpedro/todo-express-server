import express from 'express';
import passport from 'passport';
const router = express.Router();

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure', session: false }),
    (req, res) => {
        const { token } = req.user;
        res.json({ message: 'Authenticated with Google', token });
    }
);

export default router;
