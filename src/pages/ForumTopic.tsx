import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "../components/Navbar";
import { Loader2 } from "lucide-react";
import { TopicHeader } from "@/components/forum/TopicHeader";
import { CommentList } from "@/components/forum/CommentList";
import { CommentForm } from "@/components/forum/CommentForm";
import { PollSection } from "@/components/forum/PollSection";

const ForumTopic = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");

  const { data: topic, isLoading: isTopicLoading } = useQuery({
    queryKey: ["forum-topic", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
          *,
          profile:profiles!fk_forum_topics_profile (
            username, 
            avatar_url, 
            id,
            reputation
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: poll } = useQuery({
    queryKey: ["forum-poll", id],
    queryFn: async () => {
      // Primero obtenemos la encuesta
      const { data: pollData, error: pollError } = await supabase
        .from("polls")
        .select(`
          *,
          options:poll_options(*)
        `)
        .eq("topic_id", id)
        .maybeSingle();

      if (pollError) throw pollError;
      
      // Si no hay encuesta, retornamos null
      if (!pollData) return null;

      // Obtenemos los votos para cada opción
      const { data: voteData, error: voteError } = await supabase
        .from("poll_votes")
        .select('option_id, count', { count: 'exact' })
        .eq('poll_id', pollData.id);

      if (voteError) throw voteError;

      // Agregamos el conteo de votos a cada opción
      pollData.options = pollData.options.map(option => ({
        ...option,
        votes: voteData?.filter(v => v.option_id === option.id).length || 0
      }));

      return pollData;
    },
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["forum-comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_comments")
        .select(`
          *,
          profile:profiles!fk_forum_comments_profile (
            username, 
            avatar_url, 
            id,
            reputation
          )
        `)
        .eq("topic_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
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

  if (isTopicLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container mx-auto px-4">
          <p className="text-center text-gray-500">Tema no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <TopicHeader topic={topic} />
          
          {poll && (
            <PollSection 
              poll={poll} 
              onVote={() => {
                const queryClient = useQueryClient();
                queryClient.invalidateQueries({ queryKey: ["forum-poll", id] });
              }}
            />
          )}

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
        </main>
      </div>
    </div>
  );
};

export default ForumTopic;