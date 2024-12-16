import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface UserActivityProps {
  userId: string;
}

export const UserActivity = ({ userId }: UserActivityProps) => {
  const { data: comments, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
      </CardContent>
    </Card>
  );
};