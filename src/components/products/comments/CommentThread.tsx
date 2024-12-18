import { SingleComment } from "../SingleComment";

interface Comment {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  parent_id: string | null;
  depth: number;
  profile: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommentThreadProps {
  comment: Comment;
  replies: Comment[];
  onVote: (commentId: string, voteType: boolean) => void;
  onReply: (commentId: string, content: string) => void;
  onReport: (commentId: string, reason: string) => void;
  sortComments: (comments: Comment[]) => Comment[];
}

export const CommentThread = ({
  comment,
  replies,
  onVote,
  onReply,
  onReport,
  sortComments,
}: CommentThreadProps) => {
  return (
    <div key={comment.id} className="space-y-4">
      <SingleComment
        comment={comment}
        onVote={onVote}
        onReply={onReply}
        onReport={onReport}
        depth={comment.depth}
      />
      {replies.length > 0 && (
        <div className="space-y-4 ml-6 border-l-2 border-gray-100 pl-4">
          {sortComments(replies).map((reply) => (
            <SingleComment
              key={reply.id}
              comment={reply}
              onVote={onVote}
              onReply={onReply}
              onReport={onReport}
              depth={reply.depth}
            />
          ))}
        </div>
      )}
    </div>
  );
};