import type { Request } from 'express';
import jwt from 'jsonwebtoken';

const JWT_KEY = 'nyundnc9329cw BDcnecac2';

export const getTokenFromRequest = (req: Request) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   return token || null;
};

export const getUserFromToken = <T>(token: string) => {
   try {
      return jwt.verify(token, JWT_KEY) as T;
   } catch (error) {
      return null;
   }
};

export const generateUserToken = <T>(
   user: T,
   expiresIn: number | string = '1h'
) => {
   return jwt.sign(user as jwt.JwtPayload, JWT_KEY, {
      expiresIn: expiresIn as any,
   });
};
