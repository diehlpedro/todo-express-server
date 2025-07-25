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
dotenv.config();

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger/swagger.json'));

const app = express();
const PORT = 3000;

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

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('No token provided');

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
