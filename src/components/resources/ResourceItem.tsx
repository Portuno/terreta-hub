import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Edit } from "lucide-react";

interface ResourceItemProps {
  resource: {
    id: string;
    title: string;
    url?: string;
  };
  isAdmin: boolean;
  onResourceClick: (resource: any) => void;
  onDeleteClick: (resource: any) => void;
  onEditClick: (resource: any) => void;
}

export const ResourceItem = ({ 
  resource, 
  isAdmin, 
  onResourceClick, 
  onDeleteClick,
  onEditClick 
}: ResourceItemProps) => {
  return (
    <li className="group flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
      <button
        onClick={() => onResourceClick(resource)}
        className="flex-grow text-left flex items-center gap-2 hover:text-primary"
      >
        <span>{resource.title}</span>
        {resource.url && (
          <ExternalLink className="w-4 h-4 inline-block" />
        )}
      </button>
      {isAdmin && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(resource);
            }}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(resource);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )}
    </li>
  );
};