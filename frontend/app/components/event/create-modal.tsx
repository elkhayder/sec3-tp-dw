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
import { api } from '~/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const CreateEventModal = ({
   open,
   onOpenChange,
}: {
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
   const [imagePreview, setImagePreview] = useState<string | null>(null);

   const { mutate: createEvent } = useMutation({
      mutationFn: (data: Inputs) => {
         const formData = new FormData();
         formData.append('title', data.title);
         formData.append('description', data.description);
         if (data.address) formData.append('address', data.address);
         formData.append('date', data.date.toISOString());
         formData.append('capacity', String(data.capacity));
         if (imageFile) formData.append('image', imageFile);
         return api.post('/events', formData);
      },
      onSuccess: () => {
         onOpenChange(false);
         queryClient.invalidateQueries({ queryKey: ['events'] });
         reset();
         setImageFile(null);
         setImagePreview(null);
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
      reset,
   } = useForm<Inputs>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: '',
         description: '',
         address: '',
         date: new Date(),
         capacity: 20,
      },
   });

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Create Event</DialogTitle>
               <DialogDescription>
                  Fill in the details to create a new event
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit((data) => createEvent(data))}>
               <FieldGroup>
                  <Field>
                     <FieldLabel htmlFor="title">Title</FieldLabel>
                     <Input
                        id="title"
                        type="text"
                        required
                        {...register('title')}
                     />
                     <FieldError errors={[errors.title]} />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor="description">Description</FieldLabel>
                     <Textarea
                        id="description"
                        required
                        {...register('description')}
                     />
                     <FieldError errors={[errors.description]} />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor="address">Address</FieldLabel>
                     <Input
                        id="address"
                        type="text"
                        {...register('address')}
                     />
                     <FieldError errors={[errors.address]} />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor="image">Event Image</FieldLabel>
                     <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                           const file = e.target.files?.[0] || null;
                           setImageFile(file);
                           if (file) {
                              setImagePreview(URL.createObjectURL(file));
                           } else {
                              setImagePreview(null);
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
                        <FieldLabel htmlFor="date">Date</FieldLabel>
                        <Input
                           id="date"
                           type="datetime-local"
                           required
                           {...register('date', {
                              valueAsDate: true,
                           })}
                        />
                        <FieldError errors={[errors.date]} />
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                        <Input
                           id="capacity"
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
                           Create Event
                        </Button>
                     </div>
                  </Field>
               </FieldGroup>
            </form>
         </DialogContent>
      </Dialog>
   );
};
