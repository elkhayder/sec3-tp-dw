import type { Request, Response } from 'express';
import { prisma } from '../db/connection.js';

export const register = async (req: Request<{ id: string }>, res: Response) => {
   const eventId = parseInt(req.params.id);
   const userId = req.user!.id;

   const event = await prisma.event.findUnique({ where: { id: eventId } });
   if (!event) {
      res.sendStatus(404);
      return;
   }

   // Check if already registered
   const existing = await prisma.reservation.findUnique({
      where: { userId_eventId: { userId, eventId } },
   });
   if (existing) {
      res.status(409).json({ message: 'Already registered for this event' });
      return;
   }

   // Check capacity
   const currentCount = await prisma.reservation.count({ where: { eventId } });
   if (currentCount >= event.capacity) {
      res.status(409).json({ message: 'Event is fully booked' });
      return;
   }

   const reservation = await prisma.reservation.create({
      data: { userId, eventId },
   });

   res.status(201).json({ message: 'Registered successfully', reservation });
};

export const unregister = async (
   req: Request<{ id: string }>,
   res: Response,
) => {
   const eventId = parseInt(req.params.id);
   const userId = req.user!.id;

   const reservation = await prisma.reservation.findUnique({
      where: { userId_eventId: { userId, eventId } },
   });
   if (!reservation) {
      res.status(404).json({ message: 'No registration found' });
      return;
   }

   await prisma.reservation.delete({
      where: { id: reservation.id },
   });

   res.json({ message: 'Unregistered successfully' });
};
