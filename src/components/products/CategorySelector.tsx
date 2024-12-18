import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CategorySelectorProps {
  title: string;
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  maxCategories?: number;
}

export const CategorySelector = ({
  title,
  categories = [
    "Tecnología",
    "Salud",
    "Educación",
    "Finanzas",
    "Sostenibilidad",
    "Arte",
    "Comunidad"
  ],
  selectedCategories,
  onCategoryChange,
  maxCategories = 6
}: CategorySelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {title} {maxCategories && `(máximo ${maxCategories})`}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
        {categories.map((category) => (
          <Button
            key={category}
            type="button"
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className="justify-start"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
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
  );
};