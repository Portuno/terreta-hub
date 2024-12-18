import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductVotes } from "./ProductVotes";
import { ProductLogo } from "./header/ProductLogo";
import { ProductLinks } from "./header/ProductLinks";
import { ProductTeam } from "./header/ProductTeam";
import { ProductCategories } from "./header/ProductCategories";

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
        <div className="flex items-center justify-between">
          <ProductLogo
            logo_url={product.logo_url}
            title={product.title}
            profile={product.profile}
          />
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
        
        <ProductLinks
          website_url={product.website_url}
          linkedin_url={product.linkedin_url}
          video_url={product.video_url}
          pitchdeck_url={product.pitchdeck_url}
        />

        <ProductTeam team_members={product.team_members} />

        <ProductCategories
          main_categories={product.main_categories}
          sub_categories={product.sub_categories}
        />
      </CardContent>
    </Card>
  );
};