import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductHeader } from "./products/ProductHeader";

interface TeamMember {
  name: string;
  role: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  views: number;
  profile: {
    username: string;
    avatar_url?: string | null;
  };
  logo_url?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  main_categories?: string[];
  sub_categories?: string[] | null;
  team_members?: TeamMember[] | null;
}

export const TopProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["topProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, profile:profiles(username)")
        .order("views", { ascending: false })
        .limit(6);
      
      if (error) throw error;

      // Transform team_members from JSON to proper type
      return data.map(product => ({
        ...product,
        team_members: product.team_members ? JSON.parse(JSON.stringify(product.team_members)) : null
      })) as Product[];
    },
  });

  const { data: productDetails } = useQuery({
    queryKey: ["product", selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return null;
      
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profile:profiles(username, avatar_url)
        `)
        .eq("id", selectedProduct)
        .single();

      if (error) throw error;

      // Transform team_members from JSON to proper type
      return {
        ...data,
        team_members: data.team_members ? JSON.parse(JSON.stringify(data.team_members)) : null
      } as Product;
    },
    enabled: !!selectedProduct,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {products?.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product.id)}
            className="w-full text-left block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900">{product.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-2 text-xs text-gray-400">
              {product.views} visualizaciones
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          {productDetails && <ProductHeader product={productDetails} />}
        </DialogContent>
      </Dialog>
    </>
  );
};