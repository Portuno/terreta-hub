import { Users, MessageSquare, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatsProps {
  context: 'forum' | 'products';
}

export const Stats = ({ context }: StatsProps) => {
  const { data: stats } = useQuery({
    queryKey: [`${context}-stats`],
    queryFn: async () => {
      console.log(`Fetching ${context} statistics`);
      
      // Get active users (users who have posted in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .gt('updated_at', thirtyDaysAgo.toISOString());

      if (context === 'forum') {
        // Get total topics
        const { count: topicsCount } = await supabase
          .from('forum_topics')
          .select('*', { count: 'exact' });

        // Get total comments
        const { count: commentsCount } = await supabase
          .from('forum_comments')
          .select('*', { count: 'exact' });

        return {
          topics: topicsCount || 0,
          comments: commentsCount || 0,
          activeUsers: activeUsersCount || 0
        };
      } else {
        // Get total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact' });

        // Get total product comments
        const { count: commentsCount } = await supabase
          .from('product_comments')
          .select('*', { count: 'exact' });

        return {
          products: productsCount || 0,
          comments: commentsCount || 0,
          activeUsers: activeUsersCount || 0
        };
      }
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Usuarios Activos</p>
          <p className="text-2xl font-bold text-primary">{stats?.activeUsers || 0}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-accent/10 rounded-lg">
          <MessageSquare className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Comentarios</p>
          <p className="text-2xl font-bold text-accent">{stats?.comments || 0}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">
            {context === 'forum' ? 'Temas Totales' : 'Productos Publicados'}
          </p>
          <p className="text-2xl font-bold text-primary">
            {context === 'forum' ? stats?.topics || 0 : stats?.products || 0}
          </p>
        </div>
      </div>
    </div>
  );
};