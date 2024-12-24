import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PaymentMethodSelectorProps {
  eventId: string;
  batchId: string;
  price: number;
}

export const PaymentMethodSelector = ({ eventId, batchId, price }: PaymentMethodSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStripePayment = async () => {
    try {
      setIsLoading(true);
      const { data: { url }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { eventId, batchId },
      });

      if (error) throw error;
      if (!url) throw new Error('No se pudo crear la sesión de pago');

      window.location.href = url;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleStripePayment}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          `Pagar ${price}€ con tarjeta`
        )}
      </Button>
      
      {/* Próximamente añadiremos más métodos de pago aquí */}
      <p className="text-sm text-gray-500 text-center">
        Más métodos de pago próximamente
      </p>
    </div>
  );
};