import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useState } from "react";

const ForumTopic = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: topic, isLoading: topicLoading } = useQuery({
    queryKey: ["forum-topic", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["forum-comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_comments")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq("topic_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ voteType, targetId }: { voteType: boolean; targetId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para votar");

      const { data: existingVote } = await supabase
        .from("forum_votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("target_id", targetId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from("forum_votes")
            .delete()
            .eq("id", existingVote.id);
        } else {
          // Update vote
          await supabase
            .from("forum_votes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);
        }
      } else {
        // Create new vote
        await supabase.from("forum_votes").insert({
          user_id: user.id,
          target_id: targetId,
          target_type: "topic",
          vote_type: voteType,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-topic", id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para comentar");

      const { error } = await supabase.from("forum_comments").insert({
        topic_id: id,
        user_id: user.id,
        content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["forum-comments", id] });
      toast({
        title: "¡Éxito!",
        description: "Tu comentario ha sido publicado",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (topicLoading || commentsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container mx-auto px-4">
          <h1 className="text-2xl font-bold">Tema no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <p className="text-gray-600 mt-4">{topic.content}</p>
          
          <div className="flex items-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => voteMutation.mutate({ voteType: true, targetId: topic.id })}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {topic.upvotes || 0}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => voteMutation.mutate({ voteType: false, targetId: topic.id })}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              {topic.downvotes || 0}
            </Button>
            <span className="text-sm text-gray-500">
              por {topic.profiles?.username}
            </span>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Comentarios</h2>
            
            <div className="space-y-4 mb-8">
              {comments?.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <p className="text-gray-800">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      por {comment.profiles?.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                onClick={() => commentMutation.mutate(newComment)}
                disabled={!newComment.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTopic;