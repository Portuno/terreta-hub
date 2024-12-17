import { Button } from "@/components/ui/button";

interface ForumHeaderProps {
  onNewTopic: () => void;
}

export const ForumHeader = ({ onNewTopic }: ForumHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold text-foreground">Foro</h1>
      <Button onClick={onNewTopic}>
        Nuevo Debate
      </Button>
    </div>
  );
};