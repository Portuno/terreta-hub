import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CommentFormProps {
  newComment: string;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}

export const CommentForm = ({ newComment, onCommentChange, onSubmit }: CommentFormProps) => {
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const { data: users } = useQuery({
    queryKey: ["users", mentionSearch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .ilike("username", `${mentionSearch}%`)
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: mentionSearch.length > 0,
  });

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setCursorPosition(position);

    // Buscar si estamos escribiendo una mención
    const lastAtSymbol = value.lastIndexOf("@", position);
    if (lastAtSymbol !== -1) {
      const textAfterAt = value.slice(lastAtSymbol + 1, position);
      if (!textAfterAt.includes(" ")) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
        onCommentChange(value);
        return;
      }
    }

    setShowMentions(false);
    onCommentChange(value);
  };

  const insertMention = (username: string) => {
    const beforeMention = newComment.slice(0, cursorPosition - mentionSearch.length - 1);
    const afterMention = newComment.slice(cursorPosition);
    const newValue = `${beforeMention}@${username} ${afterMention}`;
    onCommentChange(newValue);
    setShowMentions(false);
    setMentionSearch("");
  };

  return (
    <div className="mt-6 relative">
      <Textarea
        placeholder="Escribe tu comentario..."
        value={newComment}
        onChange={handleTextareaChange}
        rows={3}
      />
      {showMentions && users && users.length > 0 && (
        <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border p-2">
          {users.map((user) => (
            <div
              key={user.username}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => insertMention(user.username)}
            >
              @{user.username}
            </div>
          ))}
        </div>
      )}
      <Button onClick={onSubmit} className="mt-2">
        Comentar
      </Button>
    </div>
  );
};