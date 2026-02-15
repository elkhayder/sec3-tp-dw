import z from 'zod';

export const create = z.object({
   title: z.string().min(1, 'Title is required'),
   description: z.string().min(1, 'Description is required'),
   address: z.string().optional(),
   date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Date must be a valid date string',
   }),
   capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
});

export const update = z.object({
   title: z.string().min(1, 'Title is required').optional(),
   description: z.string().min(1, 'Description is required').optional(),
   address: z.string().optional(),
   date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
         message: 'Date must be a valid date string',
      })
      .optional(),
   capacity: z.coerce.number().min(1, 'Capacity must be at least 1').optional(),
});

export const listQuery = z.object({
   search: z.string().optional(),
   sortBy: z.enum(['date', 'capacity']).optional(),
   sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
