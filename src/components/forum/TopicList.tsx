import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { CommentVotes } from "@/components/products/CommentVotes";
import { UserBadge } from "@/components/profile/UserBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopicListProps {
  topics: any[];
}

export const TopicList = ({ topics }: TopicListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {topics && topics.length > 0 ? (
        <div className="space-y-4">
          {topics.map((topic) => (
            <Link 
              to={`/foro/${topic.id}`} 
              key={topic.id} 
              className="block border-b pb-4 hover:bg-gray-50 p-4 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{topic.title}</h3>
                  <p className="text-gray-600 mt-2">{topic.content}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {topic.replies || 0} comentarios
                    </span>
                    <CommentVotes
                      commentId={topic.id}
                      upvotes={topic.upvotes || 0}
                      downvotes={topic.downvotes || 0}
                      type="forum_comment"
                      onVote={(voteType) => {
                        // Handle vote logic here
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={topic.profile?.avatar_url} />
                        <AvatarFallback>
                          {topic.profile?.username?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{topic.profile?.username}</span>
                      {topic.profile?.reputation !== undefined && (
                        <UserBadge reputation={topic.profile.reputation} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No hay discusiones en el foro en este momento.
        </p>
      )}
    </div>
  );
};