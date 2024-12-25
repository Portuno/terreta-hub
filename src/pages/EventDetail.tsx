import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { EventHeader } from "../components/events/EventHeader";
import { EventLocation } from "../components/events/EventLocation";
import { EventComments } from "../components/events/EventComments";
import { EventAttendance } from "../components/events/EventAttendance";
import { PaymentMethodSelector } from "../components/events/PaymentMethodSelector";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario es administrador
  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      const isUserAdmin = data?.role === "ADMIN";
      setIsAdmin(isUserAdmin);
      return data;
    },
  });

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      console.log("Fetching event with ID:", id);
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_comments (
            id,
            content,
            created_at,
            profiles (
              username,
              avatar_url
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
      
      console.log("Event data received:", data);
      return data;
    },
  });

  const { data: ticketBatches } = useQuery({
    queryKey: ["ticketBatches", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_ticket_batches")
        .select("*")
        .eq("event_id", id)
        .order('batch_number', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800">Evento no encontrado</h1>
            <p className="text-gray-600 mt-2">
              El evento que buscas no existe o ha sido eliminado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <div className="space-y-6">
            <EventHeader
              title={event.title}
              eventDate={event.event_date}
              eventId={event.id}
              isAdmin={isAdmin}
            />

            <div className="prose max-w-none">
              <p>{event.description}</p>
            </div>

            <EventLocation
              location={event.location}
              locationLink={event.location_link}
            />

            <EventComments 
              eventId={event.id} 
              comments={event.event_comments || []} 
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Tickets</h3>
              {ticketBatches?.map((batch) => (
                <div
                  key={batch.id}
                  className="p-4 border rounded-lg mb-4 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      Lote {batch.batch_number}
                    </span>
                    <span className="text-lg font-semibold">
                      {batch.price}€
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {batch.available_tickets} tickets disponibles
                  </div>
                  {batch.available_tickets > 0 && (
                    <PaymentMethodSelector
                      eventId={event.id}
                      batchId={batch.id}
                      price={batch.price}
                    />
                  )}
                </div>
              ))}
            </div>

            <EventAttendance eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;