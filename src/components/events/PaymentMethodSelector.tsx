import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const handleBankTransfer = async () => {
    try {
      setIsLoading(true);
      const { data: payment, error: paymentError } = await supabase
        .from('event_payments')
        .insert({
          event_id: eventId,
          batch_id: batchId,
          payment_type: 'bank_transfer',
          amount: price,
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      toast({
        title: "Reserva confirmada",
        description: "Por favor, realiza la transferencia usando los datos bancarios proporcionados.",
      });

    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la reserva. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="card" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="card" className="flex items-center gap-2">
          <CreditCard size={16} />
          Tarjeta
        </TabsTrigger>
        <TabsTrigger value="bank" className="flex items-center gap-2">
          <Building2 size={16} />
          Transferencia
        </TabsTrigger>
      </TabsList>

      <TabsContent value="card">
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
      </TabsContent>

      <TabsContent value="bank">
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Realiza una transferencia bancaria a:<br />
              IBAN: ES12 3456 7890 1234 5678 9012<br />
              BIC/SWIFT: ABCDESXX<br />
              Beneficiario: Nombre de la empresa<br />
              Concepto: Evento {eventId.slice(0, 8)}
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleBankTransfer}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Confirmar reserva"
            )}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};