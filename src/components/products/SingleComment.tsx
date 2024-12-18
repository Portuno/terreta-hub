import { Link } from "react-router-dom";
import { MessageSquare, Share2, Flag, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CommentVotes } from "./CommentVotes";
import { CommentForm } from "./CommentForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  onReport?: (commentId: string, reason: string) => void;
  depth?: number;
  type?: 'forum_comment' | 'product_comment';
}

export const SingleComment = ({ 
  comment, 
  userVote,
  onVote,
  onReply,
  onReport,
  depth = 0,
  type = 'product_comment'
}: SingleCommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href + `#comment-${comment.id}`);
      toast({
        description: "Enlace copiado al portapapeles",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error al copiar el enlace",
      });
    }
  };

  const handleReport = () => {
    if (onReport) {
      onReport(comment.id, "contenido inapropiado");
      setShowReportDialog(false);
      toast({
        description: "Gracias por reportar. Revisaremos el contenido.",
      });
    }
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className="border rounded-lg p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ marginLeft: `${depth * 2}rem` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-primary/10">
            <AvatarImage
              src={comment.profile?.avatar_url || undefined}
              alt={comment.profile?.username}
            />
            <AvatarFallback>
              {comment.profile?.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <Link
              to={`/perfil/${comment.profile?.username}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {comment.profile?.username}
            </Link>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </p>
          </div>
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

      <div className="pl-11">
        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
      </div>

      <div className="pl-11 flex items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
          className="text-gray-500 hover:text-primary"
        >
          <MessageSquare size={16} className="mr-1" />
          Responder
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-gray-500 hover:text-primary"
        >
          <Share2 size={16} className="mr-1" />
          Compartir
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReportDialog(true)}
          className="text-gray-500 hover:text-destructive"
        >
          <Flag size={16} className="mr-1" />
          Reportar
        </Button>
      </div>

      {isReplying && (
        <div className="pl-11">
          <CommentForm
            onSubmit={(content) => {
              onReply(comment.id, content);
              setIsReplying(false);
            }}
            onCancel={() => setIsReplying(false)}
            placeholder="Escribe tu respuesta..."
            buttonText="Responder"
          />
        </div>
      )}

      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reportar comentario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres reportar este comentario? Esta acción notificará a los moderadores para su revisión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReport}>Reportar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};