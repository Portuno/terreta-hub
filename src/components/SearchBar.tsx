import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useToast } from "./ui/use-toast";

interface SearchResult {
  type: "user" | "product" | "resource" | "forum";
  id: string;
  title?: string;
  username?: string;
  description?: string;
  category?: string;
}

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      try {
        // Búsqueda de usuarios
        const { data: users } = await supabase
          .from("profiles")
          .select("id, username")
          .ilike("username", `%${searchQuery}%`)
          .limit(3);

        // Búsqueda de productos
        const { data: products } = await supabase
          .from("products")
          .select("id, title, description")
          .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
          .limit(3);

        // Búsqueda de recursos
        const { data: resources } = await supabase
          .from("resources")
          .select("id, title, description, category")
          .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
          .limit(3);

        // Búsqueda de temas del foro
        const { data: forumTopics } = await supabase
          .from("forum_topics")
          .select("id, title, content")
          .or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`)
          .limit(3);

        const results: SearchResult[] = [
          ...(users?.map(user => ({
            type: "user" as const,
            id: user.id,
            username: user.username,
          })) || []),
          ...(products?.map(product => ({
            type: "product" as const,
            id: product.id,
            title: product.title,
            description: product.description,
          })) || []),
          ...(resources?.map(resource => ({
            type: "resource" as const,
            id: resource.id,
            title: resource.title,
            description: resource.description,
            category: resource.category,
          })) || []),
          ...(forumTopics?.map(topic => ({
            type: "forum" as const,
            id: topic.id,
            title: topic.title,
            description: topic.content,
          })) || []),
        ];

        return results;
      } catch (error) {
        console.error("Error searching:", error);
        toast({
          title: "Error",
          description: "No se pudo realizar la búsqueda",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: searchQuery.length > 2,
  });

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    switch (result.type) {
      case "user":
        navigate(`/perfil/${result.username}`);
        break;
      case "product":
        navigate(`/productos/${result.id}`);
        break;
      case "resource":
        navigate(`/recursos?category=${result.category}`);
        break;
      case "forum":
        navigate(`/foro/${result.id}`);
        break;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full md:w-[300px] flex items-center"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="search"
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
          readOnly
        />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput 
            placeholder="Buscar usuarios, productos, recursos o debates..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            {isLoading && (
              <div className="p-4 text-center text-sm text-gray-500">
                Buscando...
              </div>
            )}
            {searchResults && searchResults.length > 0 && (
              <>
                <CommandGroup heading="Usuarios">
                  {searchResults
                    .filter((result) => result.type === "user")
                    .map((result) => (
                      <CommandItem
                        key={`${result.type}-${result.id}`}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {result.username?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{result.username}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>

                <CommandGroup heading="Productos">
                  {searchResults
                    .filter((result) => result.type === "product")
                    .map((result) => (
                      <CommandItem
                        key={`${result.type}-${result.id}`}
                        onSelect={() => handleSelect(result)}
                      >
                        {result.title}
                      </CommandItem>
                    ))}
                </CommandGroup>

                <CommandGroup heading="Recursos">
                  {searchResults
                    .filter((result) => result.type === "resource")
                    .map((result) => (
                      <CommandItem
                        key={`${result.type}-${result.id}`}
                        onSelect={() => handleSelect(result)}
                      >
                        {result.title}
                      </CommandItem>
                    ))}
                </CommandGroup>

                <CommandGroup heading="Foro">
                  {searchResults
                    .filter((result) => result.type === "forum")
                    .map((result) => (
                      <CommandItem
                        key={`${result.type}-${result.id}`}
                        onSelect={() => handleSelect(result)}
                      >
                        {result.title}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};