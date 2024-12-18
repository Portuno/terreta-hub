import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SearchResults } from "./search/SearchResults";

interface SearchResult {
  type: "user" | "product" | "resource" | "forum";
  id: string;
  title?: string;
  username?: string;
  description?: string;
  category?: string;
}

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      try {
        const [users, products, resources, forumTopics] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, username")
            .ilike("username", `%${searchQuery}%`)
            .limit(3),
          supabase
            .from("products")
            .select("id, title, description")
            .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
            .limit(3),
          supabase
            .from("resources")
            .select("id, title, description, category")
            .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
            .limit(3),
          supabase
            .from("forum_topics")
            .select("id, title, content")
            .or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`)
            .limit(3),
        ]);

        const results: SearchResult[] = [
          ...(users.data?.map(user => ({
            type: "user" as const,
            id: user.id,
            username: user.username,
          })) || []),
          ...(products.data?.map(product => ({
            type: "product" as const,
            id: product.id,
            title: product.title,
            description: product.description,
          })) || []),
          ...(resources.data?.map(resource => ({
            type: "resource" as const,
            id: resource.id,
            title: resource.title,
            description: resource.description,
            category: resource.category,
          })) || []),
          ...(forumTopics.data?.map(topic => ({
            type: "forum" as const,
            id: topic.id,
            title: topic.title,
            description: topic.content,
          })) || []),
        ];

        return results;
      } catch (error) {
        console.error("Error searching:", error);
        return [];
      }
    },
    enabled: searchQuery.length > 2,
  });

  const handleSelect = (result: SearchResult) => {
    setShowResults(false);
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
    <div className="relative w-full md:w-[300px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="search"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
        />
      </div>

      {showResults && searchQuery.length > 2 && (
        <SearchResults
          results={searchResults}
          onSelect={handleSelect}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};