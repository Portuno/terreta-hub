import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  url?: string;
  instructor?: string;
  course_syllabus?: string;
  content_format?: string;
  duration?: string;
  resource_type: string;
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
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

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

  const handleResourceClick = (resource: Resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else {
      setSelectedResource(resource);
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
        {resources.filter(resource => resource.title && resource.resource_type === category).map((resource) => (
          <li key={resource.id} className="group flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <button
              onClick={() => handleResourceClick(resource)}
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
                onClick={() => handleDeleteResource(resource.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </li>
        ))}
      </ul>

      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">{selectedResource?.description}</p>
            
            {selectedResource?.resource_type === 'course' && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Instructor</h3>
                  <p>{selectedResource.instructor}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Programa del Curso</h3>
                  <p className="whitespace-pre-line">{selectedResource.course_syllabus}</p>
                </div>
              </>
            )}

            {selectedResource?.resource_type === 'guide' && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Formato</h3>
                  <p className="capitalize">{selectedResource.content_format}</p>
                </div>
                {selectedResource.duration && (
                  <div>
                    <h3 className="font-semibold mb-2">Duración</h3>
                    <p>{selectedResource.duration}</p>
                  </div>
                )}
                {selectedResource.url && (
                  <Button
                    onClick={() => window.open(selectedResource.url, '_blank')}
                    className="w-full"
                  >
                    Acceder al Contenido
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};