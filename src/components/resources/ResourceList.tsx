import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface Resource {
  id: string;
  title: string;
}

interface ResourceListProps {
  category: string;
  icon: React.ReactNode;
  title: string;
  resources: Resource[];
  isAdmin: boolean;
  onResourceDeleted: () => void;
}

export const ResourceList = ({ category, icon, title, resources, isAdmin, onResourceDeleted }: ResourceListProps) => {
  const { toast } = useToast();

  const handleDeleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso eliminado correctamente",
      });
      onResourceDeleted();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el recurso",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <ul className="space-y-3">
        {resources.filter(resource => resource.title).map((resource) => (
          <li key={resource.id} className="group flex items-center justify-between hover:text-primary cursor-pointer">
            <span>{resource.title}</span>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteResource(resource.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};