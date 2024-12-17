import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ExternalLink, MessageCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
          profile:profiles(username, avatar_url)
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
          profile:profiles(username, avatar_url)
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
          {/* Product Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                {product.logo_url && (
                  <img
                    src={product.logo_url}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">{product.title}</h1>
                  <p className="text-sm text-gray-500">
                    por{" "}
                    <Link
                      to={`/perfil/${product.profile?.username}`}
                      className="hover:underline"
                    >
                      {product.profile?.username}
                    </Link>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              {product.website_url && (
                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline mb-2"
                >
                  <ExternalLink size={16} />
                  Sitio web
                </a>
              )}
              
              {product.linkedin_url && (
                <a
                  href={product.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink size={16} />
                  LinkedIn
                </a>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {product.main_categories?.map((category: string) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {product.sub_categories && product.sub_categories.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Subcategorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sub_categories.map((subcategory: string) => (
                      <span
                        key={subcategory}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {subcategory}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Comentarios</h2>
                <div className="flex gap-2">
                  <Button
                    variant={commentSort === "upvotes" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCommentSort("upvotes")}
                  >
                    Más votados
                  </Button>
                  <Button
                    variant={commentSort === "downvotes" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCommentSort("downvotes")}
                  >
                    Menos votados
                  </Button>
                  <Button
                    variant={commentSort === "recent" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCommentSort("recent")}
                  >
                    Recientes
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {commentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={comment.profile?.avatar_url}
                              alt={comment.profile?.username}
                            />
                            <AvatarFallback>
                              {comment.profile?.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <Link
                            to={`/perfil/${comment.profile?.username}`}
                            className="font-medium hover:underline"
                          >
                            {comment.profile?.username}
                          </Link>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <ArrowUp size={16} />
                            {comment.upvotes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ArrowDown size={16} />
                            {comment.downvotes || 0}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No hay comentarios aún.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;