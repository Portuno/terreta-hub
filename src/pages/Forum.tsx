import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { TopicList } from "@/components/forum/TopicList";
import { NewTopicDialog } from "@/components/forum/NewTopicDialog";
import { useQuery } from "@tanstack/react-query";

interface PollData {
  title: string;
  description?: string;
  options: string[];
  isMultipleChoice: boolean;
  endsAt?: Date;
}

const Forum = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [includePoll, setIncludePoll] = useState(false);
  const [pollData, setPollData] = useState<PollData>({
    title: "",
    description: "",
    options: ["", ""],
    isMultipleChoice: false,
  });

  const { data: topics, isLoading } = useQuery({
    queryKey: ["forum-topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
          *,
          profile:profiles!fk_forum_topics_profile (
            username,
            avatar_url,
            reputation
          )
        `)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateTopic = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          description: "Debes iniciar sesión para crear un debate",
        });
        return;
      }

      const { data: topic, error: topicError } = await supabase
        .from("forum_topics")
        .insert({
          title: newTopicTitle,
          content: newTopicContent,
          user_id: user.id,
        })
        .select()
        .single();

      if (topicError) throw topicError;

      // Si hay una encuesta, la creamos
      if (includePoll && pollData.title && pollData.options.length >= 2) {
        // Crear la encuesta
        const { data: poll, error: pollError } = await supabase
          .from("polls")
          .insert({
            title: pollData.title,
            description: pollData.description,
            topic_id: topic.id,
            user_id: user.id,
            is_multiple_choice: pollData.isMultipleChoice,
            ends_at: pollData.endsAt?.toISOString(), // Convertimos la fecha a string ISO
          })
          .select()
          .single();

        if (pollError) throw pollError;

        // Crear las opciones de la encuesta
        const pollOptions = pollData.options
          .filter(option => option.trim() !== "")
          .map(option => ({
            poll_id: poll.id,
            option_text: option,
          }));

        const { error: optionsError } = await supabase
          .from("poll_options")
          .insert(pollOptions);

        if (optionsError) throw optionsError;
      }

      toast({
        description: "Debate creado exitosamente",
      });

      setIsNewTopicOpen(false);
      setNewTopicTitle("");
      setNewTopicContent("");
      navigate(`/foro/${topic.id}`);
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        variant: "destructive",
        description: "Error al crear el debate",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ForumHeader onNewTopic={() => setIsNewTopicOpen(true)} />
        {topics && <TopicList topics={topics} />}
        <NewTopicDialog
          isOpen={isNewTopicOpen}
          onOpenChange={setIsNewTopicOpen}
          title={newTopicTitle}
          content={newTopicContent}
          onTitleChange={setNewTopicTitle}
          onContentChange={setNewTopicContent}
          onSubmit={handleCreateTopic}
        />
      </div>
    </div>
  );
};

export default Forum;