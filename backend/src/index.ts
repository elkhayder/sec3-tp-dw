import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import schemas from './schemas/index.js';
import {
   validateSchema,
   validateQuery,
} from './middlewares/schema.middleware.js';

import * as authController from './controllers/auth.controller.js';
import * as authMiddleware from './middlewares/auth.middleware.js';

import * as eventsController from './controllers/events.controller.js';
import * as reservationsController from './controllers/reservations.controller.js';
import { upload } from './middlewares/upload.middleware.js';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Auth
app.post(
   '/auth/login',
   validateSchema(schemas.auth.login),
   authController.login,
);
app.post(
   '/auth/signup',
   validateSchema(schemas.auth.signup),
   authController.signup,
);
app.get('/auth/me', authMiddleware.loggedIn, authController.me);

// Events
app.post(
   '/events',
   authMiddleware.loggedIn,
   upload.single('image'),
   validateSchema(schemas.event.create),
   eventsController.create,
);
app.get(
   '/events',
   authMiddleware.loggedIn,
   validateQuery(schemas.event.listQuery),
   eventsController.list,
);
app.get('/events/:id', authMiddleware.loggedIn, eventsController.getById);
app.put(
   '/events/:id',
   authMiddleware.loggedIn,
   upload.single('image'),
   validateSchema(schemas.event.update),
   eventsController.update,
);
app.delete('/events/:id', authMiddleware.loggedIn, eventsController.remove);

// Reservations
app.post(
   '/events/:id/register',
   authMiddleware.loggedIn,
   reservationsController.register,
);
app.delete(
   '/events/:id/register',
   authMiddleware.loggedIn,
   reservationsController.unregister,
);

app.use(
   (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
   ) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ error: err.message });
   },
);

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
