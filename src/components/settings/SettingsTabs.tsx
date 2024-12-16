import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "./ProfileSettings";
import { NotificationSettings } from "./NotificationSettings";
import { PrivacySettings } from "./PrivacySettings";
import { SecuritySettings } from "./SecuritySettings";

export const SettingsTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="profile" className="flex-1">
          Perfil
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex-1">
          Notificaciones
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex-1">
          Privacidad
        </TabsTrigger>
        <TabsTrigger value="security" className="flex-1">
          Seguridad
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileSettings />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>
      <TabsContent value="privacy">
        <PrivacySettings />
      </TabsContent>
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  );
};