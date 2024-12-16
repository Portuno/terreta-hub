import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContributions } from "./UserContributions";
import { UserActivity } from "./UserActivity";
import { UserAchievements } from "./UserAchievements";

interface PublicProfileProps {
  profile: any;
}

export const PublicProfile = ({ profile }: PublicProfileProps) => {
  const { username, bio, avatar_url, interests, location } = profile;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Header */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-32 w-32 mx-auto">
                <AvatarImage src={avatar_url} alt={username} />
                <AvatarFallback>
                  {username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{username}</CardTitle>
              {location && (
                <p className="text-sm text-muted-foreground">{location}</p>
              )}
            </CardHeader>
            <CardContent>
              {bio && <p className="text-sm text-center mb-4">{bio}</p>}
              {interests && interests.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {interests.map((interest: string) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="flex-1">
          <Tabs defaultValue="contributions" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="contributions" className="flex-1">
                Contribuciones
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">
                Actividad
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1">
                Logros
              </TabsTrigger>
            </TabsList>
            <TabsContent value="contributions">
              <UserContributions userId={profile.id} />
            </TabsContent>
            <TabsContent value="activity">
              <UserActivity userId={profile.id} />
            </TabsContent>
            <TabsContent value="achievements">
              <UserAchievements achievements={profile.achievements} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};