import { Link } from "react-router-dom";
import { ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProductHeaderProps {
  product: {
    id: string;
    logo_url?: string | null;
    title: string;
    profile?: {
      username: string;
    };
    description: string;
    website_url?: string | null;
    linkedin_url?: string | null;
    main_categories?: string[];
    sub_categories?: string[] | null;
  };
}

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: voteData } = useQuery({
    queryKey: ["product-vote", product.id],
    queryFn: async () => {
      const { data: userVote } = await supabase
        .from("product_votes")
        .select("vote_type")
        .eq("product_id", product.id)
        .single();

      const { data: voteCounts } = await supabase
        .from("products")
        .select("upvotes, downvotes")
        .eq("id", product.id)
        .single();

      return {
        userVote: userVote?.vote_type,
        upvotes: voteCounts?.upvotes || 0,
        downvotes: voteCounts?.downvotes || 0,
      };
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error: deleteError } = await supabase
        .from("product_votes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("product_votes")
        .insert({
          product_id: product.id,
          user_id: user.id,
          vote_type: voteType,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-vote", product.id] });
      toast({
        description: "Tu voto ha sido registrado",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Error al registrar tu voto",
      });
    },
  });

  return (
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
          <div className="flex-1">
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => voteMutation.mutate({ voteType: true })}
              className={voteData?.userVote === true ? "bg-green-100" : ""}
            >
              <ArrowUp />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => voteMutation.mutate({ voteType: false })}
              className={voteData?.userVote === false ? "bg-red-100" : ""}
            >
              <ArrowDown />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <ArrowUp className="text-green-500" size={16} />
            {voteData?.upvotes || 0}
          </span>
          <span className="flex items-center gap-1">
            <ArrowDown className="text-red-500" size={16} />
            {voteData?.downvotes || 0}
          </span>
        </div>

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
  );
};