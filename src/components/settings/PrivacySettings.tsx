import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const PrivacySettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("visibility_settings")
          .eq("id", session.user.id)
          .single();
        setSettings(data?.visibility_settings);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("No session found");

      const { error } = await supabase
        .from("profiles")
        .update({ visibility_settings: settings })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Configuración actualizada",
        description: "Tus preferencias de privacidad han sido guardadas.",
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

  if (!settings) {
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show_interests">
                Mostrar intereses
              </Label>
              <Switch
                id="show_interests"
                checked={settings.show_interests}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, show_interests: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show_polls">
                Mostrar historial de encuestas
              </Label>
              <Switch
                id="show_polls"
                checked={settings.show_polls}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, show_polls: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show_events">
                Mostrar eventos asistidos
              </Label>
              <Switch
                id="show_events"
                checked={settings.show_events}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, show_events: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_private">
                Perfil privado
              </Label>
              <Switch
                id="is_private"
                checked={settings.is_private}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, is_private: checked })
                }
              />
            </div>
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