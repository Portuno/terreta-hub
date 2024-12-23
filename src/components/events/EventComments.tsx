import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CommentForm } from "@/components/products/CommentForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventCommentsProps {
  eventId: string;
  comments: Array<{
    id: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
      avatar_url: string;
    };
  }>;
}

export const EventComments = ({ eventId, comments }: EventCommentsProps) => {
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { error } = await supabase
        .from("event_comments")
        .insert({
          event_id: eventId,
          user_id: user.id,
          content,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success("Comentario añadido");
    },
    onError: (error) => {
      console.error("Error al añadir comentario:", error);
      toast.error("Error al añadir el comentario");
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Comentarios</h2>
      <div className="space-y-6">
        <CommentForm
          onSubmit={(content) => commentMutation.mutate(content)}
          placeholder="Escribe un comentario sobre el evento..."
        />

        <div className="space-y-4">
          {comments
            ?.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={comment.profiles.avatar_url || "/placeholder.svg"}
                    alt={comment.profiles.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">{comment.profiles.username}</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(comment.created_at), "d 'de' MMMM 'a las' p", {
                      locale: es,
                    })}
                  </span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};