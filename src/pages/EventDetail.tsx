import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { EventHeader } from "../components/events/EventHeader";
import { EventLocation } from "../components/events/EventLocation";
import { EventComments } from "../components/events/EventComments";
import { EventAttendance } from "../components/events/EventAttendance";
import { PaymentMethodSelector } from "../components/events/PaymentMethodSelector";
import { supabase } from "@/integrations/supabase/client";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketBatches, setTicketBatches] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    onSettled: (data) => {
      if (data) setEvent(data);
    },
  });

  useQuery({
    queryKey: ["ticketBatches", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_ticket_batches")
        .select("*")
        .eq("event_id", id);

      if (error) throw error;
      return data;
    },
    onSettled: (data) => {
      if (data) setTicketBatches(data);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : event ? (
            <div className="space-y-6">
              <EventHeader
                title={event.title}
                eventDate={event.event_date}
                eventId={event.id}
                isAdmin={isAdmin}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="prose max-w-none">
                    <p>{event.description}</p>
                  </div>

                  <EventLocation
                    location={event.location}
                    locationLink={event.location_link}
                  />

                  <EventComments eventId={event.id} />
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Tickets</h3>
                    {ticketBatches?.map((batch) => (
                      <div
                        key={batch.id}
                        className="p-4 border rounded-lg mb-4 last:mb-0"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            Lote {batch.batch_number}
                          </span>
                          <span className="text-lg font-semibold">
                            {batch.price}€
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          {batch.available_tickets} tickets disponibles
                        </div>
                        {batch.available_tickets > 0 && (
                          <PaymentMethodSelector
                            eventId={event.id}
                            batchId={batch.id}
                            price={batch.price}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <EventAttendance eventId={event.id} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Evento no encontrado
              </h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventDetail;