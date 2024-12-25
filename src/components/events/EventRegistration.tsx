import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";

interface EventRegistrationProps {
  eventId: string;
}

export const EventRegistration = ({ eventId }: EventRegistrationProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const { data: ticketInfo } = useQuery({
    queryKey: ["eventTickets", eventId],
    queryFn: async () => {
      console.log("Fetching ticket info for event:", eventId);
      const { data: batches, error } = await supabase
        .from("event_ticket_batches")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_active", true)
        .order("batch_number", { ascending: true });

      if (error) {
        console.error("Error fetching ticket batches:", error);
        throw error;
      }

      const { data: attendances, error: attendanceError } = await supabase
        .from("event_attendances")
        .select("status")
        .eq("event_id", eventId);

      if (attendanceError) {
        console.error("Error fetching attendances:", attendanceError);
        throw attendanceError;
      }

      const confirmedAttendees = attendances?.filter(a => a.status === 'confirmed').length || 0;

      const currentBatch = batches?.[0];
      return {
        availableTickets: currentBatch?.available_tickets || 0,
        totalTickets: currentBatch?.total_tickets || 0,
        confirmedAttendees,
      };
    },
  });

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para registrarte",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("event_attendances")
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: "confirmed",
        });

      if (error) throw error;

      toast({
        title: "¡Registro exitoso!",
        description: "Te has registrado al evento correctamente.",
      });
    } catch (error) {
      console.error("Error al registrarse:", error);
      toast({
        title: "Error",
        description: "No se pudo completar el registro. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Registro al Evento</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{ticketInfo?.confirmedAttendees || 0} asistentes confirmados</span>
        </div>

        {ticketInfo?.availableTickets !== undefined && (
          <div className="text-sm text-gray-600">
            {ticketInfo.availableTickets} plazas disponibles de {ticketInfo.totalTickets}
          </div>
        )}

        <Button
          onClick={handleRegister}
          disabled={isRegistering || (ticketInfo?.availableTickets === 0)}
          className="w-full"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : ticketInfo?.availableTickets === 0 ? (
            "No hay plazas disponibles"
          ) : (
            "Registrarme al evento"
          )}
        </Button>
      </div>
    </div>
  );
};