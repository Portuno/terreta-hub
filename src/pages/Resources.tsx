import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/ui/sidebar";
import { BookOpen, GraduationCap, Link, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Resources = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("guide");
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

  const isAdmin = userRole === "ADMIN";

  const handleCreateResource = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("resources")
        .insert([
          {
            title,
            description,
            category,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso creado correctamente",
      });
      setIsCreateDialogOpen(false);
      setTitle("");
      setDescription("");
      setCategory("guide");
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el recurso",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el recurso",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <Sidebar />
        <div className="lg:ml-64">
          <main className="container mx-auto py-8 px-4">
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-foreground">Recursos</h1>
                {isAdmin && (
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Recurso
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Recurso</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoría</Label>
                          <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border rounded-md p-2"
                          >
                            <option value="guide">Guía</option>
                            <option value="course">Curso</option>
                            <option value="link">Enlace Útil</option>
                          </select>
                        </div>
                        <Button onClick={handleCreateResource} className="w-full">
                          Crear Recurso
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Guías */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Guías</h2>
                  </div>
                  <ul className="space-y-3">
                    {["Cómo conseguir financiación", "Primeros pasos en startups", "Guía legal básica"].map((guide) => (
                      <li key={guide} className="group flex items-center justify-between hover:text-primary cursor-pointer">
                        <span>{guide}</span>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteResource(guide)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cursos */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-xl font-semibold">Cursos</h2>
                  </div>
                  <ul className="space-y-3">
                    {["Desarrollo Web", "Marketing Digital", "Diseño UX/UI"].map((course) => (
                      <li key={course} className="group flex items-center justify-between hover:text-accent cursor-pointer">
                        <span>{course}</span>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteResource(course)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enlaces Útiles */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Link className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Enlaces Útiles</h2>
                  </div>
                  <ul className="space-y-3">
                    {["Incubadoras", "Aceleradoras", "Grants disponibles"].map((link) => (
                      <li key={link} className="group flex items-center justify-between hover:text-primary cursor-pointer">
                        <span>{link}</span>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteResource(link)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Resources;