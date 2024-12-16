import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    main_categories: [""],
    team_location: "Valencia",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para crear un producto",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { error } = await supabase
        .from("products")
        .insert({
          ...formData,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Tu producto ha sido creado correctamente",
      });
      navigate("/productos");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Crear nuevo producto</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre del producto
                </label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Mi Producto Innovador"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción corta
                </label>
                <Input
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Una breve descripción de tu producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción detallada
                </label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu producto en detalle"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Categoría principal
                </label>
                <select
                  className="w-full border rounded-md p-2"
                  value={formData.main_categories[0]}
                  onChange={(e) => setFormData({ ...formData, main_categories: [e.target.value] })}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Sostenibilidad">Sostenibilidad</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/productos")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creando..." : "Crear producto"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewProduct;