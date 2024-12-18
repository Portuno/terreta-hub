import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { SidebarProvider } from "../components/ui/sidebar";
import { Sidebar } from "../components/Sidebar";
import { BookOpen, GraduationCap, Link, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResourceDialog } from "@/components/resources/ResourceDialog";
import { ResourceList } from "@/components/resources/ResourceList";

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
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-4xl font-bold text-foreground">Recursos</h1>
                  {isAdmin && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Recurso
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ResourceList
                    category="guide"
                    icon={<BookOpen className="w-6 h-6 text-primary" />}
                    title="Guías"
                    resources={resources || []}
                    isAdmin={isAdmin}
                    onResourceDeleted={refetchResources}
                  />

                  <ResourceList
                    category="course"
                    icon={<GraduationCap className="w-6 h-6 text-accent" />}
                    title="Cursos"
                    resources={resources || []}
                    isAdmin={isAdmin}
                    onResourceDeleted={refetchResources}
                  />

                  <ResourceList
                    category="link"
                    icon={<Link className="w-6 h-6 text-primary" />}
                    title="Enlaces Útiles"
                    resources={resources || []}
                    isAdmin={isAdmin}
                    onResourceDeleted={refetchResources}
                  />
                </div>
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