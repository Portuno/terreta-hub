import { Link } from "react-router-dom";
import { ExternalLink, Users, Youtube, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductVotes } from "./ProductVotes";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  role: string;
}

interface ProductHeaderProps {
  product: {
    id: string;
    logo_url?: string | null;
    title: string;
    profile?: {
      username: string;
      avatar_url?: string | null;
    };
    description: string;
    website_url?: string | null;
    linkedin_url?: string | null;
    main_categories?: string[];
    sub_categories?: string[] | null;
    team_members?: TeamMember[] | null;
    video_url?: string | null;
    pitchdeck_url?: string | null;
  };
}

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  const { data: voteData } = useQuery({
    queryKey: ["product-vote", product.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();

      let userVote = null;
      if (user) {
        const { data: voteData } = await supabase
          .from("product_votes")
          .select("vote_type")
          .eq("product_id", product.id)
          .eq("user_id", user.id)
          .maybeSingle();

        userVote = voteData?.vote_type;
      }

      const { data: voteCounts } = await supabase
        .from("products")
        .select("upvotes, downvotes")
        .eq("id", product.id)
        .single();

      return {
        userVote,
        upvotes: voteCounts?.upvotes || 0,
        downvotes: voteCounts?.downvotes || 0,
      };
    },
  });

  return (
    <Card className="backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          {product.logo_url && (
            <img
              src={product.logo_url}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-lg shadow-md"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500">
              por{" "}
              <Link
                to={`/perfil/${product.profile?.username}`}
                className="hover:text-primary transition-colors"
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
      <CardContent className="space-y-6">
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {product.website_url && (
              <a
                href={product.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors group"
              >
                <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                Sitio web
              </a>
            )}
            
            {product.linkedin_url && (
              <a
                href={product.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors group"
              >
                <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                LinkedIn
              </a>
            )}

            {product.video_url && (
              <a
                href={product.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors group"
              >
                <Youtube size={16} className="group-hover:scale-110 transition-transform" />
                Ver demo en video
              </a>
            )}
          </div>

          <div className="space-y-2">
            {product.pitchdeck_url && (
              <a
                href={product.pitchdeck_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors group"
              >
                <FileText size={16} className="group-hover:scale-110 transition-transform" />
                Descargar Pitch Deck
              </a>
            )}
          </div>
        </div>

        {product.team_members && product.team_members.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
              <Users size={16} />
              Equipo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.team_members.map((member, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="font-medium text-gray-800 block">{member.name}</span>
                  <p className="text-sm text-gray-500 mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-semibold mb-4 text-primary">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            {product.main_categories?.map((category: string) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-primary/10 to-accent/10 text-primary hover:from-primary/20 hover:to-accent/20 transition-colors"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {product.sub_categories && product.sub_categories.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-4 text-primary">Subcategorías</h3>
            <div className="flex flex-wrap gap-2">
              {product.sub_categories.map((subcategory: string) => (
                <span
                  key={subcategory}
                  className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-accent/10 to-primary/10 text-accent hover:from-accent/20 hover:to-primary/20 transition-colors"
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