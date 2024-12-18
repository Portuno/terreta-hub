import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoteSubscription } from "@/hooks/useVoteSubscription";

interface CommentVotesProps {
  commentId: string;
  upvotes: number;
  downvotes: number;
  userVote?: boolean | null;
  onVote: (voteType: boolean) => void;
  type: 'forum_comment' | 'product_comment';
}

export const CommentVotes = ({ 
  commentId, 
  upvotes, 
  downvotes, 
  userVote, 
  onVote,
  type 
}: CommentVotesProps) => {
  const voteBalance = upvotes - downvotes;
  
  // Subscribe to vote changes
  useVoteSubscription(type, commentId);
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote(true)}
        className={userVote === true ? "text-green-600" : ""}
      >
        <ArrowUp size={16} />
      </Button>
      <span className={`text-sm font-medium ${voteBalance > 0 ? 'text-green-600' : voteBalance < 0 ? 'text-red-600' : ''}`}>
        {voteBalance}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote(false)}
        className={userVote === false ? "text-red-600" : ""}
      >
        <ArrowDown size={16} />
      </Button>
    </div>
  );
};