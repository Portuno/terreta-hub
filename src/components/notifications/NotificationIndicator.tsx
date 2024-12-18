import { useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  content: string;
  link: string;
  read: boolean;
  created_at: string;
  type: string;
}

export const NotificationIndicator = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { toast } = useToast();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("read", false)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Notification[];
    },
  });

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("read", false);

      if (error) throw error;

      toast({
        title: "Notificaciones marcadas como leídas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones como leídas",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Notificaciones</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Marcar todo como leído
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.link}
                    className="block p-2 hover:bg-gray-50 rounded-md"
                    onClick={() => setShowDropdown(false)}
                  >
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.content}</p>
                  </Link>
                ))}
                <Link
                  to="/notificaciones"
                  className="block text-center text-sm text-primary hover:text-primary-dark mt-2 py-2"
                  onClick={() => setShowDropdown(false)}
                >
                  Ver todas
                </Link>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No hay notificaciones nuevas
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};