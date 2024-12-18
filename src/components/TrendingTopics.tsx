import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export const TrendingTopics = () => {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["trendingTopics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
          *,
          profile:profiles!fk_forum_topics_profile (username)
        `)
        .order("views", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics?.map((topic) => (
        <Link
          key={topic.id}
          to={`/foro/${topic.id}`}
          className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-medium text-gray-900">{topic.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{topic.content}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
            <span>{topic.views} visualizaciones</span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              {topic.replies} respuestas
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};