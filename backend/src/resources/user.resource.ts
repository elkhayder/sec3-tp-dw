import type { User } from '@prisma/client';

type UserInput = Pick<User, 'id' | 'name' | 'username'> &
   Partial<Pick<User, 'createdAt' | 'updatedAt'>>;

export const userResource = (user: UserInput) => ({
   id: user.id,
   name: user.name,
   username: user.username,
   ...(user.createdAt !== undefined ? { createdAt: user.createdAt } : {}),
   ...(user.updatedAt !== undefined ? { updatedAt: user.updatedAt } : {}),
});
