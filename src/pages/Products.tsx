import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Footer } from "@/components/Footer";

const Products = () => {
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles (
            username
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-16 flex-grow">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Productos</h1>
              <Button onClick={() => navigate("/productos/nuevo")} className="bg-primary hover:bg-primary-dark text-white font-bold">
                Crear Proyecto
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/productos/${product.id}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Por {product.profiles?.username}</span>
                      <span>{product.views} visualizaciones</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay productos disponibles en este momento.
              </p>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Products;