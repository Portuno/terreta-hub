import { Calendar, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventActions } from "./EventActions";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    event_date: string;
    is_paid: boolean;
  };
  isAdmin?: boolean;
}

export const EventCard = ({ event, isAdmin = false }: EventCardProps) => {
  const { data: ticketBatches, isLoading } = useQuery({
    queryKey: ["eventTickets", event.id],
    queryFn: async () => {
      console.log("Fetching ticket batches for event:", event.id);
      const { data, error } = await supabase
        .from("event_ticket_batches")
        .select("*")
        .eq("event_id", event.id)
        .eq("is_active", true)
        .order("batch_number", { ascending: true });
      
      if (error) {
        console.error("Error fetching ticket batches:", error);
        throw error;
      }

      console.log("Received ticket batches:", data);
      return data || [];
    },
  });

  const currentBatch = Array.isArray(ticketBatches) && ticketBatches.length > 0
    ? ticketBatches.find(batch => batch.available_tickets > 0)
    : null;

  return (
    <div className="relative">
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10">
          <EventActions eventId={event.id} eventTitle={event.title} isAdmin={isAdmin} />
        </div>
      )}
      <Link
        to={`/eventos/${event.id}`}
        className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
        
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
    </div>
  );
};