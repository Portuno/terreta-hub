import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventActions } from "@/components/events/EventActions";

interface EventHeaderProps {
  title: string;
  eventDate: string;
  eventId: string;
  isAdmin: boolean;
}

export const EventHeader = ({ title, eventDate, eventId, isAdmin }: EventHeaderProps) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {isAdmin && (
          <EventActions eventId={eventId} eventTitle={title} isAdmin={isAdmin} />
        )}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Calendar size={16} />
        <span>
          {format(new Date(eventDate), "PPP 'a las' p", {
            locale: es,
          })}
        </span>
      </div>
    </div>
  );
};