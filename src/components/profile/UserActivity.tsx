import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserActivityProps {
  userId: string;
}

interface ForumTopic {
  id: string;
  title: string;
  created_at: string;
}

interface Bookmark {
  id: string;
  created_at: string;
  forum_topics: ForumTopic;
}

export const UserActivity = ({ userId }: UserActivityProps) => {
  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["user-comments", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_comments")
        .select(`
          *,
          forum_topics (
            title,
            id
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const { data: bookmarks, isLoading: isBookmarksLoading } = useQuery({
    queryKey: ["user-bookmarks", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select(`
          id,
          created_at,
          forum_topics:forum_topics (
            id,
            title,
            created_at
          )
        `)
        .eq("user_id", userId)
        .eq("target_type", "forum_topic")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Bookmarks data:", data); // Debug log
      return data as unknown as Bookmark[];
    },
  });

  if (isCommentsLoading || isBookmarksLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="comments">
          <TabsList className="w-full">
            <TabsTrigger value="comments" className="flex-1">
              Comentarios
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex-1">
              Temas guardados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments">
            <h3 className="text-lg font-medium mb-4">Actividad Reciente</h3>
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/foro/${comment.forum_topics.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {comment.forum_topics.title}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content.length > 100
                        ? `${comment.content.substring(0, 100)}...`
                        : comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay actividad reciente.
              </p>
            )}
          </TabsContent>

          <TabsContent value="bookmarks">
            <h3 className="text-lg font-medium mb-4">Temas Guardados</h3>
            {bookmarks && bookmarks.length > 0 ? (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="flex items-center justify-between">
                    <Link
                      to={`/foro/${bookmark.forum_topics.id}`}
                      className="text-sm hover:underline"
                    >
                      {bookmark.forum_topics.title}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay temas guardados.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};