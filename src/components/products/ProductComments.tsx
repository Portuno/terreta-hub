import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, Loader2, MessageSquare, ThumbsUp, ThumbsDown, Smile } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

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
      setNewComment("");
      setReplyingTo(null);
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

  const reactionMutation = useMutation({
    mutationFn: async ({ commentId, reactionType }: { commentId: string; reactionType: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("product_comment_reactions")
        .upsert({
          comment_id: commentId,
          user_id: user.id,
          reaction_type: reactionType,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-comments"] });
      toast({
        description: "Reacción registrada",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Error al registrar la reacción",
      });
    },
  });

  const renderComment = (comment: Comment) => (
    <div
      key={comment.id}
      className="border rounded-lg p-4 space-y-2"
      style={{ marginLeft: `${comment.depth * 2}rem` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.profile?.avatar_url || undefined}
              alt={comment.profile?.username}
            />
            <AvatarFallback>
              {comment.profile?.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            to={`/perfil/${comment.profile?.username}`}
            className="font-medium hover:underline"
          >
            {comment.profile?.username}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => voteMutation.mutate({ commentId: comment.id, voteType: true })}
          >
            <ArrowUp size={16} />
            <span className="ml-1">{comment.upvotes || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => voteMutation.mutate({ commentId: comment.id, voteType: false })}
          >
            <ArrowDown size={16} />
            <span className="ml-1">{comment.downvotes || 0}</span>
          </Button>
        </div>
      </div>
      <p className="text-gray-600">{comment.content}</p>
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
        >
          <MessageSquare size={16} className="mr-1" />
          Responder
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => reactionMutation.mutate({ commentId: comment.id, reactionType: "like" })}
        >
          <ThumbsUp size={16} className="mr-1" />
          Me gusta
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => reactionMutation.mutate({ commentId: comment.id, reactionType: "dislike" })}
        >
          <ThumbsDown size={16} className="mr-1" />
          No me gusta
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => reactionMutation.mutate({ commentId: comment.id, reactionType: "smile" })}
        >
          <Smile size={16} className="mr-1" />
          Me divierte
        </Button>
      </div>
      {replyingTo === comment.id && (
        <div className="mt-4">
          <Textarea
            placeholder="Escribe tu respuesta..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setReplyingTo(null);
                setNewComment("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => commentMutation.mutate({ content: newComment, parentId: comment.id })}
              disabled={!newComment.trim()}
            >
              Responder
            </Button>
          </div>
        </div>
      )}
    </div>
  );

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
          return comments.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        case "downvotes":
          return comments.sort((a, b) => (b.downvotes || 0) - (a.downvotes || 0));
        case "recent":
        default:
          return comments;
      }
    };

    const renderCommentThread = (comment: Comment) => {
      const replies = commentsByParentId[comment.id] || [];
      return (
        <div key={comment.id}>
          {renderComment(comment)}
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
            No hay comentarios aún.
          </p>
        )}
      </CardContent>
    </Card>
  );
};