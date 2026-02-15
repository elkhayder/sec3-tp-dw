import { useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { api, type Event } from '~/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const EditEventModal = ({
   event,
   open,
   onOpenChange,
}: {
   event: Event;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}) => {
   const schema = z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      description: z
         .string()
         .min(10, 'Description must be at least 10 characters'),
      address: z.string().optional(),
      date: z.date(),
      capacity: z.number().min(1, 'Capacity must be at least 1'),
   });

   type Inputs = z.infer<typeof schema>;

   const queryClient = useQueryClient();
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [imagePreview, setImagePreview] = useState<string | null>(
      event.imageUrl || null,
   );

   const { mutate: updateEvent } = useMutation({
      mutationFn: (data: Inputs) => {
         const formData = new FormData();
         formData.append('title', data.title);
         formData.append('description', data.description);
         if (data.address) formData.append('address', data.address);
         formData.append('date', data.date.toISOString());
         formData.append('capacity', String(data.capacity));
         if (imageFile) formData.append('image', imageFile);
         return api.put(`/events/${event.id}`, formData);
      },
      onSuccess: () => {
         onOpenChange(false);
         queryClient.invalidateQueries({ queryKey: ['events'] });
         queryClient.invalidateQueries({ queryKey: ['event', String(event.id)] });
      },
      onError: (e: any) => {
         const errors = e.response?.data?.errors as Record<string, string>;
         if (errors) {
            Object.entries(errors).forEach(([field, message]) => {
               setError(field as keyof Inputs, { type: 'server', message });
            });
         }
      },
   });

   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<Inputs>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: event.title,
         description: event.description,
         address: event.address || '',
         date: new Date(event.date),
         capacity: event.capacity,
      },
   });

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Edit Event</DialogTitle>
               <DialogDescription>
                  Update the event details
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit((data) => updateEvent(data))}>
               <FieldGroup>
                  <Field>
                     <FieldLabel htmlFor="edit-title">Title</FieldLabel>
                     <Input
                        id="edit-title"
                        type="text"
                        required
                        {...register('title')}
                     />
                     <FieldError errors={[errors.title]} />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor="edit-description">
                        Description
                     </FieldLabel>
                     <Textarea
                        id="edit-description"
                        required
                        {...register('description')}
                     />
                     <FieldError errors={[errors.description]} />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor="edit-address">Address</FieldLabel>
                     <Input
                        id="edit-address"
                        type="text"
                        {...register('address')}
                     />
                     <FieldError errors={[errors.address]} />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor="edit-image">Event Image</FieldLabel>
                     <Input
                        id="edit-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                           const file = e.target.files?.[0] || null;
                           setImageFile(file);
                           if (file) {
                              setImagePreview(URL.createObjectURL(file));
                           }
                        }}
                     />
                     {imagePreview && (
                        <img
                           src={imagePreview}
                           alt="Preview"
                           className="mt-2 max-h-48 object-cover rounded"
                        />
                     )}
                  </Field>
                  <div className="flex items-center justify-between gap-4">
                     <Field>
                        <FieldLabel htmlFor="edit-date">Date</FieldLabel>
                        <Input
                           id="edit-date"
                           type="datetime-local"
                           required
                           {...register('date', {
                              valueAsDate: true,
                           })}
                        />
                        <FieldError errors={[errors.date]} />
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="edit-capacity">Capacity</FieldLabel>
                        <Input
                           id="edit-capacity"
                           type="number"
                           required
                           {...register('capacity', {
                              valueAsNumber: true,
                           })}
                        />
                        <FieldError errors={[errors.capacity]} />
                     </Field>
                  </div>
                  <Field>
                     <div className="flex items-center justify-between gap-4">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => onOpenChange(false)}
                           className="flex-1 w-full"
                        >
                           Cancel
                        </Button>
                        <Button type="submit" className="flex-1 w-full">
                           Save Changes
                        </Button>
                     </div>
                  </Field>
               </FieldGroup>
            </form>
         </DialogContent>
      </Dialog>
   );
};
