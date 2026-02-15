import { Navigate, Outlet } from 'react-router';
import { Header } from '~/components/header';
import { useAuthStore } from '~/stores/auth.store';

export default function Layout() {
   const { token } = useAuthStore();

   if (!token) return <Navigate to="/auth/login" replace />;

   return (
      <div className="min-h-screen flex flex-col">
         <Header />
         <main className="flex-1">
            <Outlet />
         </main>
      </div>
   );
}
