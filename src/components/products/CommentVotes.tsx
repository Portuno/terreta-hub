import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoteSubscription } from "@/hooks/useVoteSubscription";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CommentVotesProps {
  commentId: string;
  upvotes: number;
  downvotes: number;
  userVote?: boolean | null;
  onVote: (voteType: boolean) => void;
  type: 'forum_comment' | 'product_comment';
}

export const CommentVotes = ({ 
  commentId, 
  upvotes, 
  downvotes, 
  userVote, 
  type 
}: CommentVotesProps) => {
  const voteBalance = upvotes - downvotes;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Subscribe to vote changes
  useVoteSubscription(type, commentId);

  const voteMutation = useMutation({
    mutationFn: async (voteType: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Si ya existe un voto del mismo tipo, lo eliminamos
      if (userVote === voteType) {
        const { error: deleteError } = await supabase
          .from(type === 'forum_comment' ? "forum_votes" : "product_comment_votes")
          .delete()
          .eq(type === 'forum_comment' ? "target_id" : "comment_id", commentId)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;
        return;
      }

      // Eliminar voto existente si hay
      const { error: deleteError } = await supabase
        .from(type === 'forum_comment' ? "forum_votes" : "product_comment_votes")
        .delete()
        .eq(type === 'forum_comment' ? "target_id" : "comment_id", commentId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Insertar nuevo voto si es diferente al anterior
      if (userVote !== voteType) {
        const { error: insertError } = await supabase
          .from(type === 'forum_comment' ? "forum_votes" : "product_comment_votes")
          .insert({
            [type === 'forum_comment' ? "target_id" : "comment_id"]: commentId,
            user_id: user.id,
            vote_type: voteType,
            ...(type === 'forum_comment' ? { target_type: 'comment' } : {})
          });

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type === 'forum_comment' ? "forum-comments" : "product-comments"] });
      toast({
        description: "Tu voto ha sido registrado",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Error al registrar el voto",
      });
    },
  });
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => voteMutation.mutate(true)}
        className={userVote === true ? "text-green-600" : ""}
      >
        <ArrowUp size={16} />
      </Button>
      <span className={`text-sm font-medium ${voteBalance > 0 ? 'text-green-600' : voteBalance < 0 ? 'text-red-600' : ''}`}>
        {voteBalance}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => voteMutation.mutate(false)}
        className={userVote === false ? "text-red-600" : ""}
      >
        <ArrowDown size={16} />
      </Button>
    </div>
  );
};