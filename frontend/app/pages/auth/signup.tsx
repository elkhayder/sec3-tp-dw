import { useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '~/stores/auth.store';
import { api } from '~/lib/api';
import { Container } from '~/components/auth/container';
import { Input } from '~/components/auth/input';
import { SubmitButton } from '~/components/auth/submit-button';

export default function SignupPage() {
   const authStore = useAuthStore();

   const schema = z
      .object({
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
      defaultValues: { username: '', password: '', confirmPassword: '' },
   });

   const signup: SubmitHandler<Inputs> = (data) => {
      api.post('/auth/signup', {
         username: data.username,
         password: data.password,
      })
         .then((response) => {
            const data = response.data;
            authStore.setToken(data.token);
            authStore.setUser(data.user);
         })
         .catch((e) => {
            setError('username', {
               type: 'manual',
               message: e.response?.data?.message || 'An error occurred',
            });
         });
   };

   return (
      <Container title="Sign Up">
         <form className="flex flex-col gap-4" onSubmit={handleSubmit(signup)}>
            <Input
               type="text"
               placeholder="Username"
               {...register('username')}
               error={errors.username?.message}
            />
            <Input
               type="password"
               placeholder="Password"
               {...register('password')}
               error={errors.password?.message}
            />
            <Input
               type="password"
               placeholder="Confirm Password"
               {...register('confirmPassword')}
               error={errors.confirmPassword?.message}
            />
            <SubmitButton label="Sign Up" />
         </form>
      </Container>
   );
}
