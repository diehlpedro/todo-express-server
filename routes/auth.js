import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
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

        //const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
        //res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);

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

router.get('/logout', (req, res) => {
    // Se usar sessão (exemplo com express-session):
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Erro ao destruir sessão:', err);
            }
            // Redireciona para front-end login
            res.clearCookie('jwt_token');
            res.redirect('http://localhost:4200/login');
            //res.redirect('http://localhost:4200/login');
        });
    } else {
        res.clearCookie('jwt_token');
        // Se não usa sessão, só redireciona
        res.redirect('http://localhost:4200/login');
        //res.redirect('http://localhost:4200/login');
    }
});

export default router;
