import express from 'express';
import cors from 'cors';

import * as authController from './controllers/auth.controller.ts';

const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/auth/login', authController.login);

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
