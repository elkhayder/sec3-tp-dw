import express from 'express';
import cors from 'cors';

import * as authController from './controllers/auth.controller.ts';
import * as authMiddleware from './middlewares/auth.middleware.ts';

const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/auth/login', authController.login);
app.post('/auth/signup', authController.signup);
app.get('/auth/me', authMiddleware.loggedIn, authController.me);

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
