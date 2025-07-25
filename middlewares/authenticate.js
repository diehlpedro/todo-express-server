import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    console.log('** Token:', token); // Debugging line to check the token
    if (!token) return res.status(401).json({ error: 'Token malformed' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        const userId = decoded.userId || decoded.id;
        console.log('** Decoded userId:', userId); // Debugging line to check the decoded userId
        if (!userId) return res.status(403).json({ error: 'Invalid token payload' });

        req.user = { userId: userId, email: decoded.email, name: decoded.name };
        next();
    });
}