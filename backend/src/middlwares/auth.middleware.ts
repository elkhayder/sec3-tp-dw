import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/jwt';

export const loggedIn = (req: Request, res: Response, next: NextFunction) => {
   const token = JWT.getTokenFromRequest(req);

   if (!token) {
      return res.sendStatus(401);
   }

   const user = JWT.getUserFromToken<{ username: string }>(token);

   if (!user) {
      return res.sendStatus(403);
   }

   (req as any).user = user;

   next();
};
