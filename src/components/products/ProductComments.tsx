import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
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
}

export const ProductComments = ({ 
  comments, 
  isLoading, 
  commentSort, 
  setCommentSort 
}: ProductCommentsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async ({ commentId, voteType }: { commentId: string; voteType: boolean }) => {
      const { error: deleteError } = await supabase
        .from("product_comment_votes")
        .delete()
        .eq("comment_id", commentId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("product_comment_votes")
        .insert([
          {
            comment_id: commentId,
            vote_type: voteType,
          },
        ]);

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
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border rounded-lg p-4 space-y-2"
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
              </div>
            ))}
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