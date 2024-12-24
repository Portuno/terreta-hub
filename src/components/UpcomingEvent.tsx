import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const UpcomingEvent = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["upcomingEvent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(1);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: ticketBatches } = useQuery({
    queryKey: ["upcomingEventTickets", events?.[0]?.id],
    queryFn: async () => {
      if (!events?.[0]?.id) return null;
      const { data, error } = await supabase
        .from("event_ticket_batches")
        .select("*")
        .eq("event_id", events[0].id)
        .eq("is_active", true)
        .order("batch_number", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!events?.[0]?.id,
  });

  if (isLoading) {
    return <div className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm text-center">
        <p className="text-gray-500">No hay eventos próximos</p>
      </div>
    );
  }

  const event = events[0];
  const currentBatch = ticketBatches?.find(batch => batch.available_tickets > 0);

  return (
    <Link
      to={`/eventos/${event.id}`}
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
      <p className="mt-2 text-gray-600">{event.description}</p>

      {/* Precio y tickets */}
      <div className="mt-4 flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-sm ${
          event.is_paid 
            ? "bg-blue-100 text-blue-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {event.is_paid 
            ? currentBatch 
              ? `${currentBatch.price}€ (Lote ${currentBatch.batch_number})` 
              : "Agotado"
            : "Gratuito"}
        </span>
        
        {currentBatch && (
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Ticket size={16} />
            {currentBatch.available_tickets} disponibles
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>
            {format(new Date(event.event_date), "PPP 'a las' p", { locale: es })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
      </div>
    </Link>
  );
};