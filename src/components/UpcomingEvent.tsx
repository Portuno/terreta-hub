import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
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

  return (
    <Link
      to={`/eventos/${event.id}`}
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
      <p className="mt-2 text-gray-600">{event.description}</p>
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