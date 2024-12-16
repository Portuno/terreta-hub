import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { PublicProfile } from "@/components/profile/PublicProfile";
import { PrivateProfile } from "@/components/profile/PrivateProfile";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Profile = () => {
  const { username } = useParams();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    getSession();
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Perfil no encontrado</h1>
            <p className="text-gray-600 mt-2">
              El usuario que buscas no existe o ha sido eliminado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === profile.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 container mx-auto px-4 py-8">
        {isOwnProfile ? (
          <PrivateProfile profile={profile} />
        ) : (
          <PublicProfile profile={profile} />
        )}
      </div>
    </div>
  );
};

export default Profile;