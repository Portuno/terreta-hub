import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Productos</h1>
              <Button onClick={() => navigate("/productos/nuevo")} className="bg-primary hover:bg-primary-dark text-white font-bold">
                Crear Proyecto
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Placeholder for product filters */}
              <div className="col-span-1 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                <div className="space-y-3">
                  {["Derecho", "Finanzas", "Tecnología", "Salud", "Comunidad", "Arte"].map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Empty product grid */}
              <div className="col-span-2">
                <p className="text-gray-500 text-center py-8">
                  No hay productos disponibles en este momento.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;