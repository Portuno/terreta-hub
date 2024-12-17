import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ForumComment, ForumTopic as ForumTopicType } from "@/types/forum";
import { Navbar } from "../components/Navbar";

const ForumTopic = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");

  const { data: topic } = useQuery({
    queryKey: ["forum-topic", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
          *,
          profile:profiles(username, id)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as unknown as ForumTopicType;
    },
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["forum-comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_comments")
        .select(`
          *,
          profile:profiles(username, id)
        `)
        .eq("topic_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as unknown as ForumComment[];
    },
  });

  const handleCommentSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para comentar",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("forum_comments").insert({
        content: newComment,
        topic_id: id,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Tu comentario ha sido publicado",
      });

      setNewComment("");
      refetchComments();
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          {topic && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold">{topic.title}</h1>
              <p className="mt-4">{topic.content}</p>
              <p className="mt-2 text-sm text-gray-500">Creado por {topic.profile?.username}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <p className="text-sm text-gray-600">{comment.content}</p>
                    <p className="text-xs text-gray-500">por {comment.profile?.username}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay comentarios aún.</p>
            )}
          </div>

          <div className="mt-6">
            <Textarea
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button onClick={handleCommentSubmit} className="mt-2">Comentar</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForumTopic;
