import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { TopicHeader } from "@/components/forum/TopicHeader";
import { TopicComments } from "@/components/forum/TopicComments";
import { PollSection } from "@/components/forum/PollSection";
import { Stats } from "@/components/Stats";
import { useForumTopicData } from "@/hooks/useForumTopicData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ForumTopic = () => {
  const { id } = useParams();
  if (!id) return null;

  const { data: topic, isLoading: isTopicLoading } = useForumTopicData(id);

  const { data: poll } = useQuery({
    queryKey: ["forum-poll", id],
    queryFn: async () => {
      const { data: pollData, error: pollError } = await supabase
        .from("polls")
        .select(`
          *,
          options:poll_options(*)
        `)
        .eq("topic_id", id)
        .maybeSingle();

      if (pollError) throw pollError;
      
      if (!pollData) return null;

      const { data: voteData, error: voteError } = await supabase
        .from("poll_votes")
        .select('option_id, count', { count: 'exact' })
        .eq('poll_id', pollData.id);

      if (voteError) throw voteError;

      pollData.options = pollData.options.map(option => ({
        ...option,
        votes: voteData?.filter(v => v.option_id === option.id).length || 0
      }));

      return pollData;
    },
  });

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
          <Stats />
          <TopicHeader topic={topic} />
          
          {poll && (
            <PollSection 
              poll={poll}
              onVote={() => {
                queryClient.invalidateQueries({ queryKey: ["forum-poll", id] });
              }}
            />
          )}

          <TopicComments topicId={id} />
        </main>
      </div>
    </div>
  );
};

export default ForumTopic;