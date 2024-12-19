import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { SidebarProvider } from "../components/ui/sidebar";
import { Sidebar } from "../components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResourceDialog } from "@/components/resources/ResourceDialog";
import { ResourcesHeader } from "@/components/resources/ResourcesHeader";
import { ResourceGrid } from "@/components/resources/ResourceGrid";

const Resources = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      return profile?.role;
    },
  });

  const { data: resources, refetch: refetchResources } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*");

      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los recursos",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
  });

  const isAdmin = userRole === "ADMIN";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="pt-16">
          <Sidebar />
          <div className="lg:ml-64">
            <main className="container mx-auto py-8 px-4">
              <div className="animate-fade-in">
                <ResourcesHeader 
                  isAdmin={isAdmin} 
                  onCreateClick={() => setIsCreateDialogOpen(true)} 
                />
                
                <ResourceGrid
                  resources={resources || []}
                  isAdmin={isAdmin}
                  onResourceDeleted={refetchResources}
                />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>

      <ResourceDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onResourceCreated={refetchResources}
      />
    </div>
  );
};

export default Resources;