import { useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '~/stores/auth.store';
import { api } from '~/lib/api';
import { Container } from '~/components/auth/container';

import { Button } from '~/components/ui/button';
import {
   Field,
   FieldDescription,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Link } from 'react-router';

export default function SignupPage() {
   const authStore = useAuthStore();

   const schema = z
      .object({
         name: z.string().min(3, 'Name must be at least 3 characters'),
         username: z.string().min(3, 'Username must be at least 3 characters'),
         password: z.string().min(6, 'Password must be at least 6 characters'),
         confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
         message: 'Passwords do not match',
         path: ['confirmPassword'],
      });

   type Inputs = z.infer<typeof schema>;

   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<Inputs>({
      resolver: zodResolver(schema),
      defaultValues: {
         name: '',
         username: '',
         password: '',
         confirmPassword: '',
      },
   });

   const { mutate: signup } = useMutation({
      mutationFn: (data: Inputs) => api.post('/auth/signup', data),
      onSuccess: (response) => {
         const data = response.data;
         authStore.setToken(data.token);
         authStore.setUser(data.user);
      },
      onError: (e: any) => {
         setError('username', {
            type: 'manual',
            message: e.response?.data?.message || 'An error occurred',
         });
      },
   });

   return (
      <Container
         title="Sign up for an account"
         description="Enter your username below to create a new account"
      >
         <form onSubmit={handleSubmit((data) => signup(data))}>
            <FieldGroup>
               <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" type="text" required {...register('name')} />
                  <FieldError errors={[errors.name]} />
               </Field>
               <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                     id="username"
                     type="text"
                     required
                     {...register('username')}
                  />
                  <FieldError errors={[errors.username]} />
               </Field>
               <div className="flex items-center gap-4">
                  <Field>
                     <FieldLabel htmlFor="password">Password</FieldLabel>
                     <Input
                        id="password"
                        type="password"
                        required
                        {...register('password')}
                     />
                     <FieldError errors={[errors.password]} />
                  </Field>
                  <Field>
                     <FieldLabel htmlFor="confirmPassword">
                        Password confirmation
                     </FieldLabel>
                     <Input
                        id="confirmPassword"
                        type="password"
                        required
                        {...register('confirmPassword')}
                     />
                     <FieldError errors={[errors.confirmPassword]} />
                  </Field>
               </div>
               <Field>
                  <Button type="submit">Sign up</Button>
                  <FieldDescription className="text-center">
                     Already have an account?{' '}
                     <Link to="/auth/login">Login</Link>
                  </FieldDescription>
               </Field>
            </FieldGroup>
         </form>
      </Container>
   );
}
