import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SearchResult {
  type: "user" | "product" | "resource" | "forum";
  id: string;
  title?: string;
  username?: string;
  description?: string;
  category?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  isLoading: boolean;
}

export const SearchResults = ({ results, onSelect, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 p-2 z-50">
        <div className="p-4 text-center text-sm text-gray-500">
          Buscando...
        </div>
      </div>
    );
  }

  if (!results.length) {
    return null;
  }

  const groupedResults = {
    user: results.filter(r => r.type === "user"),
    product: results.filter(r => r.type === "product"),
    resource: results.filter(r => r.type === "resource"),
    forum: results.filter(r => r.type === "forum"),
  };

  return (
    <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 z-50 max-h-[400px] overflow-y-auto">
      {Object.entries(groupedResults).map(([type, items]) => {
        if (!items.length) return null;
        
        return (
          <div key={type} className="p-2">
            <h3 className="text-sm font-semibold text-gray-500 px-2 mb-1">
              {type === "user" ? "Usuarios" :
               type === "product" ? "Productos" :
               type === "resource" ? "Recursos" : "Foro"}
            </h3>
            {items.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => onSelect(result)}
              >
                {result.type === "user" ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {result.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{result.username}</span>
                  </div>
                ) : (
                  <div className="text-sm">{result.title}</div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};