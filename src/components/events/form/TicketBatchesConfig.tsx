import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";

interface TicketBatchesConfigProps {
  onBatchesChange: (batches: TicketBatch[]) => void;
}

interface TicketBatch {
  price: number;
  total_tickets: number;
}

export const TicketBatchesConfig = ({ onBatchesChange }: TicketBatchesConfigProps) => {
  const [batches, setBatches] = useState<TicketBatch[]>([{ price: 0, total_tickets: 0 }]);

  const addBatch = () => {
    setBatches([...batches, { price: 0, total_tickets: 0 }]);
    onBatchesChange([...batches, { price: 0, total_tickets: 0 }]);
  };

  const removeBatch = (index: number) => {
    const newBatches = batches.filter((_, i) => i !== index);
    setBatches(newBatches);
    onBatchesChange(newBatches);
  };

  const updateBatch = (index: number, field: keyof TicketBatch, value: number) => {
    const newBatches = [...batches];
    newBatches[index] = { ...newBatches[index], [field]: value };
    setBatches(newBatches);
    onBatchesChange(newBatches);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Lotes de tickets</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addBatch}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Añadir lote
        </Button>
      </div>

      {batches.map((batch, index) => (
        <div key={index} className="space-y-2 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Lote #{index + 1}</h4>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBatch(index)}
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
                onChange={(e) => updateBatch(index, 'price', parseFloat(e.target.value))}
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
                onChange={(e) => updateBatch(index, 'total_tickets', parseInt(e.target.value))}
                required
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};