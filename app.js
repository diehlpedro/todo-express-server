import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import session from 'express-session';
import passport from './auth/google.js';
import jwt from 'jsonwebtoken';
import todosRouter from './routes/todos.js';
import sectionsRouter from './routes/sections.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger/swagger.json'));

const app = express();
/*
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
*/
app.use(cors({
  origin: '*', // ou defina o IP do celular se quiser limitar
}));

app.use(express.json());
app.use('/todos', todosRouter);
app.use('/sections', sectionsRouter);
app.use('/auth', authRouter);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token malformed' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    if (!decoded.userId) return res.status(403).json({ error: 'Invalid token payload' });
    req.user = decoded;
    next();
  });
}

const PORT = process.env.PORT || 3000;
//app.listen(PORT, '0.0.0.0', () => {
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
