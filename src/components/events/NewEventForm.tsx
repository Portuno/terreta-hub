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
import { PaymentMethodsConfig, PaymentMethod } from "./form/PaymentMethodsConfig";
import { TicketBatchesConfig } from "./form/TicketBatchesConfig";

interface NewEventFormProps {
  onSuccess: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
  is_paid: boolean;
}

export const NewEventForm = ({ onSuccess }: NewEventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [ticketBatches, setTicketBatches] = useState([{ price: 0, total_tickets: 0 }]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    if (isPaid && paymentMethods.length === 0) {
      toast({
        title: "Error",
        description: "Debes configurar al menos un método de pago.",
        variant: "destructive",
      });
      return;
    }

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

      // Si es un evento de pago, crear los lotes de tickets y métodos de pago
      if (isPaid && event) {
        // Crear lotes de tickets
        const batchesData = ticketBatches.map((batch, index) => ({
          event_id: event.id,
          price: batch.price,
          total_tickets: batch.total_tickets,
          available_tickets: batch.total_tickets,
          batch_number: index + 1,
          is_active: true,
        }));

        const { error: batchError } = await supabase
          .from("event_ticket_batches")
          .insert(batchesData);

        if (batchError) throw batchError;

        // Crear métodos de pago
        const paymentMethodsData = paymentMethods.map(method => ({
          event_id: event.id,
          payment_type: method.payment_type,
          network: method.network,
          wallet_address: method.wallet_address,
          is_active: true,
        }));

        const { error: paymentMethodError } = await supabase
          .from("event_payment_methods")
          .insert(paymentMethodsData);

        if (paymentMethodError) throw paymentMethodError;
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
        <>
          <TicketBatchesConfig onBatchesChange={setTicketBatches} />
          <PaymentMethodsConfig onMethodsChange={setPaymentMethods} />
        </>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creando..." : "Crear Evento"}
      </Button>
    </form>
  );
};