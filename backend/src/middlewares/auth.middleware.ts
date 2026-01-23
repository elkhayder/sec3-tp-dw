import type { NextFunction, Request, Response } from 'express';
import * as JWT from '../utils/jwt.ts';

export const loggedIn = (req: Request, res: Response, next: NextFunction) => {
   const token = JWT.getTokenFromRequest(req);

   if (!token) {
      return res.sendStatus(401);
   }

   const user = JWT.getUserFromToken<typeof req.user>(token);

   if (!user) {
      return res.sendStatus(403);
   }

   req.user = user;

   next();
};
