import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Users } from "lucide-react";

interface EventAttendanceProps {
  eventId: string;
}

interface Attendee {
  id: string;
  status: "confirmed" | "maybe" | "declined";
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
    display_name: string | null;
  };
}

export const EventAttendance = ({ eventId }: EventAttendanceProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      return data;
    },
  });

  const { data: attendance, isLoading, refetch } = useQuery({
    queryKey: ["eventAttendance", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_attendances")
        .select(`
          *,
          profiles:profiles (
            username,
            avatar_url,
            display_name
          )
        `)
        .eq("event_id", eventId);

      if (error) throw error;
      return data as Attendee[];
    },
  });

  const { data: userAttendance } = useQuery({
    queryKey: ["userAttendance", eventId, currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;
      
      const { data, error } = await supabase
        .from("event_attendances")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  const handleAttendanceChange = async (status: "confirmed" | "maybe" | "declined") => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para marcar tu asistencia",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      if (userAttendance) {
        // Update existing attendance
        await supabase
          .from("event_attendances")
          .update({ status })
          .eq("id", userAttendance.id);
      } else {
        // Create new attendance
        await supabase
          .from("event_attendances")
          .insert({
            event_id: eventId,
            user_id: currentUser.id,
            status,
          });
      }

      await refetch();
      toast({
        title: "¡Actualizado!",
        description: "Tu asistencia ha sido actualizada.",
      });
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar tu asistencia. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderAttendanceList = (status: "confirmed" | "maybe" | "declined") => {
    const filteredAttendees = attendance?.filter(a => a.status === status) || [];
    if (filteredAttendees.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-500">
          {status === "confirmed" && "Asistirán"}
          {status === "maybe" && "Tal vez asistan"}
          {status === "declined" && "No asistirán"}
          {" "}({filteredAttendees.length})
        </h4>
        <div className="space-y-2">
          {filteredAttendees.map((attendee) => (
            <Link
              key={attendee.id}
              to={`/perfil/${attendee.profiles.username}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={attendee.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {attendee.profiles.display_name?.[0] || attendee.profiles.username[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {attendee.profiles.display_name || attendee.profiles.username}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Asistencia</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span>
            {attendance?.filter(a => a.status === "confirmed").length || 0} confirmados
          </span>
        </div>
      </div>

      {/* Attendance Selection */}
      <div className="mb-6">
        <Select
          value={userAttendance?.status || ""}
          onValueChange={(value: "confirmed" | "maybe" | "declined") => 
            handleAttendanceChange(value)
          }
          disabled={isUpdating}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="¿Asistirás al evento?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">Asistiré</SelectItem>
            <SelectItem value="maybe">Tal vez asista</SelectItem>
            <SelectItem value="declined">No asistiré</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Lists */}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {renderAttendanceList("confirmed")}
          {renderAttendanceList("maybe")}
          {renderAttendanceList("declined")}
        </div>
      )}
    </div>
  );
};