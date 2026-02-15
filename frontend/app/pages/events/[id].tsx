import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Event } from '~/lib/api';
import { useAuthStore } from '~/stores/auth.store';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
   Calendar,
   MapPin,
   Users,
   Trash2,
   Edit,
   ArrowLeft,
} from 'lucide-react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '~/components/ui/dialog';
import { EditEventModal } from '~/components/event/edit-modal';
import { toast } from 'sonner';

export default function EventPage() {
   const { id } = useParams();
   const { user } = useAuthStore();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const [editOpen, setEditOpen] = useState(false);
   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

   const {
      data: event,
      isLoading,
      error,
   } = useQuery({
      queryKey: ['event', id],
      queryFn: () => api.get<{ event: Event }>(`/events/${id}`),
      select: (res) => res.data.event,
   });

   const { mutate: toggleRegistration, isPending: isToggling } = useMutation({
      mutationFn: () =>
         event?.isRegistered
            ? api.delete(`/events/${id}/register`)
            : api.post(`/events/${id}/register`),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['event', id] });
         queryClient.invalidateQueries({ queryKey: ['events'] });
         toast.success(
            event?.isRegistered
               ? 'Unregistered from event'
               : 'Registered for event',
         );
      },
      onError: (e: any) => {
         toast.error(e.response?.data?.message || 'Something went wrong');
      },
   });

   const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
      mutationFn: () => api.delete(`/events/${id}`),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['events'] });
         toast.success('Event deleted');
         navigate('/events');
      },
      onError: () => {
         toast.error('Failed to delete event');
      },
   });

   if (isLoading) {
      return (
         <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-muted-foreground">Loading event...</p>
         </div>
      );
   }

   if (error || !event) {
      return (
         <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-muted-foreground">Event not found</p>
            <Button
               variant="outline"
               className="mt-4"
               onClick={() => navigate('/events')}
            >
               Back to Events
            </Button>
         </div>
      );
   }

   const spotsLeft = event.capacity - event.reservationsCount;
   const isFull = spotsLeft <= 0;
   const isOwner = user?.id === event.userId;

   const getDateString = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
         weekday: 'long',
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
      <>
         <div className="container mx-auto px-4 py-8">
            <Button
               variant="ghost"
               className="mb-6"
               onClick={() => navigate('/events')}
            >
               <ArrowLeft className="w-4 h-4 mr-2" />
               Back to Events
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
               {/* Main Content */}
               <div className="lg:col-span-2 space-y-6">
                  {event.imageUrl && (
                     <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <img
                           src={event.imageUrl}
                           alt={event.title}
                           className="w-full h-full object-cover"
                        />
                     </div>
                  )}

                  <div>
                     <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                     {event.user && (
                        <p className="text-sm text-muted-foreground">
                           Hosted by {event.user.name}
                        </p>
                     )}
                  </div>

                  <div className="prose max-w-none">
                     <p className="text-muted-foreground whitespace-pre-wrap">
                        {event.description}
                     </p>
                  </div>
               </div>

               {/* Sidebar */}
               <div className="space-y-6">
                  <div className="rounded-lg border p-6 space-y-4">
                     <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                           <p className="font-medium">
                              {getDateString(event.date)}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              {getTimeString(event.date)}
                           </p>
                        </div>
                     </div>

                     {event.address && (
                        <div className="flex items-center gap-3">
                           <MapPin className="w-5 h-5 text-muted-foreground" />
                           <p className="font-medium">{event.address}</p>
                        </div>
                     )}

                     <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div>
                           <p className="font-medium">
                              {event.reservationsCount} / {event.capacity}{' '}
                              registered
                           </p>
                           {isFull ? (
                              <Badge variant="secondary">Fully Booked</Badge>
                           ) : (
                              <Badge variant="outline">
                                 {spotsLeft} spots left
                              </Badge>
                           )}
                        </div>
                     </div>

                     {/* Registration Button */}
                     {!isOwner && (
                        <Button
                           className="w-full"
                           variant={event.isRegistered ? 'outline' : 'default'}
                           disabled={
                              (isFull && !event.isRegistered) || isToggling
                           }
                           onClick={() => toggleRegistration()}
                        >
                           {event.isRegistered
                              ? 'Unregister'
                              : isFull
                                ? 'Fully Booked'
                                : 'Register'}
                        </Button>
                     )}

                     {event.isRegistered && (
                        <Badge className="w-full justify-center">
                           You are registered
                        </Badge>
                     )}
                  </div>

                  {/* Owner Controls */}
                  {isOwner && (
                     <div className="rounded-lg border p-6 space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">
                           Manage your event
                        </p>
                        <Button
                           variant="outline"
                           className="w-full"
                           onClick={() => setEditOpen(true)}
                        >
                           <Edit className="w-4 h-4 mr-2" />
                           Edit Event
                        </Button>
                        <Button
                           variant="destructive"
                           className="w-full"
                           onClick={() => setDeleteConfirmOpen(true)}
                        >
                           <Trash2 className="w-4 h-4 mr-2" />
                           Delete Event
                        </Button>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Edit Modal */}
         {isOwner && editOpen && (
            <EditEventModal
               event={event}
               open={editOpen}
               onOpenChange={setEditOpen}
            />
         )}

         {/* Delete Confirmation Dialog */}
         <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Delete Event</DialogTitle>
                  <DialogDescription>
                     Are you sure you want to delete "{event.title}"? This
                     action cannot be undone.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setDeleteConfirmOpen(false)}
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="destructive"
                     onClick={() => deleteEvent()}
                     disabled={isDeleting}
                  >
                     {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}
