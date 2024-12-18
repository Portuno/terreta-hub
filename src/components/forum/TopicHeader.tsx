import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { UserBadge } from "@/components/profile/UserBadge";

interface TopicHeaderProps {
  topic: {
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
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
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
      <p className="mt-4">{topic.content}</p>
    </div>
  );
};