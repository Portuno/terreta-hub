import { Loader2 } from "lucide-react";
import { CommentThread } from "./CommentThread";

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

interface CommentListProps {
  comments: Comment[] | null;
  isLoading: boolean;
  onVote: (commentId: string, voteType: boolean) => void;
  onReply: (commentId: string, content: string) => void;
  commentSort: "upvotes" | "downvotes" | "recent";
}

export const CommentList = ({
  comments,
  isLoading,
  onVote,
  onReply,
  commentSort,
}: CommentListProps) => {
  const sortComments = (comments: Comment[]) => {
    switch (commentSort) {
      case "upvotes":
        return comments.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case "downvotes":
        return comments.sort((a, b) => (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes));
      case "recent":
      default:
        return comments;
    }
  };

  const organizeComments = (commentsArray: Comment[]) => {
    const topLevelComments = commentsArray.filter(comment => !comment.parent_id);
    const commentsByParentId = commentsArray.reduce((acc, comment) => {
      if (comment.parent_id) {
        acc[comment.parent_id] = [...(acc[comment.parent_id] || []), comment];
      }
      return acc;
    }, {} as Record<string, Comment[]>);

    return sortComments(topLevelComments).map(comment => (
      <CommentThread
        key={comment.id}
        comment={comment}
        replies={commentsByParentId[comment.id] || []}
        onVote={onVote}
        onReply={onReply}
        sortComments={sortComments}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay comentarios aún. ¡Sé el primero en comentar!
      </p>
    );
  }

  return <div className="space-y-6">{organizeComments(comments)}</div>;
};