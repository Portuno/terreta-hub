import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tag, Tags } from "lucide-react";

const Forum = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: topics, refetch } = useQuery({
    queryKey: ['forum-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_topics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const availableTags = [
    "Derecho", "Finanzas", "Tecnología", "Salud", "Comunidad", "Arte"
  ];

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para crear un tema",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("forum_topics").insert({
        title,
        content,
        user_id: user.id,
        media_urls: [],
      });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Tu tema ha sido creado",
      });

      setIsOpen(false);
      setTitle("");
      setContent("");
      setSelectedTags([]);
      refetch();
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el tema",
        variant: "destructive",
      });
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Foro</h1>
              <Button onClick={() => setIsOpen(true)}>
                Nueva Pregunta
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              {topics && topics.length > 0 ? (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <div key={topic.id} className="border-b pb-4">
                      <h3 className="text-lg font-semibold">{topic.title}</h3>
                      <p className="text-gray-600 mt-2">{topic.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay discusiones en el foro en este momento.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nueva Pregunta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                placeholder="Escribe el título de tu pregunta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido</label>
              <Textarea
                placeholder="Describe tu pregunta en detalle"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tags className="h-4 w-4" />
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Publicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forum;