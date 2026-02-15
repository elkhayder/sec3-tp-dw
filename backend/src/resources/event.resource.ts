import type { Event, User } from '@prisma/client';
import { userResource } from './user.resource.js';

type EventWithRelations = Event & {
   _count?: { reservations: number };
   reservations?: { id: number }[];
   user?: Pick<User, 'id' | 'name' | 'username'> &
      Partial<Pick<User, 'createdAt' | 'updatedAt'>>;
};

export const eventResource = (event: EventWithRelations) => ({
   id: event.id,
   userId: event.userId,
   title: event.title,
   description: event.description,
   date: event.date,
   imageUrl: event.imageUrl,
   capacity: event.capacity,
   address: event.address,
   createdAt: event.createdAt,
   updatedAt: event.updatedAt,
   reservationsCount: event._count?.reservations ?? 0,
   isRegistered: (event.reservations?.length ?? 0) > 0,
   ...(event.user ? { user: userResource(event.user) } : {}),
});

export const eventListResource = (events: EventWithRelations[]) =>
   events.map(eventResource);
