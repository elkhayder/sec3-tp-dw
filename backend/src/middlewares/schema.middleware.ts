import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateSchema(schema: z.ZodObject<any, any>) {
   return (req: Request, res: Response, next: NextFunction) => {
      try {
         req.body = schema.parse(req.body);
         next();
      } catch (error) {
         if (error instanceof ZodError) {
            res.status(422).json({
               error: 'Invalid data',
               errors: error.issues.reduce(
                  (acc, issue) => {
                     const path = issue.path.join('.');
                     acc[path] = issue.message;
                     return acc;
                  },
                  {} as Record<string, string>,
               ),
            });
         } else {
            res.status(500).json({
               error: 'Internal Server Error',
            });
         }
      }
   };
}

export function validateQuery(schema: z.ZodObject<any, any>) {
   return (req: Request, res: Response, next: NextFunction) => {
      try {
         schema.parse(req.query);
         next();
      } catch (error) {
         if (error instanceof ZodError) {
            res.status(422).json({
               error: 'Invalid query parameters',
               errors: error.issues.reduce(
                  (acc, issue) => {
                     const path = issue.path.join('.');
                     acc[path] = issue.message;
                     return acc;
                  },
                  {} as Record<string, string>,
               ),
            });
         } else {
            next(error);
         }
      }
   };
}
