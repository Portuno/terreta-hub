import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { TopicList } from "@/components/forum/TopicList";
import { NewTopicDialog } from "@/components/forum/NewTopicDialog";
import { useForumTopic } from "@/hooks/useForumTopic";

const Forum = () => {
  const {
    isNewTopicOpen,
    setIsNewTopicOpen,
    newTopicTitle,
    setNewTopicTitle,
    newTopicContent,
    setNewTopicContent,
    handleCreateTopic,
  } = useForumTopic();

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