import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface NewEventFormProps {
  onSuccess: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
}

export const NewEventForm = ({ onSuccess }: NewEventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const { error } = await supabase
        .from("events")
        .insert({
          ...data,
          user_id: user.id,
        });

      if (error) throw error;

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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creando..." : "Crear Evento"}
      </Button>
    </form>
  );
};