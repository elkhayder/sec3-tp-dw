import type { Request, Response } from 'express';
import z from 'zod';
import schemas from '../schemas/index.js';
import { prisma } from '../db/connection.js';
import type { Prisma } from '@prisma/client';
import { eventResource, eventListResource } from '../resources/index.js';

export const create = async (
   req: Request<{}, {}, z.infer<typeof schemas.event.create>>,
   res: Response,
) => {
   const { title, description, date, capacity, address } = req.body;

   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

   const event = await prisma.event.create({
      data: {
         userId: req.user!.id,
         title,
         description,
         imageUrl,
         date: new Date(date),
         capacity,
         address: address || null,
      },
   });

   res.status(201).json({ message: 'Event created successfully', event: eventResource(event) });
};

export const list = async (req: Request, res: Response) => {
   const { search, sortBy = 'date', sortOrder = 'DESC' } = req.query as any;

   const where: Prisma.EventWhereInput = {};
   if (search) {
      where.OR = [
         { title: { contains: search, mode: 'insensitive' } },
         { description: { contains: search, mode: 'insensitive' } },
      ];
   }

   const events = await prisma.event.findMany({
      where,
      take: 20,
      orderBy: { [sortBy]: sortOrder.toLowerCase() },
      include: {
         _count: { select: { reservations: true } },
         reservations: {
            where: { userId: req.user?.id || 0 },
            select: { id: true },
         },
      },
   });

   res.json({ events: eventListResource(events) });
};

export const getById = async (req: Request<{ id: string }>, res: Response) => {
   const id = parseInt(req.params.id);

   const event = await prisma.event.findUnique({
      where: { id },
      include: {
         user: { select: { id: true, name: true, username: true } },
         _count: { select: { reservations: true } },
         reservations: {
            where: { userId: req.user?.id || 0 },
            select: { id: true },
         },
      },
   });

   if (!event) {
      res.sendStatus(404);
      return;
   }

   res.json({ event: eventResource(event) });
};

export const update = async (
   req: Request<{ id: string }, {}, z.infer<typeof schemas.event.update>>,
   res: Response,
) => {
   const id = parseInt(req.params.id);
   const existing = await prisma.event.findUnique({ where: { id } });

   if (!existing) {
      res.sendStatus(404);
      return;
   }
   if (existing.userId !== req.user!.id) {
      res.sendStatus(403);
      return;
   }

   const { title, description, date, capacity, address } = req.body;

   const data: Prisma.EventUpdateInput = {};
   if (title !== undefined) data.title = title;
   if (description !== undefined) data.description = description;
   if (date !== undefined) data.date = new Date(date);
   if (capacity !== undefined) data.capacity = capacity;
   if (address !== undefined) data.address = address;
   if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

   const event = await prisma.event.update({ where: { id }, data });

   res.json({ message: 'Event updated successfully', event: eventResource(event) });
};

export const remove = async (req: Request<{ id: string }>, res: Response) => {
   const id = parseInt(req.params.id);
   const event = await prisma.event.findUnique({ where: { id } });

   if (!event) {
      res.sendStatus(404);
      return;
   }
   if (event.userId !== req.user!.id) {
      res.sendStatus(403);
      return;
   }

   await prisma.event.delete({ where: { id } });

   res.json({ message: 'Event deleted successfully' });
};
