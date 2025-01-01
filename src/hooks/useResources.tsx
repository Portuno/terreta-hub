import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useResources = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*");

      if (error) {
        toast({
          title: "Error",
          description: "Could not load resources",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
  });
};