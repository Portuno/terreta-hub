import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourcesHeaderProps {
  isAdmin: boolean;
  onCreateClick: () => void;
}

export const ResourcesHeader = ({ isAdmin, onCreateClick }: ResourcesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold text-foreground">Recursos</h1>
      {isAdmin && (
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Recurso
        </Button>
      )}
    </div>
  );
};