import z from 'zod';

export const login = z.object({
   username: z.string().min(1).max(255),
   password: z.string().min(1).max(255),
});

export const signup = z.object({
   name: z.string().min(1).max(255),
   username: z.string().min(1).max(255),
   password: z.string().min(1).max(255),
});
