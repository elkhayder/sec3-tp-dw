import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.ts';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as JWT from '../utils/jwt.ts';

const login = async (req: Request, res: Response) => {
   const { username, password } = req.body;

   const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username],
   );

   if (rows.length === 0 || !rows[0]) {
      return res.sendStatus(401);
   }

   const user = rows[0];

   const isPasswordValid = await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
      return res.sendStatus(401);
   }

   const token = JWT.generateUserToken({
      id: user.id,
      username: user.username,
   });

   return res.json({ token, user: { id: user.id, username: user.username } });
};

const signup = async (req: Request, res: Response) => {
   const { username, password } = req.body;

   const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username],
   );

   if (rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const [inserted] = await db.query<ResultSetHeader>(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
   );

   const userId = inserted.insertId;

   const token = JWT.generateUserToken({
      id: userId,
      username: username,
   });

   return res.status(201).json({ token, user: { id: userId, username } });
};

const me = async (req: Request, res: Response) => {
   const user = req.user;

   if (!user) {
      return res.sendStatus(401);
   }

   return res.json({ user });
};

export { login, signup, me };
