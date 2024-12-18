import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface PollOption {
  id: string;
  option_text: string;
  votes?: number;
}

interface PollProps {
  poll: {
    id: string;
    title: string;
    description?: string;
    is_multiple_choice: boolean;
    ends_at?: string;
    options: PollOption[];
  };
  onVote?: () => void;
}

export const PollSection = ({ poll, onVote }: PollProps) => {
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);

  const handleSingleOptionChange = (value: string) => {
    setSelectedOptions([value]);
  };

  const handleMultipleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const handleVote = async () => {
    try {
      setIsVoting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          description: "Debes iniciar sesión para votar",
        });
        return;
      }

      if (selectedOptions.length === 0) {
        toast({
          variant: "destructive",
          description: "Selecciona al menos una opción",
        });
        return;
      }

      // Insert votes for each selected option
      const { error } = await supabase.from("poll_votes").insert(
        selectedOptions.map(optionId => ({
          poll_id: poll.id,
          option_id: optionId,
          user_id: user.id,
        }))
      );

      if (error) throw error;

      toast({
        description: "Tu voto ha sido registrado",
      });
      
      if (onVote) onVote();
      setSelectedOptions([]);
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        variant: "destructive",
        description: "Error al registrar el voto",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const isPollEnded = poll.ends_at ? new Date(poll.ends_at) < new Date() : false;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">{poll.title}</h3>
      {poll.description && (
        <p className="text-gray-600 mb-4">{poll.description}</p>
      )}
      
      <div className="space-y-4">
        {poll.is_multiple_choice ? (
          // Multiple choice options
          poll.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={(checked) => 
                  handleMultipleOptionChange(option.id, checked as boolean)
                }
                disabled={isPollEnded}
              />
              <Label htmlFor={option.id}>{option.option_text}</Label>
              {option.votes !== undefined && (
                <span className="text-sm text-gray-500">
                  ({option.votes} votos)
                </span>
              )}
            </div>
          ))
        ) : (
          // Single choice options
          <RadioGroup
            onValueChange={handleSingleOptionChange}
            disabled={isPollEnded}
          >
            {poll.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.option_text}</Label>
                {option.votes !== undefined && (
                  <span className="text-sm text-gray-500">
                    ({option.votes} votos)
                  </span>
                )}
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {!isPollEnded && (
        <Button 
          onClick={handleVote} 
          disabled={isVoting || selectedOptions.length === 0}
          className="mt-4"
        >
          {isVoting ? "Votando..." : "Votar"}
        </Button>
      )}

      {isPollEnded && (
        <p className="text-sm text-gray-500 mt-4">
          Esta encuesta ha finalizado
        </p>
      )}
    </div>
  );
};