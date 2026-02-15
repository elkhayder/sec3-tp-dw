import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Header } from '~/components/header';

export default function IndexPage() {
   return (
      <div className="min-h-screen flex flex-col">
         <Header />

         <main className="flex-1">
            <section className="container mx-auto px-4 py-16 md:py-24">
               <div className="max-w-3xl mx-auto text-center space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold text-balance">
                     Discover and Create Amazing Events
                  </h1>
                  <p className="text-xl text-muted-foreground text-pretty">
                     Join EventHub to create, manage, and discover events that
                     matter to you. Connect with others and make memorable
                     experiences.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-4">
                     <Link to="/auth/signup">
                        <Button size="lg">Get Started</Button>
                     </Link>
                     <Link to="/auth/login">
                        <Button size="lg" variant="outline">
                           Login
                        </Button>
                     </Link>
                  </div>
               </div>
            </section>

            <section className="bg-muted/50 py-16">
               <div className="container mx-auto px-4">
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                     <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                           <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Create Events</h3>
                        <p className="text-muted-foreground text-pretty">
                           Easily create and manage your own events with our
                           intuitive interface
                        </p>
                     </div>
                     <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                           <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Reserve Spots</h3>
                        <p className="text-muted-foreground text-pretty">
                           Reserve your place at events and manage your
                           reservations effortlessly
                        </p>
                     </div>
                     <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                           <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Discover</h3>
                        <p className="text-muted-foreground text-pretty">
                           Browse and filter events to find exactly what you're
                           looking for
                        </p>
                     </div>
                  </div>
               </div>
            </section>
         </main>
      </div>
   );
}
