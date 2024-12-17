import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubcategoryInputProps {
  subCategories: string[];
  selectedSubCategories: string[];
  onSubCategoryChange: (category: string) => void;
}

export const SubcategoryInput = ({
  subCategories,
  selectedSubCategories,
  onSubCategoryChange,
}: SubcategoryInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.length > 0) {
      const filtered = subCategories.filter(
        (category) =>
          category.toLowerCase().includes(value.toLowerCase()) &&
          !selectedSubCategories.includes(category)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (category: string) => {
    onSubCategoryChange(category);
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">
        Subcategorías (máximo 6)
      </label>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => handleInputChange(inputValue)}
        placeholder="Escribe para buscar subcategorías"
        className="mb-2"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedSubCategories.map((category) => (
          <Badge key={category} variant="secondary">
            {category}
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={() => onSubCategoryChange(category)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};