import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResourceItem } from "./ResourceItem";
import { DeleteResourceDialog } from "./DeleteResourceDialog";
import { ResourceDetailsDialog } from "./ResourceDetailsDialog";
import { ResourceEditDialog } from "./ResourceEditDialog";

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
  user_id: string;
}

interface ResourceListProps {
  category: string;
  icon: React.ReactNode;
  title: string;
  resources: Resource[];
  isAdmin: boolean;
  onResourceDeleted: () => void;
}

export const ResourceList = ({ 
  category, 
  icon, 
  title, 
  resources, 
  isAdmin, 
  onResourceDeleted 
}: ResourceListProps) => {
  const { toast } = useToast();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteResource = async () => {
    if (!resourceToDelete) return;

    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", resourceToDelete.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso eliminado correctamente",
      });
      onResourceDeleted();
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
      setConfirmDelete(false);
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
      let urlToOpen = resource.url;
      if (!urlToOpen.startsWith('http://') && !urlToOpen.startsWith('https://')) {
        urlToOpen = 'https://' + urlToOpen;
      }
      window.open(urlToOpen, '_blank');
    } else {
      setSelectedResource(resource);
    }
  };

  const openDeleteDialog = (resource: Resource) => {
    setResourceToDelete(resource);
    setDeleteDialogOpen(true);
    setConfirmDelete(false);
  };

  const openEditDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setEditDialogOpen(true);
  };

  const filteredResources = resources.filter(
    resource => resource.title && resource.resource_type === category
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <ul className="space-y-3">
        {filteredResources.map((resource) => (
          <ResourceItem
            key={resource.id}
            resource={resource}
            isAdmin={isAdmin}
            onResourceClick={handleResourceClick}
            onDeleteClick={openDeleteDialog}
            onEditClick={openEditDialog}
          />
        ))}
      </ul>

      <ResourceDetailsDialog
        resource={selectedResource}
        onOpenChange={() => setSelectedResource(null)}
      />

      <DeleteResourceDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        resourceToDelete={resourceToDelete}
        confirmDelete={confirmDelete}
        onConfirmChange={setConfirmDelete}
        onDelete={handleDeleteResource}
      />

      <ResourceEditDialog
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        resource={selectedResource}
        onResourceUpdated={onResourceDeleted}
      />
    </div>
  );
};