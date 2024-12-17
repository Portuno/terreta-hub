import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ProductHeader } from "@/components/products/ProductHeader";
import { ProductComments } from "@/components/products/ProductComments";

const ProductDetail = () => {
  const { id } = useParams();
  const [commentSort, setCommentSort] = useState<"upvotes" | "downvotes" | "recent">("upvotes");

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profile:profiles!fk_products_profile(username, avatar_url)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["product-comments", id, commentSort],
    queryFn: async () => {
      let query = supabase
        .from("product_comments")
        .select(`
          *,
          profile:profiles!fk_product_comments_profile(username, avatar_url)
        `)
        .eq("product_id", id);

      switch (commentSort) {
        case "upvotes":
          query = query.order("upvotes", { ascending: false });
          break;
        case "downvotes":
          query = query.order("downvotes", { ascending: false });
          break;
        case "recent":
          query = query.order("created_at", { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Producto no encontrado</h1>
            <p className="text-gray-600 mt-2">
              El producto que buscas no existe o ha sido eliminado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductHeader product={product} />
          <ProductComments 
            comments={comments}
            isLoading={commentsLoading}
            commentSort={commentSort}
            setCommentSort={setCommentSort}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;