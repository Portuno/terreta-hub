import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface EventActionsProps {
  eventId: string;
  eventTitle: string;
  isAdmin: boolean;
}

export const EventActions = ({ eventId, eventTitle, isAdmin }: EventActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteEvent = async () => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Evento eliminado correctamente",
      });
      navigate("/eventos");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDeleteDialogOpen(true)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar el evento "{eventTitle}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm-delete"
                checked={confirmDelete}
                onCheckedChange={(checked) => setConfirmDelete(checked as boolean)}
              />
              <Label htmlFor="confirm-delete">
                Confirmo que quiero eliminar este evento permanentemente
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setConfirmDelete(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              disabled={!confirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};