import { useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore, type User } from '~/stores/auth.store';
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
import { useMutation } from '@tanstack/react-query';

export default function LoginPage({
   className,
   ...props
}: React.ComponentProps<'div'>) {
   const authStore = useAuthStore();

   const schema = z.object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
   });

   type Inputs = z.infer<typeof schema>;

   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<Inputs>({
      resolver: zodResolver(schema),
      defaultValues: { username: '', password: '' },
   });

   const { mutate: login } = useMutation({
      mutationFn: (data: Inputs) =>
         api.post<{
            token: string;
            user: User;
         }>('/auth/login', data),
      onSuccess: (response) => {
         const data = response.data;
         authStore.setToken(data.token);
         authStore.setUser(data.user);
      },
      onError: (e: any) => {
         setError('username', {
            type: 'manual',
            message: e.response?.data?.message || 'Invalid credentials',
         });
      },
   });

   return (
      <Container
         title="Login to your account"
         description="Enter your username below to login to your account"
      >
         <form onSubmit={handleSubmit((data) => login(data))}>
            <FieldGroup>
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
               <Field>
                  <div className="flex items-center">
                     <FieldLabel htmlFor="password">Password</FieldLabel>
                     <a
                        href="#"
                        className="ml-auto inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
                     >
                        Forgot your password?
                     </a>
                  </div>
                  <Input
                     id="password"
                     type="password"
                     required
                     {...register('password')}
                  />
                  <FieldError errors={[errors.password]} />
               </Field>
               <Field>
                  <Button type="submit">Login</Button>
                  <FieldDescription className="text-center">
                     Don't have an account?{' '}
                     <Link to="/auth/signup">Sign up</Link>
                  </FieldDescription>
               </Field>
            </FieldGroup>
         </form>
      </Container>
   );
}
