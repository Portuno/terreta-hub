import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CommentForm } from "./CommentForm";
import { SingleComment } from "./SingleComment";

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

  const organizeComments = (commentsArray: Comment[]) => {
    const topLevelComments = commentsArray.filter(comment => !comment.parent_id);
    const commentsByParentId = commentsArray.reduce((acc, comment) => {
      if (comment.parent_id) {
        acc[comment.parent_id] = [...(acc[comment.parent_id] || []), comment];
      }
      return acc;
    }, {} as Record<string, Comment[]>);

    const sortComments = (comments: Comment[]) => {
      switch (commentSort) {
        case "upvotes":
          return comments.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        case "downvotes":
          return comments.sort((a, b) => (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes));
        case "recent":
        default:
          return comments;
      }
    };

    const renderCommentThread = (comment: Comment) => {
      const replies = commentsByParentId[comment.id] || [];
      return (
        <div key={comment.id}>
          <SingleComment
            comment={comment}
            onVote={(commentId, voteType) => voteMutation.mutate({ commentId, voteType })}
            onReply={(commentId, content) => commentMutation.mutate({ content, parentId: commentId })}
            depth={comment.depth}
          />
          {sortComments(replies).map(reply => renderCommentThread(reply))}
        </div>
      );
    };

    return sortComments(topLevelComments).map(comment => renderCommentThread(comment));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Comentarios</h2>
          <div className="flex gap-2">
            <Button
              variant={commentSort === "upvotes" ? "default" : "outline"}
              size="sm"
              onClick={() => setCommentSort("upvotes")}
            >
              Más votados
            </Button>
            <Button
              variant={commentSort === "downvotes" ? "default" : "outline"}
              size="sm"
              onClick={() => setCommentSort("downvotes")}
            >
              Menos votados
            </Button>
            <Button
              variant={commentSort === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setCommentSort("recent")}
            >
              Recientes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <CommentForm
            onSubmit={(content) => commentMutation.mutate({ content })}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {organizeComments(comments)}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        )}
      </CardContent>
    </Card>
  );
};