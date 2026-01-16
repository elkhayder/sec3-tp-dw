import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.ts';
import type { RowDataPacket } from 'mysql2';
import JWT from '../utils/jwt.ts';

const login = async (req: Request, res: Response) => {
   const { username, password } = req.body;

   const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
   );

   if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
   }

   const user = rows[0];

   const isPasswordValid = await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
   }

   const token = JWT.generateUserToken({ username: user.username });

   return res.json({ token, user: { id: user.id, username: user.username } });
};

export { login };
