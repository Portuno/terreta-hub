import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";

interface ResourceItemProps {
  resource: {
    id: string;
    title: string;
    url?: string;
  };
  isAdmin: boolean;
  onResourceClick: (resource: any) => void;
  onDeleteClick: (resource: any) => void;
}

export const ResourceItem = ({ resource, isAdmin, onResourceClick, onDeleteClick }: ResourceItemProps) => {
  return (
    <li className="group flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
      <button
        onClick={() => onResourceClick(resource)}
        className="flex-1 text-left flex items-center gap-2 hover:text-primary"
      >
        <span>{resource.title}</span>
        {resource.url && (
          <ExternalLink className="w-4 h-4 inline-block" />
        )}
      </button>
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(resource);
          }}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      )}
    </li>
  );
};