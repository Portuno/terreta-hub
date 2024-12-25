import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewEventForm } from "../components/events/NewEventForm";
import { EventCard } from "../components/events/EventCard";

const Events = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario es administrador
  useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const isUserAdmin = data?.role === "ADMIN";
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    },
  });

  // Obtener eventos futuros
  const { data: upcomingEvents, isLoading: loadingUpcoming } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Obtener eventos pasados
  const { data: pastEvents, isLoading: loadingPast } = useQuery({
    queryKey: ["pastEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .lt("event_date", new Date().toISOString())
        .order("event_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Eventos</h1>
              {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={16} />
                      Crear Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Evento</DialogTitle>
                    </DialogHeader>
                    <NewEventForm onSuccess={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
                <TabsTrigger value="past">Eventos Pasados</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {loadingUpcoming ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : upcomingEvents?.length ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} isAdmin={isAdmin} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay eventos próximos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Los próximos eventos aparecerán aquí.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {loadingPast ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : pastEvents?.length ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} isAdmin={isAdmin} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay eventos pasados</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Los eventos pasados aparecerán aquí.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;