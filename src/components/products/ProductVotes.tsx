import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProductVotesProps {
  productId: string;
  userVote?: boolean;
  upvotes: number;
  downvotes: number;
}

export const ProductVotes = ({ productId, userVote, upvotes, downvotes }: ProductVotesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const voteBalance = upvotes - downvotes;

  const voteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: boolean }) => {
      console.log('Registrando voto:', { productId, voteType });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Si ya existe un voto del mismo tipo, lo eliminamos
      if (userVote === voteType) {
        console.log('Eliminando voto existente');
        const { error: deleteError } = await supabase
          .from("product_votes")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;
        return;
      }

      // Si existe un voto pero de tipo diferente, o no existe voto, primero eliminamos cualquier voto existente
      console.log('Eliminando votos previos si existen');
      const { error: deleteError } = await supabase
        .from("product_votes")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Si estábamos eliminando un voto del mismo tipo, no insertamos uno nuevo
      if (userVote !== voteType) {
        console.log('Insertando nuevo voto');
        const { error: insertError } = await supabase
          .from("product_votes")
          .insert({
            product_id: productId,
            user_id: user.id,
            vote_type: voteType,
          });

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      // Invalidamos tanto la consulta del producto como la del voto específico
      console.log('Invalidando cachés');
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-vote", productId] });
      toast({
        description: "Tu voto ha sido registrado",
      });
    },
    onError: (error) => {
      console.error('Error al votar:', error);
      toast({
        variant: "destructive",
        description: "Error al registrar tu voto",
      });
    },
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => voteMutation.mutate({ voteType: true })}
        className={userVote === true ? "text-green-600" : ""}
      >
        <ArrowUp />
      </Button>
      <span className={`text-lg font-medium ${voteBalance > 0 ? 'text-green-600' : voteBalance < 0 ? 'text-red-600' : ''}`}>
        {voteBalance}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => voteMutation.mutate({ voteType: false })}
        className={userVote === false ? "text-red-600" : ""}
      >
        <ArrowDown />
      </Button>
    </div>
  );
};