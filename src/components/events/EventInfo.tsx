import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventHeader } from "./EventHeader";
import { EventLocation } from "./EventLocation";

interface EventInfoProps {
  event: {
    id: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    location_link?: string | null;
  };
  isAdmin: boolean;
}

export const EventInfo = ({ event, isAdmin }: EventInfoProps) => {
  return (
    <div className="space-y-6">
      <EventHeader
        title={event.title}
        eventDate={event.event_date}
        eventId={event.id}
        isAdmin={isAdmin}
      />

      <div className="prose max-w-none">
        <p>{event.description}</p>
      </div>

      <EventLocation
        location={event.location}
        locationLink={event.location_link}
      />
    </div>
  );
};