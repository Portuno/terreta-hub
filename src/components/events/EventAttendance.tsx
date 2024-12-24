import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EventAttendanceProps {
  eventId: string;
}

export const EventAttendance = ({ eventId }: EventAttendanceProps) => {
  const [attendance, setAttendance] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["eventAttendance", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_attendances")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data) => {
        if (data) setAttendance(data);
      }
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Asistencia</h3>
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <ul className="space-y-2">
          {attendance.map((attendee) => (
            <li key={attendee.id} className="flex justify-between">
              <span>{attendee.user_id}</span>
              <span>{attendee.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};