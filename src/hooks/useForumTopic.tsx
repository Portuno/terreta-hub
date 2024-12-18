import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface PollData {
  title: string;
  description?: string;
  options: string[];
  isMultipleChoice: boolean;
  endsAt?: Date;
}

export const useForumTopic = () => {
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

  const handleCreateTopic = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

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

      if (includePoll && pollData.title && pollData.options.length >= 2) {
        const { data: poll, error: pollError } = await supabase
          .from("polls")
          .insert({
            title: pollData.title,
            description: pollData.description,
            topic_id: topic.id,
            user_id: user.id,
            is_multiple_choice: pollData.isMultipleChoice,
            ends_at: pollData.endsAt?.toISOString(),
          })
          .select()
          .single();

        if (pollError) throw pollError;

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

  return {
    isNewTopicOpen,
    setIsNewTopicOpen,
    newTopicTitle,
    setNewTopicTitle,
    newTopicContent,
    setNewTopicContent,
    includePoll,
    setIncludePoll,
    pollData,
    setPollData,
    handleCreateTopic,
  };
};