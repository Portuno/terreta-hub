import { User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";

interface UserMenuProps {
  username: string;
  onLogout: () => Promise<void>;
}

export const UserMenu = ({ username, onLogout }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10">
              {username ? username.substring(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem asChild>
          <Link to={`/perfil/${username}`} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Ver Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/configuraciones" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuraciones</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onLogout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};