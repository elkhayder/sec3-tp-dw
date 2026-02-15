import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import type { Event } from '~/lib/api';
import { Link } from 'react-router';

interface EventCardProps {
   event: Event;
}

export function EventCard({ event }: EventCardProps) {
   const spotsLeft = event.capacity - event.reservationsCount;
   const isFull = spotsLeft === 0;

   const getDateString = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };

   const getTimeString = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(undefined, {
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   return (
      <Link to={`/events/${event.id}`}>
         <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full pt-0">
            <div className="aspect-video w-full overflow-hidden bg-muted">
               <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
               />
            </div>
            <CardContent>
               <h3 className="font-semibold text-lg mb-2 text-balance">
                  {event.title}
               </h3>
               <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4" />
                     <span>
                        {getDateString(event.date)} at{' '}
                        {getTimeString(event.date)}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <MapPin className="w-4 h-4" />
                     <span>{event.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Users className="w-4 h-4" />
                     <span>{spotsLeft} spots left</span>
                  </div>
               </div>
            </CardContent>
            <CardFooter>
               {isFull ? (
                  <Badge variant="secondary" className="w-full justify-center">
                     Fully Booked
                  </Badge>
               ) : (
                  <Badge variant="outline" className="w-full justify-center">
                     {spotsLeft} / {event.capacity} available
                  </Badge>
               )}
            </CardFooter>
         </Card>
      </Link>
   );
}
