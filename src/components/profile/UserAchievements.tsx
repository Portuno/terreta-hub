import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface UserAchievementsProps {
  achievements: any[];
}

export const UserAchievements = ({ achievements }: UserAchievementsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Logros</h3>
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted"
              >
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay logros desbloqueados aún.
          </p>
        )}
      </CardContent>
    </Card>
  );
};