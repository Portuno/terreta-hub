import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserBadgeProps {
  reputation: number;
}

export const UserBadge = ({ reputation }: UserBadgeProps) => {
  const getBadgeInfo = () => {
    if (reputation >= 1000) {
      return {
        icon: Trophy,
        label: "Experto",
        color: "bg-yellow-500",
        description: "Usuario con más de 1000 puntos de reputación"
      };
    } else if (reputation >= 500) {
      return {
        icon: Award,
        label: "Veterano",
        color: "bg-blue-500",
        description: "Usuario con más de 500 puntos de reputación"
      };
    } else if (reputation >= 100) {
      return {
        icon: Star,
        label: "Contribuidor",
        color: "bg-green-500",
        description: "Usuario con más de 100 puntos de reputación"
      };
    } else {
      return {
        icon: Shield,
        label: "Miembro",
        color: "bg-gray-500",
        description: "Miembro de la comunidad"
      };
    }
  };

  const badgeInfo = getBadgeInfo();
  const Icon = badgeInfo.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            className={`flex items-center gap-1 ${badgeInfo.color} hover:${badgeInfo.color}/90`}
          >
            <Icon className="h-3 w-3" />
            {badgeInfo.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{badgeInfo.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {reputation} puntos de reputación
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};