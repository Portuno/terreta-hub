import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetail = () => {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          ),
          attendances:event_attendances (
            status,
            is_public,
            profiles:user_id (
              username,
              avatar_url
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-8 px-4 pt-16">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/3 mb-8" />
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-20 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-8 px-4 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Evento no encontrado</h1>
          </div>
        </main>
      </div>
    );
  }

  const attendeesCount = event.attendances?.filter(
    (a) => a.status === "attending"
  ).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-8 px-4 pt-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Calendar size={16} />
              <span>
                {format(new Date(event.event_date), "PPP 'a las' p", {
                  locale: es,
                })}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{event.description}</p>

            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                <a
                  href={event.location_link || `https://maps.google.com/?q=${event.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {event.location}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} />
                <span>{attendeesCount} asistentes</span>
              </div>
            </div>

            {event.location_coordinates && (
              <div className="h-64 bg-gray-100 rounded-lg mb-6">
                {/* Aquí irá el mapa */}
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Asistentes</h2>
              <div className="space-y-4">
                {event.attendances
                  ?.filter((a) => a.is_public && a.status === "attending")
                  .map((attendance) => (
                    <div
                      key={attendance.profiles.username}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={
                          attendance.profiles.avatar_url ||
                          "/placeholder.svg"
                        }
                        alt={attendance.profiles.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-600">
                        {attendance.profiles.username}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;