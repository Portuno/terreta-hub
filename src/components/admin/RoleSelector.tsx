import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RoleSelectorProps {
  userId: string;
  currentRole: string;
}

export const RoleSelector = ({ userId, currentRole }: RoleSelectorProps) => {
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setRole(newRole);
      toast({
        title: "Rol actualizado",
        description: `El rol ha sido actualizado a ${newRole}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol",
        variant: "destructive",
      });
      console.error("Error updating role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={role}
      onValueChange={handleRoleChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NORMAL">Normal</SelectItem>
        <SelectItem value="EVENT_CREATOR">Creador de Eventos</SelectItem>
        <SelectItem value="RESOURCE_CREATOR">Creador de Recursos</SelectItem>
        <SelectItem value="MODERATOR">Moderador</SelectItem>
        <SelectItem value="ADMIN">Administrador</SelectItem>
      </SelectContent>
    </Select>
  );
};