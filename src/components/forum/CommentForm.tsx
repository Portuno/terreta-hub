import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  newComment: string;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}

export const CommentForm = ({ newComment, onCommentChange, onSubmit }: CommentFormProps) => {
  return (
    <div className="mt-6">
      <Textarea
        placeholder="Escribe tu comentario..."
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        rows={3}
      />
      <Button onClick={onSubmit} className="mt-2">
        Comentar
      </Button>
    </div>
  );
};