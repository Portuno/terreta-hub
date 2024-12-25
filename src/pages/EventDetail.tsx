import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { EventInfo } from "../components/events/EventInfo";
import { EventComments } from "../components/events/EventComments";
import { EventRegistration } from "../components/events/EventRegistration";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        const isUserAdmin = data?.role === "ADMIN";
        setIsAdmin(isUserAdmin);
        return data;
      } catch (error) {
        console.error("Error in profile query:", error);
        return null;
      }
    },
  });

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      try {
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

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error in event query:", error);
        throw error;
      }
    },
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
            <EventInfo event={event} isAdmin={isAdmin} />
            <EventComments 
              eventId={event.id} 
              comments={event.event_comments || []} 
            />
          </div>

          <div className="space-y-6">
            <EventRegistration eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;