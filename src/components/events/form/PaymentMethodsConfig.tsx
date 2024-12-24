import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethodsConfigProps {
  onMethodsChange: (methods: PaymentMethod[]) => void;
}

export interface PaymentMethod {
  payment_type: 'stripe' | 'bank_transfer' | 'usdt';
  details?: Record<string, any>;
  network?: string;
  wallet_address?: string;
}

export const PaymentMethodsConfig = ({ onMethodsChange }: PaymentMethodsConfigProps) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [bankEnabled, setBankEnabled] = useState(false);
  const [usdtEnabled, setUsdtEnabled] = useState(false);
  const [usdtNetwork, setUsdtNetwork] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState('');

  const updateMethods = () => {
    const newMethods: PaymentMethod[] = [];
    
    if (stripeEnabled) {
      newMethods.push({ payment_type: 'stripe' });
    }
    
    if (bankEnabled) {
      newMethods.push({ payment_type: 'bank_transfer' });
    }
    
    if (usdtEnabled && usdtNetwork && walletAddress) {
      newMethods.push({
        payment_type: 'usdt',
        network: usdtNetwork,
        wallet_address: walletAddress
      });
    }
    
    setMethods(newMethods);
    onMethodsChange(newMethods);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Métodos de pago</h3>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="stripe"
          checked={stripeEnabled}
          onCheckedChange={(checked) => {
            setStripeEnabled(checked);
            updateMethods();
          }}
        />
        <Label htmlFor="stripe">Stripe (Tarjeta)</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="bank"
          checked={bankEnabled}
          onCheckedChange={(checked) => {
            setBankEnabled(checked);
            updateMethods();
          }}
        />
        <Label htmlFor="bank">Transferencia bancaria</Label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="usdt"
            checked={usdtEnabled}
            onCheckedChange={(checked) => {
              setUsdtEnabled(checked);
              if (!checked) {
                setUsdtNetwork('');
                setWalletAddress('');
              }
              updateMethods();
            }}
          />
          <Label htmlFor="usdt">USDT</Label>
        </div>

        {usdtEnabled && (
          <div className="ml-6 space-y-2">
            <Select
              value={usdtNetwork}
              onValueChange={(value) => {
                setUsdtNetwork(value);
                updateMethods();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la red" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="tron">Tron (TRC20)</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Dirección de wallet"
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value);
                updateMethods();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};