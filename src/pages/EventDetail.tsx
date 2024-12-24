import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { EventHeader } from "@/components/events/EventHeader";
import { EventLocation } from "@/components/events/EventLocation";
import { EventAttendance } from "@/components/events/EventAttendance";
import { EventComments } from "@/components/events/EventComments";

const EventDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_attendances (
            status,
            is_public,
            profiles:user_id (
              username,
              avatar_url
            )
          ),
          event_comments (
            id,
            content,
            created_at,
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

  const { data: userAttendance } = useQuery({
    queryKey: ["attendance", id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("event_attendances")
        .select("*")
        .eq("event_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const attendanceMutation = useMutation({
    mutationFn: async ({ status, isPublic }: { status: string; isPublic: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      if (userAttendance) {
        const { error } = await supabase
          .from("event_attendances")
          .update({ status, is_public: isPublic })
          .eq("id", userAttendance.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("event_attendances")
          .insert({
            event_id: id,
            user_id: user.id,
            status,
            is_public: isPublic,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["attendance", id] });
      toast.success("Tu asistencia ha sido actualizada");
    },
    onError: (error) => {
      console.error("Error al actualizar asistencia:", error);
      toast.error("Error al actualizar tu asistencia");
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      return data?.role === "ADMIN";
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

  const attendeesCount = event.event_attendances?.filter(
    (a) => a.status === "attending"
  ).length || 0;

  const maybeCount = event.event_attendances?.filter(
    (a) => a.status === "maybe"
  ).length || 0;

  const notAttendingCount = event.event_attendances?.filter(
    (a) => a.status === "not_attending"
  ).length || 0;

  const confirmedAttendees = event.event_attendances?.filter(
    (a) => a.is_public && a.status === "attending"
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-8 px-4 pt-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <EventHeader
              title={event.title}
              eventDate={event.event_date}
              eventId={event.id}
              isAdmin={isAdmin || false}
            />

            <p className="text-gray-600 mb-6">{event.description}</p>

            <EventLocation
              location={event.location}
              locationLink={event.location_link}
              locationCoordinates={event.location_coordinates?.toString()}
            />

            <EventAttendance
              attendeesCount={attendeesCount}
              maybeCount={maybeCount}
              notAttendingCount={notAttendingCount}
              userAttendance={userAttendance}
              onAttendanceChange={(status, isPublic) =>
                attendanceMutation.mutate({ status, isPublic })
              }
              attendees={confirmedAttendees}
            />
          </div>

          <EventComments
            eventId={event.id}
            comments={event.event_comments || []}
          />
        </div>
      </main>
    </div>
  );
};

export default EventDetail;