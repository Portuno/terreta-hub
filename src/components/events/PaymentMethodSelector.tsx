import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Building2, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";

interface PaymentMethodSelectorProps {
  eventId: string;
  batchId: string;
  price: number;
}

interface PaymentMethod {
  payment_type: string;
  network?: string;
  wallet_address?: string;
  is_active: boolean;
}

export const PaymentMethodSelector = ({ eventId, batchId, price }: PaymentMethodSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentMethods", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_payment_methods")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_active", true);
      
      if (error) throw error;
      return data as PaymentMethod[];
    },
  });

  useEffect(() => {
    if (paymentMethods?.length > 0) {
      setActiveTab(paymentMethods[0].payment_type);
    }
  }, [paymentMethods]);

  const handleStripePayment = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data: payment, error: paymentError } = await supabase
        .from('event_payments')
        .insert({
          event_id: eventId,
          batch_id: batchId,
          payment_type: 'bank_transfer',
          amount: price,
          status: 'pending',
          user_id: user.id
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

  const handleUSDTPayment = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');
      
      const method = paymentMethods?.find(m => m.payment_type === 'usdt');
      
      const { data: payment, error: paymentError } = await supabase
        .from('event_payments')
        .insert({
          event_id: eventId,
          batch_id: batchId,
          payment_type: 'usdt',
          amount: price,
          status: 'pending',
          user_id: user.id,
          payment_data: {
            network: method?.network,
            wallet_address: method?.wallet_address
          }
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      toast({
        title: "Pago USDT",
        description: "Por favor, realiza la transferencia USDT a la dirección proporcionada.",
      });

    } catch (error) {
      console.error('Error al procesar el pago USDT:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No hay métodos de pago disponibles para este evento.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${paymentMethods.length}, 1fr)` }}>
        {paymentMethods.map(method => (
          <TabsTrigger 
            key={method.payment_type} 
            value={method.payment_type}
            className="flex items-center gap-2"
          >
            {method.payment_type === 'stripe' && <CreditCard size={16} />}
            {method.payment_type === 'bank_transfer' && <Building2 size={16} />}
            {method.payment_type === 'usdt' && <Wallet size={16} />}
            {method.payment_type === 'stripe' && 'Tarjeta'}
            {method.payment_type === 'bank_transfer' && 'Transferencia'}
            {method.payment_type === 'usdt' && 'USDT'}
          </TabsTrigger>
        ))}
      </TabsList>

      {paymentMethods.map(method => (
        <TabsContent key={method.payment_type} value={method.payment_type}>
          {method.payment_type === 'stripe' && (
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
          )}

          {method.payment_type === 'bank_transfer' && (
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
          )}

          {method.payment_type === 'usdt' && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Realiza una transferencia USDT a:<br />
                  Red: {method.network}<br />
                  Dirección: {method.wallet_address}<br />
                  Cantidad: {price} USDT
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleUSDTPayment}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar pago USDT"
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};