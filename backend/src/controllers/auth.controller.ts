import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as JWT from '../utils/jwt.js';
import { prisma } from '../db/connection.js';
import { userResource } from '../resources/index.js';

const login = async (req: Request, res: Response) => {
   const { username, password } = req.body;

   const user = await prisma.user.findUnique({
      where: { username },
   });

   if (!user) {
      return res.sendStatus(401);
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
      return res.sendStatus(401);
   }

   const token = JWT.generateUserToken({
      id: user.id,
      username: user.username,
      name: user.name,
   });

   return res.json({
      token,
      user: userResource(user),
   });
};

const signup = async (req: Request, res: Response) => {
   const { username, password, name } = req.body;

   const existingUser = await prisma.user.findUnique({
      where: { username },
   });

   if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const user = await prisma.user.create({
      data: {
         username,
         password: hashedPassword,
         name,
      },
   });

   const token = JWT.generateUserToken({
      id: user.id,
      username: user.username,
      name: user.name,
   });

   return res.status(201).json({
      token,
      user: userResource(user),
   });
};

const me = async (req: Request, res: Response) => {
   const user = req.user;

   if (!user) {
      return res.sendStatus(401);
   }

   return res.json({ user });
};

export { login, signup, me };
