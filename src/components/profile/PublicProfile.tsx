import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContributions } from "./UserContributions";
import { UserActivity } from "./UserActivity";
import { UserAchievements } from "./UserAchievements";
import { UserBadge } from "./UserBadge";
import { Globe, Twitter, Youtube, Instagram, Linkedin, Github } from "lucide-react";

interface PublicProfileProps {
  profile: any;
}

export const PublicProfile = ({ profile }: PublicProfileProps) => {
  const { 
    username, 
    display_name,
    bio, 
    avatar_url, 
    interests, 
    location,
    website_url,
    social_links,
    reputation = 0
  } = profile;

  const socialIcons = {
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
    linkedin: Linkedin,
    github: Github,
  };

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
              <div className="space-y-2">
                <CardTitle>{display_name || username}</CardTitle>
                <p className="text-sm text-muted-foreground">@{username}</p>
                <div className="flex justify-center">
                  <UserBadge reputation={reputation} />
                </div>
                {location && (
                  <p className="text-sm text-muted-foreground">{location}</p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {bio && <p className="text-sm text-center mb-4">{bio}</p>}
              
              {/* Links */}
              <div className="flex flex-col gap-2 mb-4">
                {website_url && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Sitio web
                    </a>
                  </Button>
                )}
                
                {Object.entries(social_links || {}).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform as keyof typeof socialIcons];
                  return (
                    <Button key={platform} variant="outline" className="w-full" asChild>
                      <a href={url as string} target="_blank" rel="noopener noreferrer">
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    </Button>
                  );
                })}
              </div>

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