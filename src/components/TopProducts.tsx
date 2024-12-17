import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductHeader } from "./products/ProductHeader";

interface Product {
  id: string;
  title: string;
  description: string;
  views: number;
  profile: {
    username: string;
  };
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
      return data;
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
      return data;
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