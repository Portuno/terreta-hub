import { Button } from "@/components/ui/button";

interface CommentSorterProps {
  commentSort: "upvotes" | "downvotes" | "recent";
  setCommentSort: (sort: "upvotes" | "downvotes" | "recent") => void;
}

export const CommentSorter = ({ commentSort, setCommentSort }: CommentSorterProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={commentSort === "upvotes" ? "default" : "outline"}
        size="sm"
        onClick={() => setCommentSort("upvotes")}
      >
        Más votados
      </Button>
      <Button
        variant={commentSort === "downvotes" ? "default" : "outline"}
        size="sm"
        onClick={() => setCommentSort("downvotes")}
      >
        Menos votados
      </Button>
      <Button
        variant={commentSort === "recent" ? "default" : "outline"}
        size="sm"
        onClick={() => setCommentSort("recent")}
      >
        Recientes
      </Button>
    </div>
  );
};