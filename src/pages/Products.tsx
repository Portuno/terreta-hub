import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Loader2, Share2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { ProductFilters } from "@/components/products/ProductFilters";
import { useState } from "react";
import { toast } from "sonner";
import { Stats } from "@/components/Stats";

interface Profile {
  username: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  views: number | null;
  created_at: string;
  profile: Profile;
  main_categories: string[];
}

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", selectedCategories],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          profile:profiles(username)
        `)
        .order("created_at", { ascending: false });

      if (selectedCategories.length > 0) {
        query = query.contains("main_categories", selectedCategories);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return (data as any[]).map(product => ({
        ...product,
        profile: product.profile || { username: 'Usuario Anónimo' }
      }));
    },
  });

  const { data: allCategories = [] } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("main_categories");

      if (error) throw error;

      const categories = new Set<string>();
      data.forEach(product => {
        product.main_categories?.forEach(category => categories.add(category));
      });

      return Array.from(categories);
    },
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleShare = async (product: Product) => {
    const shareData = {
      title: product.title,
      text: product.description,
      url: window.location.origin + `/productos/${product.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Enlace copiado al portapapeles");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-16 flex-grow">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-foreground">Productos</h1>
              <Button 
                onClick={() => navigate("/productos/nuevo")} 
                className="bg-primary hover:bg-primary-dark text-white font-bold"
              >
                Crear Proyecto
              </Button>
            </div>

            <ProductFilters
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              onClearFilters={() => setSelectedCategories([])}
            />

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/productos/${product.id}`}
                        className="flex-grow"
                      >
                        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare(product)}
                        className="ml-2"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Link
                      to={`/productos/${product.id}`}
                      className="block"
                    >
                      <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.main_categories?.map((category) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Por {product.profile?.username}</span>
                        <span>{product.views || 0} visualizaciones</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay productos disponibles en este momento.
              </p>
            )}
            
            <div className="mt-8">
              <Stats context="products" />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Products;