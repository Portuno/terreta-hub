import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface UserContributionsProps {
  userId: string;
}

export const UserContributions = ({ userId }: UserContributionsProps) => {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["user-products", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: forumTopics, isLoading: topicsLoading } = useQuery({
    queryKey: ["user-topics", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (productsLoading || topicsLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Productos</h3>
          {products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <Link
                    to={`/productos/${product.id}`}
                    className="text-sm hover:underline"
                  >
                    {product.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay productos publicados aún.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Forum Topics */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Temas en el Foro</h3>
          {forumTopics && forumTopics.length > 0 ? (
            <div className="space-y-4">
              {forumTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between"
                >
                  <Link
                    to={`/foro/${topic.id}`}
                    className="text-sm hover:underline"
                  >
                    {topic.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {new Date(topic.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay temas publicados aún.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};