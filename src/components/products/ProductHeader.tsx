import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductVotes } from "./ProductVotes";

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
          {voteData && (
            <ProductVotes
              productId={product.id}
              userVote={voteData.userVote}
              upvotes={voteData.upvotes}
              downvotes={voteData.downvotes}
            />
          )}
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
  );
};