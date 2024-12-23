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
  type: 'forum_comment' | 'product_comment';
  onVote?: (voteType: boolean) => void;
}

export const CommentVotes = ({ 
  commentId, 
  upvotes, 
  downvotes, 
  userVote, 
  type,
  onVote 
}: CommentVotesProps) => {
  const voteBalance = upvotes - downvotes;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Subscribe to vote changes
  useVoteSubscription(type, commentId);

  const voteMutation = useMutation({
    mutationFn: async (voteType: boolean) => {
      console.log('Registrando voto:', { commentId, voteType, type });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Si ya existe un voto del mismo tipo, lo eliminamos
      if (userVote === voteType) {
        console.log('Eliminando voto existente del mismo tipo');
        const { error: deleteError } = await supabase
          .from(type === 'forum_comment' ? "forum_votes" : "product_comment_votes")
          .delete()
          .eq(type === 'forum_comment' ? "target_id" : "comment_id", commentId)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;
        return;
      }

      // Eliminar voto existente si hay
      console.log('Eliminando votos previos si existen');
      const { error: deleteError } = await supabase
        .from(type === 'forum_comment' ? "forum_votes" : "product_comment_votes")
        .delete()
        .eq(type === 'forum_comment' ? "target_id" : "comment_id", commentId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Insertar nuevo voto si es diferente al anterior
      if (userVote !== voteType) {
        console.log('Insertando nuevo voto');
        const voteData = type === 'forum_comment' 
          ? {
              target_id: commentId,
              user_id: user.id,
              vote_type: voteType,
              target_type: 'comment'
            }
          : {
              comment_id: commentId,
              user_id: user.id,
              vote_type: voteType
            };

        const { error: insertError } = await supabase
          .from(type === 'forum_comment' ? "forum_votes" : "product_comment_votes")
          .insert(voteData);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      // Notify parent component about vote change if callback exists
      if (onVote) {
        onVote(userVote === undefined ? true : !userVote);
      }
      
      queryClient.invalidateQueries({ queryKey: [type === 'forum_comment' ? "forum-comments" : "product-comments"] });
      toast({
        description: "Tu voto ha sido registrado",
      });
    },
    onError: (error) => {
      console.error('Error al votar:', error);
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