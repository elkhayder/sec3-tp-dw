import { useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '~/stores/auth.store';
import { api } from '~/lib/api';
import { Container } from '~/components/auth/container';
import { Input } from '~/components/auth/input';
import { SubmitButton } from '~/components/auth/submit-button';

export default function LoginPage() {
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

   const login: SubmitHandler<Inputs> = (data) => {
      api.post('/auth/login', data)
         .then((response) => {
            const data = response.data;
            authStore.setToken(data.token);
            authStore.setUser(data.user);
         })
         .catch((e) => {
            setError('username', {
               type: 'manual',
               message: e.response?.data?.message || 'Invalid credentials',
            });
         });
   };

   return (
      <Container title="Login">
         <form className="flex flex-col gap-4" onSubmit={handleSubmit(login)}>
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
            <SubmitButton label="Login" />
         </form>
      </Container>
   );
}
