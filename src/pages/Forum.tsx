import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { TimeFilter } from "@/components/forum/TimeFilter";
import { TopicList } from "@/components/forum/TopicList";
import { NewTopicDialog } from "@/components/forum/NewTopicDialog";
import { Footer } from "@/components/Footer";

interface Profile {
  username: string;
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  views: number;
  replies: number;
  created_at: string;
  upvotes: number;
  downvotes: number;
  profile: Profile;
}

const Forum = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const { toast } = useToast();

  const { data: topics, refetch } = useQuery<ForumTopic[]>({
    queryKey: ['forum-topics', timeFilter],
    queryFn: async () => {
      let query = supabase
        .from('forum_topics')
        .select(`
          *,
          profile:profiles(username)
        `);

      if (timeFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (timeFilter) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching topics:", error);
        throw error;
      }
      return data;
    }
  });

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para crear un tema",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("forum_topics").insert({
        title,
        content,
        user_id: user.id,
        media_urls: [],
      });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Tu tema ha sido creado",
      });

      setIsOpen(false);
      setTitle("");
      setContent("");
      refetch();
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el tema",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-16 flex-grow">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <ForumHeader onNewTopic={() => setIsOpen(true)} />
            <TimeFilter value={timeFilter} onValueChange={setTimeFilter} />
            <TopicList topics={topics || []} />
          </div>
        </main>
      </div>
      <Footer />

      <NewTopicDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Forum;