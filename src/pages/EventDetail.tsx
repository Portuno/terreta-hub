import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Calendar, MapPin, Users, Check, HelpCircle, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/components/products/CommentForm";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { error } = await supabase
        .from("event_comments")
        .insert({
          event_id: id,
          user_id: user.id,
          content,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      toast.success("Comentario añadido");
    },
    onError: (error) => {
      console.error("Error al añadir comentario:", error);
      toast.error("Error al añadir el comentario");
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-8 px-4 pt-16">
        <div className="max-w-3xl mx-auto space-y-6">
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
            </div>

            {event.location_coordinates && (
              <div className="h-64 bg-gray-100 rounded-lg mb-6">
                <iframe
                  title="Ubicación del evento"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBLCQr3lBQUxFzTc4IxSpDyPNpKlFvJQLY&q=${event.location}`}
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Asistencia</h2>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      <span>{attendeesCount} asistirán</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle size={16} className="text-yellow-500" />
                      <span>{maybeCount} tal vez</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X size={16} className="text-red-500" />
                      <span>{notAttendingCount} no asistirán</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Select
                    value={userAttendance?.status || ""}
                    onValueChange={(value) =>
                      attendanceMutation.mutate({
                        status: value,
                        isPublic: userAttendance?.is_public ?? true,
                      })
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="¿Asistirás?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attending">Asistiré</SelectItem>
                      <SelectItem value="maybe">Tal vez</SelectItem>
                      <SelectItem value="not_attending">No asistiré</SelectItem>
                    </SelectContent>
                  </Select>

                  {userAttendance && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="public-attendance"
                        checked={userAttendance.is_public}
                        onCheckedChange={(checked) =>
                          attendanceMutation.mutate({
                            status: userAttendance.status,
                            isPublic: checked,
                          })
                        }
                      />
                      <Label htmlFor="public-attendance">Mostrar mi asistencia públicamente</Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Asistentes confirmados</h3>
                <div className="grid grid-cols-2 gap-4">
                  {event.event_attendances
                    ?.filter((a) => a.is_public && a.status === "attending")
                    .map((attendance) => (
                      <div
                        key={attendance.profiles.username}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
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

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Comentarios</h2>
            <div className="space-y-6">
              <CommentForm
                onSubmit={(content) => commentMutation.mutate(content)}
                placeholder="Escribe un comentario sobre el evento..."
              />

              <div className="space-y-4">
                {event.event_comments
                  ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={comment.profiles.avatar_url || "/placeholder.svg"}
                          alt={comment.profiles.username}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{comment.profiles.username}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.created_at), "d 'de' MMMM 'a las' p", {
                            locale: es,
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
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
