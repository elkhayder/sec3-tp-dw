'use client';

import { useState, useEffect } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '~/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { useAuthStore } from '~/stores/auth.store';
import { CreateEventModal } from '~/components/event/create-modal';
import { useQuery } from '@tanstack/react-query';
import { api, type Event } from '~/lib/api';
import { EventCard } from '~/components/event/preview-card';

type SortBy = 'date' | 'capacity';

export default function EventsPage() {
   const { user } = useAuthStore();
   const [searchQuery, setSearchQuery] = useState<string>('');
   const [debouncedSearch, setDebouncedSearch] = useState<string>('');
   const [sortBy, setSortBy] = useState<SortBy>('date');
   const [createModalOpen, setCreateModalOpen] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
      return () => clearTimeout(timer);
   }, [searchQuery]);

   const { data: events } = useQuery({
      queryKey: ['events', debouncedSearch, sortBy],
      queryFn: async () =>
         await api.get<{ events: Event[] }>('/events', {
            params: {
               search: debouncedSearch || undefined,
               sortBy,
               sortOrder: sortBy === 'date' ? 'ASC' : 'DESC',
            },
         }),
      select: (data) => data.data.events,
   });

   return (
      <>
         <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-3xl font-bold">Events</h1>
                  <p className="text-muted-foreground mt-1">
                     Discover and manage events
                  </p>
               </div>
               <Button onClick={() => setCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
               </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                     placeholder="Search events..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10"
                  />
               </div>
               <Select value={sortBy} onValueChange={setSortBy as any}>
                  <SelectTrigger className="w-full md:w-48">
                     <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="date">Sort by Date</SelectItem>
                     <SelectItem value="capacity">
                        Sort by Availability
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {events?.length === 0 ? (
               <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                     No events found
                  </p>
                  <Button
                     onClick={() => setCreateModalOpen(true)}
                     className="mt-4"
                  >
                     Create your first event
                  </Button>
               </div>
            ) : (
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events?.map((event) => (
                     <EventCard key={event.id} event={event} />
                  ))}
               </div>
            )}
         </div>
         <CreateEventModal
            onOpenChange={setCreateModalOpen}
            open={createModalOpen}
         />
      </>
   );
}
