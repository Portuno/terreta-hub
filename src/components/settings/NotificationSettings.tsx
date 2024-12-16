import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("notification_settings")
          .eq("id", session.user.id)
          .single();
        setSettings(data?.notification_settings);
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
        .update({ notification_settings: settings })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Configuración actualizada",
        description: "Tus preferencias de notificación han sido guardadas.",
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
              <Label htmlFor="product_comments">
                Comentarios en productos
              </Label>
              <Switch
                id="product_comments"
                checked={settings.product_comments}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, product_comments: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="forum_replies">
                Respuestas en el foro
              </Label>
              <Switch
                id="forum_replies"
                checked={settings.forum_replies}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, forum_replies: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="event_reminders">
                Recordatorios de eventos
              </Label>
              <Switch
                id="event_reminders"
                checked={settings.event_reminders}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, event_reminders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="poll_reminders">
                Recordatorios de encuestas
              </Label>
              <Switch
                id="poll_reminders"
                checked={settings.poll_reminders}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, poll_reminders: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frecuencia de notificaciones</Label>
            <Select
              value={settings.notification_frequency}
              onValueChange={(value) =>
                setSettings({ ...settings, notification_frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Tiempo real</SelectItem>
                <SelectItem value="daily">Resumen diario</SelectItem>
                <SelectItem value="weekly">Resumen semanal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Canal de notificación</Label>
            <Select
              value={settings.notification_channel}
              onValueChange={(value) =>
                setSettings({ ...settings, notification_channel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="in-app">En la aplicación</SelectItem>
              </SelectContent>
            </Select>
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