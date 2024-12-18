import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CommentForm } from "./CommentForm";
import { CommentSorter } from "./comments/CommentSorter";
import { CommentList } from "./comments/CommentList";

interface Comment {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  parent_id: string | null;
  depth: number;
  profile: {
    username: string;
    avatar_url: string | null;
  };
}

interface ProductCommentsProps {
  comments: Comment[] | null;
  isLoading: boolean;
  commentSort: "upvotes" | "downvotes" | "recent";
  setCommentSort: (sort: "upvotes" | "downvotes" | "recent") => void;
  productId: string;
}

export const ProductComments = ({
  comments,
  isLoading,
  commentSort,
  setCommentSort,
  productId
}: ProductCommentsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("product_comments")
        .insert({
          content,
          product_id: productId,
          user_id: user.id,
          parent_id: parentId || null,
          depth: parentId ? 1 : 0,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-comments"] });
      toast({
        description: "Comentario publicado exitosamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Error al publicar el comentario",
      });
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ commentId, voteType }: { commentId: string; voteType: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error: deleteError } = await supabase
        .from("product_comment_votes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("product_comment_votes")
        .insert({
          comment_id: commentId,
          user_id: user.id,
          vote_type: voteType,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-comments"] });
      toast({
        description: "Voto registrado exitosamente",
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Comentarios</h2>
          <CommentSorter commentSort={commentSort} setCommentSort={setCommentSort} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <CommentForm
            onSubmit={(content) => commentMutation.mutate({ content })}
          />
        </div>
        
        <CommentList
          comments={comments}
          isLoading={isLoading}
          onVote={(commentId, voteType) => voteMutation.mutate({ commentId, voteType })}
          onReply={(commentId, content) => commentMutation.mutate({ content, parentId: commentId })}
          commentSort={commentSort}
        />
      </CardContent>
    </Card>
  );
};