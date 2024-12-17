import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Loader2 } from "lucide-react";

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
          profile:profiles(username, avatar_url, id)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["forum-comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_comments")
        .select(`
          *,
          profile:profiles(username, avatar_url, id)
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

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={topic.profile?.avatar_url} alt={topic.profile?.username} />
                <AvatarFallback>
                  {topic.profile?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{topic.title}</h1>
                <Link
                  to={`/perfil/${topic.profile?.username}`}
                  className="text-sm text-gray-500 hover:underline flex items-center gap-1"
                >
                  <User size={14} />
                  {topic.profile?.username}
                </Link>
              </div>
            </div>
            <p className="mt-4">{topic.content}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
            {comments && comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comment.profile?.avatar_url}
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
                        <Button variant="ghost" size="sm">
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay comentarios aún.</p>
            )}

            <div className="mt-6">
              <Textarea
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleCommentSubmit} className="mt-2">
                Comentar
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForumTopic;