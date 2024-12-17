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

  const voteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error: deleteError } = await supabase
        .from("product_votes")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("product_votes")
        .insert({
          product_id: productId,
          user_id: user.id,
          vote_type: voteType,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-vote", productId] });
      toast({
        description: "Tu voto ha sido registrado",
      });
    },
    onError: () => {
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
        className={userVote === true ? "bg-green-100" : ""}
      >
        <ArrowUp />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => voteMutation.mutate({ voteType: false })}
        className={userVote === false ? "bg-red-100" : ""}
      >
        <ArrowDown />
      </Button>
      <div className="flex gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <ArrowUp className="text-green-500" size={16} />
          {upvotes || 0}
        </span>
        <span className="flex items-center gap-1">
          <ArrowDown className="text-red-500" size={16} />
          {downvotes || 0}
        </span>
      </div>
    </div>
  );
};