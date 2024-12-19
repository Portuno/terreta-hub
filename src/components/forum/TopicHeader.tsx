import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { User, Share2, Bookmark } from "lucide-react";
import { UserBadge } from "@/components/profile/UserBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface TopicHeaderProps {
  topic: {
    id: string;
    title: string;
    content: string;
    profile?: {
      username?: string;
      avatar_url?: string;
      reputation?: number;
    };
  };
}

export const TopicHeader = ({ topic }: TopicHeaderProps) => {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("bookmarks")
        .select()
        .eq("user_id", user.id)
        .eq("target_id", topic.id)
        .eq("target_type", "forum_topic")
        .single();

      setIsBookmarked(!!data);
    };

    checkIfBookmarked();
  }, [topic.id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        description: "Enlace copiado al portapapeles",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error al copiar el enlace",
      });
    }
  };

  const handleBookmark = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          description: "Debes iniciar sesión para guardar temas",
        });
        return;
      }

      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("target_id", topic.id)
          .eq("target_type", "forum_topic");

        if (error) throw error;

        setIsBookmarked(false);
        toast({
          description: "Tema eliminado de marcadores",
        });
      } else {
        const { error } = await supabase.from("bookmarks").insert({
          user_id: user.id,
          target_id: topic.id,
          target_type: "forum_topic",
        });

        if (error) throw error;

        setIsBookmarked(true);
        toast({
          description: "Tema guardado en marcadores",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error al gestionar el marcador",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={topic.profile?.avatar_url} alt={topic.profile?.username} />
            <AvatarFallback>
              {topic.profile?.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            <div className="flex items-center gap-2">
              <Link
                to={`/perfil/${topic.profile?.username}`}
                className="text-sm text-gray-500 hover:underline flex items-center gap-1"
              >
                <User size={14} />
                {topic.profile?.username}
              </Link>
              {topic.profile?.reputation !== undefined && (
                <UserBadge reputation={topic.profile.reputation} />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
            {isBookmarked ? "Guardado" : "Guardar"}
          </Button>
        </div>
      </div>
      <p className="mt-4">{topic.content}</p>
    </div>
  );
};