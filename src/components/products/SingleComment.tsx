import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentVotes } from "./CommentVotes";
import { CommentForm } from "./CommentForm";
import { useState } from "react";

interface SingleCommentProps {
  comment: {
    id: string;
    content: string;
    upvotes: number;
    downvotes: number;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
  userVote?: boolean | null;
  onVote: (commentId: string, voteType: boolean) => void;
  onReply: (commentId: string, content: string) => void;
  depth?: number;
  type?: 'forum_comment' | 'product_comment';
}

export const SingleComment = ({ 
  comment, 
  userVote,
  onVote,
  onReply,
  depth = 0,
  type = 'product_comment'
}: SingleCommentProps) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div
      className="border rounded-lg p-4 space-y-2"
      style={{ marginLeft: `${depth * 2}rem` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.profile?.avatar_url || undefined}
              alt={comment.profile?.username}
            />
            <AvatarFallback>
              {comment.profile?.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            to={`/perfil/${comment.profile?.username}`}
            className="font-medium hover:underline"
          >
            {comment.profile?.username}
          </Link>
        </div>
        <CommentVotes
          commentId={comment.id}
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          userVote={userVote}
          onVote={(voteType) => onVote(comment.id, voteType)}
          type={type}
        />
      </div>
      <p className="text-gray-600">{comment.content}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
        >
          <MessageSquare size={16} className="mr-1" />
          Responder
        </Button>
      </div>
      {isReplying && (
        <CommentForm
          onSubmit={(content) => {
            onReply(comment.id, content);
            setIsReplying(false);
          }}
          onCancel={() => setIsReplying(false)}
          placeholder="Escribe tu respuesta..."
          buttonText="Responder"
        />
      )}
    </div>
  );
};