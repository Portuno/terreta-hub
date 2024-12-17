import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentVotesProps {
  upvotes: number;
  downvotes: number;
  userVote?: boolean | null;
  onVote: (voteType: boolean) => void;
}

export const CommentVotes = ({ upvotes, downvotes, userVote, onVote }: CommentVotesProps) => {
  const voteBalance = upvotes - downvotes;
  
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