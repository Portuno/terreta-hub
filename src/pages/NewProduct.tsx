import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CategorySelector } from "@/components/products/CategorySelector";
import { SubcategoryInput } from "@/components/products/SubcategoryInput";

const mainCategories = [
  "Tecnología",
  "Salud",
  "Educación",
  "Sostenibilidad",
  "Finanzas",
  "Otros"
];

const subCategories = [
  "Propiedad Intelectual",
  "Contratos Digitales",
  "Inmobiliaria",
  "Legislación para Startups",
  "Resolución de Conflictos",
  "Compliance y Ética Corporativa",
  "Ciberseguridad",
  "Fintech",
  "Crowdfunding",
  "Criptomonedas",
  "Análisis Financiero",
  "Gestión de Inversiones",
  "Economía Circular",
  "Planificación Fiscal",
  "Recursos Humanos",
  "Inteligencia Artificial (IA)",
  "Blockchain",
  "Realidad Virtual y Aumentada (VR/AR)",
  "Internet de las Cosas (IoT)",
  "Robótica",
  "Cloud Computing",
  "Tecnologías Verdes",
  "Biotecnología",
  "Salud Mental",
  "Fitness",
  "Nutrición",
  "Farmacología",
  "Música",
  "Cine y Audiovisuales",
  "Literatura",
  "Sostenibilidad y Medio Ambiente",
  "Educación y Formación",
  "Diversidad e Inclusión",
  "Innovación Social",
  "Redes de Networking",
  "Emprendimiento Juvenil"
];

const NewProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    main_categories: [] as string[],
    sub_categories: [] as string[],
    team_location: "Valencia",
    website_url: "",
    linkedin_url: "",
    logo_url: "",
  });

  const handleMainCategoryChange = (category: string) => {
    setFormData(prev => {
      const currentCategories = prev.main_categories || [];
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          main_categories: currentCategories.filter(c => c !== category)
        };
      }
      if (currentCategories.length >= 6) {
        toast({
          title: "Límite alcanzado",
          description: "Puedes seleccionar hasta 6 categorías principales",
          variant: "destructive",
        });
        return prev;
      }
      return {
        ...prev,
        main_categories: [...currentCategories, category]
      };
    });
  };

  const handleSubCategoryChange = (category: string) => {
    setFormData(prev => {
      const currentSubCategories = prev.sub_categories || [];
      if (currentSubCategories.includes(category)) {
        return {
          ...prev,
          sub_categories: currentSubCategories.filter(c => c !== category)
        };
      }
      if (currentSubCategories.length >= 6) {
        toast({
          title: "Límite alcanzado",
          description: "Puedes seleccionar hasta 6 subcategorías",
          variant: "destructive",
        });
        return prev;
      }
      return {
        ...prev,
        sub_categories: [...currentSubCategories, category]
      };
    });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(`logos/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(`logos/${fileName}`);

      setFormData(prev => ({
        ...prev,
        logo_url: publicUrl
      }));

      toast({
        title: "Logo subido correctamente",
        description: "El logo se ha guardado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error al subir el logo",
        description: "No se pudo subir el logo, intenta de nuevo",
        variant: "destructive",
      });
    }
  };

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

      if (formData.main_categories.length === 0) {
        toast({
          title: "Error",
          description: "Debes seleccionar al menos una categoría principal",
          variant: "destructive",
        });
        setIsLoading(false);
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
                  Logo del producto
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="mb-2"
                />
                {formData.logo_url && (
                  <img
                    src={formData.logo_url}
                    alt="Logo preview"
                    className="w-32 h-32 object-contain border rounded-lg"
                  />
                )}
              </div>

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
                  Sitio web
                </label>
                <Input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  LinkedIn
                </label>
                <Input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/usuario"
                />
              </div>

              <CategorySelector
                title="Categorías principales (mínimo 1, máximo 6)"
                categories={mainCategories}
                selectedCategories={formData.main_categories}
                onCategoryChange={handleMainCategoryChange}
              />

              <SubcategoryInput
                subCategories={subCategories}
                selectedSubCategories={formData.sub_categories}
                onSubCategoryChange={handleSubCategoryChange}
              />

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