import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

type VoteType = 'product' | 'forum_topic' | 'forum_comment' | 'product_comment';

export const useVoteSubscription = (type: VoteType, id: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(`Subscribing to votes for ${type} ${id}`);
    
    const getTableAndKey = (type: VoteType) => {
      switch (type) {
        case 'product':
          return { 
            table: 'products', 
            key: ['product', id],
            filter: `id=eq.${id}`
          };
        case 'forum_topic':
          return { 
            table: 'forum_topics', 
            key: ['forum-topic', id],
            filter: `id=eq.${id}`
          };
        case 'forum_comment':
          return { 
            table: 'forum_comments', 
            key: ['forum-comments'],
            filter: `id=eq.${id}`
          };
        case 'product_comment':
          return { 
            table: 'product_comments', 
            key: ['product-comments'],
            filter: `id=eq.${id}`
          };
      }
    };

    const { table, key, filter } = getTableAndKey(type);
    
    const channel = supabase
      .channel('vote-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log(`Vote update received for ${type}:`, payload);
          queryClient.invalidateQueries({ queryKey: key });
        }
      )
      .subscribe();

    return () => {
      console.log(`Unsubscribing from votes for ${type} ${id}`);
      supabase.removeChannel(channel);
    };
  }, [id, type, queryClient]);
};