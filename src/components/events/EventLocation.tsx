import { MapPin } from "lucide-react";

interface EventLocationProps {
  location: string;
  locationLink?: string;
  locationCoordinates?: string;
}

export const EventLocation = ({ location, locationLink, locationCoordinates }: EventLocationProps) => {
  return (
    <>
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          <a
            href={locationLink || `https://maps.google.com/?q=${location}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {location}
          </a>
        </div>
      </div>

      {locationCoordinates && (
        <div className="h-64 bg-gray-100 rounded-lg mb-6">
          <iframe
            title="Ubicación del evento"
            width="100%"
            height="100%"
            frameBorder="0"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBLCQr3lBQUxFzTc4IxSpDyPNpKlFvJQLY&q=${location}`}
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      )}
    </>
  );
};