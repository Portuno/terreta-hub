import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface ResourceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceCreated: () => void;
}

export const ResourceDialog = ({ isOpen, onOpenChange, onResourceCreated }: ResourceDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("guide");
  const { toast } = useToast();

  const handleCreateResource = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("resources")
        .insert({
          title,
          description,
          category,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso creado correctamente",
      });
      onOpenChange(false);
      onResourceCreated();
      setTitle("");
      setDescription("");
      setCategory("guide");
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el recurso",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Recurso</DialogTitle>
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
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="guide">Guía</option>
              <option value="course">Curso</option>
              <option value="link">Enlace Útil</option>
            </select>
          </div>
          <Button onClick={handleCreateResource} className="w-full">
            Crear Recurso
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};