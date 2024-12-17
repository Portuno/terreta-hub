import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          location: profile.location,
          website_url: profile.website_url,
          social_links: profile.social_links,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Nombre para mostrar</Label>
            <Input
              id="display_name"
              value={profile.display_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={profile.location || ""}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              placeholder="Ej: Valencia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio web</Label>
            <Input
              id="website"
              type="url"
              value={profile.website_url || ""}
              onChange={(e) =>
                setProfile({ ...profile, website_url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-4">
            <Label>Redes sociales</Label>
            {Object.entries(profile.social_links || {}).map(([platform, url]) => (
              <div key={platform} className="space-y-2">
                <Label htmlFor={platform} className="capitalize">
                  {platform}
                </Label>
                <Input
                  id={platform}
                  value={url as string || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: {
                        ...profile.social_links,
                        [platform]: e.target.value,
                      },
                    })
                  }
                  placeholder={`URL de ${platform}`}
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};