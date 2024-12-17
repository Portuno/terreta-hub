import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    event_date: string;
  };
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link
      to={`/eventos/${event.id}`}
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
      <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
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