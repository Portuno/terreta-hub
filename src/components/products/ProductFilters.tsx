import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
}

export const ProductFilters = ({
  categories,
  selectedCategories,
  onCategoryChange,
  onClearFilters,
}: ProductFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filtros</h3>
        {selectedCategories.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Categorías</h4>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Filtros activos</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => onCategoryChange(category)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};