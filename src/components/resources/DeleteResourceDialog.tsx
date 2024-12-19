import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DeleteResourceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resourceToDelete: any | null;
  confirmDelete: boolean;
  onConfirmChange: (checked: boolean) => void;
  onDelete: () => void;
}

export const DeleteResourceDialog = ({
  isOpen,
  onOpenChange,
  resourceToDelete,
  confirmDelete,
  onConfirmChange,
  onDelete,
}: DeleteResourceDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            ¿Estás seguro de que deseas eliminar el recurso "{resourceToDelete?.title}"? Esta acción no se puede deshacer.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm-delete"
              checked={confirmDelete}
              onCheckedChange={(checked) => onConfirmChange(checked as boolean)}
            />
            <Label htmlFor="confirm-delete">
              Confirmo que quiero eliminar este recurso permanentemente
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={!confirmDelete}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};