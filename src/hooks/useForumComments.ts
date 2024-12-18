import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useForumComments = (topicId: string) => {
  return useQuery({
    queryKey: ["forum-comments", topicId],
    queryFn: async () => {
      console.log('Fetching forum comments');
      
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
        .eq("topic_id", topicId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }

      console.log('Comments fetched:', data);
      return data;
    },
  });
};