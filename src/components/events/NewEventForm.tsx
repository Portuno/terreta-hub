import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";

interface NewEventFormProps {
  onSuccess: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
  is_paid: boolean;
  ticket_batches?: {
    price: number;
    total_tickets: number;
  }[];
}

export const NewEventForm = ({ onSuccess }: NewEventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [ticketBatches, setTicketBatches] = useState([{ price: 0, total_tickets: 0 }]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>();

  const addTicketBatch = () => {
    setTicketBatches([...ticketBatches, { price: 0, total_tickets: 0 }]);
  };

  const removeTicketBatch = (index: number) => {
    setTicketBatches(ticketBatches.filter((_, i) => i !== index));
  };

  const updateBatchField = (index: number, field: 'price' | 'total_tickets', value: number) => {
    const newBatches = [...ticketBatches];
    newBatches[index] = { ...newBatches[index], [field]: value };
    setTicketBatches(newBatches);
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      // Crear el evento
      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          ...data,
          user_id: user.id,
          is_paid: isPaid,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Si es un evento de pago, crear los lotes de tickets
      if (isPaid && event) {
        const batchesData = ticketBatches.map((batch, index) => ({
          event_id: event.id,
          price: batch.price,
          total_tickets: batch.total_tickets,
          available_tickets: batch.total_tickets,
          batch_number: index + 1,
        }));

        const { error: batchError } = await supabase
          .from("event_ticket_batches")
          .insert(batchesData);

        if (batchError) throw batchError;
      }

      toast({
        title: "¡Éxito!",
        description: "El evento ha sido creado correctamente.",
      });

      queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
      queryClient.invalidateQueries({ queryKey: ["pastEvents"] });
      onSuccess();
    } catch (error) {
      console.error("Error al crear evento:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el evento. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register("title", { required: "El título es requerido" })}
          placeholder="Título del evento"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          {...register("description", { required: "La descripción es requerida" })}
          placeholder="Descripción del evento"
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("location", { required: "La ubicación es requerida" })}
          placeholder="Ubicación"
        />
        {errors.location && (
          <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <Input
          type="datetime-local"
          {...register("event_date", { required: "La fecha es requerida" })}
        />
        {errors.event_date && (
          <p className="text-sm text-red-500 mt-1">{errors.event_date.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is-paid"
          checked={isPaid}
          onCheckedChange={setIsPaid}
        />
        <Label htmlFor="is-paid">Evento de pago</Label>
      </div>

      {isPaid && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Lotes de tickets</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTicketBatch}
              className="flex items-center gap-2"
            >
              <PlusCircle size={16} />
              Añadir lote
            </Button>
          </div>

          {ticketBatches.map((batch, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Lote #{index + 1}</h4>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTicketBatch(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`price-${index}`}>Precio (€)</Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={batch.price}
                    onChange={(e) => updateBatchField(index, 'price', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`tickets-${index}`}>Cantidad de tickets</Label>
                  <Input
                    id={`tickets-${index}`}
                    type="number"
                    min="1"
                    value={batch.total_tickets}
                    onChange={(e) => updateBatchField(index, 'total_tickets', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creando..." : "Crear Evento"}
      </Button>
    </form>
  );
};