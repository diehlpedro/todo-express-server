import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    (accessToken, refreshToken, profile, done) => {
        const user = {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName
        };

        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

        done(null, { user, token });
    }));

export default passport;
