import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { UserBadge } from "@/components/profile/UserBadge";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profile?: {
    username?: string;
    avatar_url?: string;
    reputation?: number;
  };
}

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.profile?.avatar_url}
                  alt={comment.profile?.username}
                />
                <AvatarFallback>
                  {comment.profile?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <Link
                  to={`/perfil/${comment.profile?.username}`}
                  className="font-medium hover:underline"
                >
                  {comment.profile?.username}
                </Link>
                {comment.profile?.reputation !== undefined && (
                  <UserBadge reputation={comment.profile.reputation} />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600">{comment.content}</p>
          <span className="text-xs text-gray-400 mt-2 block">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
};