import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CommentList } from "@/components/forum/CommentList";
import { CommentForm } from "@/components/forum/CommentForm";
import { supabase } from "@/integrations/supabase/client";
import { useForumComments } from "@/hooks/useForumComments";
import { useQueryClient } from "@tanstack/react-query";

interface TopicCommentsProps {
  topicId: string;
}

export const TopicComments = ({ topicId }: TopicCommentsProps) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useForumComments(topicId);

  const handleCommentSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para comentar",
          variant: "destructive",
        });
        return;
      }

      console.log('Creating new comment');
      
      const { error } = await supabase.from("forum_comments").insert({
        content: newComment,
        topic_id: topicId,
        user_id: user.id,
      });

      if (error) {
        console.error('Error creating comment:', error);
        throw error;
      }

      toast({
        title: "¡Éxito!",
        description: "Tu comentario ha sido publicado",
      });

      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["forum-comments", topicId] });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
      {comments && comments.length > 0 ? (
        <CommentList comments={comments} />
      ) : (
        <p className="text-gray-500">No hay comentarios aún.</p>
      )}
      <CommentForm
        newComment={newComment}
        onCommentChange={setNewComment}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
};