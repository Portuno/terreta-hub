import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { SidebarProvider } from "../components/ui/sidebar";
import { Sidebar } from "../components/Sidebar";
import { ResourceDialog } from "@/components/resources/ResourceDialog";
import { ResourcesHeader } from "@/components/resources/ResourcesHeader";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { useResources } from "@/hooks/useResources";
import { useUserRole } from "@/hooks/useUserRole";

const Resources = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: userRole } = useUserRole();
  const { data: resources, refetch: refetchResources } = useResources();

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