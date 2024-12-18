import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useForumTopicData = (id: string) => {
  return useQuery({
    queryKey: ["forum-topic", id],
    queryFn: async () => {
      console.log('Fetching forum topic:', id);
      
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching topic:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      // Increment view count
      const { error: updateError } = await supabase
        .from("forum_topics")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);

      if (updateError) {
        console.error('Error updating view count:', updateError);
      }

      console.log('Topic fetched:', data);
      return data;
    },
  });
};