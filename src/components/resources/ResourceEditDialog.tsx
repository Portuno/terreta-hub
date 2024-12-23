import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResourceEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resource: any;
  onResourceUpdated: () => void;
}

export const ResourceEditDialog = ({
  isOpen,
  onOpenChange,
  resource,
  onResourceUpdated,
}: ResourceEditDialogProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(resource?.title || "");
  const [description, setDescription] = useState(resource?.description || "");
  const [url, setUrl] = useState(resource?.url || "");

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("resources")
        .update({
          title,
          description,
          url,
        })
        .eq("id", resource.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso actualizado correctamente",
      });
      onResourceUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating resource:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el recurso",
        variant: "destructive",
      });
    }
  };

  if (!resource) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Recurso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};