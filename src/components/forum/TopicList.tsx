import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { CommentVotes } from "@/components/products/CommentVotes";

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
                <div>
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
                    <span>
                      por {topic.profile?.username}
                    </span>
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
