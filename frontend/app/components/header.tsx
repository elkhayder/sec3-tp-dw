'use client';

import { Button } from '~/components/ui/button';
import { Calendar, LogOut, User } from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useAuthStore } from '~/stores/auth.store';
import { Link } from 'react-router';

export function Header() {
   const { user, setToken, setUser } = useAuthStore();

   const logout = () => {
      setToken(null);
      setUser(null);
   };

   return (
      <header className="border-b bg-background">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
               to="/"
               className="flex items-center gap-2 font-semibold text-xl"
            >
               <Calendar className="w-6 h-6" />
               <span>EventHub</span>
            </Link>

            <nav className="flex items-center gap-4">
               {user ? (
                  <>
                     <Link to="/events">
                        <Button variant="ghost">Events</Button>
                     </Link>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="outline" size="icon">
                              <User className="w-4 h-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={logout}>
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </>
               ) : (
                  <>
                     <Link to="/auth/login">
                        <Button variant="ghost">Login</Button>
                     </Link>
                     <Link to="/auth/signup">
                        <Button>Sign Up</Button>
                     </Link>
                  </>
               )}
            </nav>
         </div>
      </header>
   );
}
