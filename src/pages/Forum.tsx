import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tag, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const availableTags = [
  "General",
  "Tecnología",
  "Negocios",
  "Marketing",
  "Diseño",
  "Desarrollo",
  "Emprendimiento",
];

const Forum = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const { toast } = useToast();

  const { data: topics, refetch } = useQuery({
    queryKey: ['forum-topics', timeFilter],
    queryFn: async () => {
      let query = supabase
        .from('forum_topics')
        .select(`
          *,
          profile:profiles(username)
        `);

      // Apply time filter
      if (timeFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (timeFilter) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Foro</h1>
              <Button onClick={() => setIsOpen(true)}>
                Nuevo Debate
              </Button>
            </div>

            <div className="flex gap-4 mb-6">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tiempos</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              {topics && topics.length > 0 ? (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <Link 
                      to={`/foro/${topic.id}`} 
                      key={topic.id} 
                      className="block border-b pb-4 hover:bg-gray-50 p-4 rounded-lg transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{topic.title}</h3>
                          <p className="text-gray-600 mt-2">{topic.content}</p>
                          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {topic.replies || 0} comentarios
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {topic.upvotes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsDown className="h-4 w-4" />
                              {topic.downvotes || 0}
                            </span>
                            <span>
                              por {topic.profile?.username}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
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
            <DialogTitle>Nuevo Debate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                placeholder="Escribe el título de tu debate"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido</label>
              <Textarea
                placeholder="Describe tu debate en detalle"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
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