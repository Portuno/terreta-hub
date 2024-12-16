export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string
          description: string
          event_date: string
          id: string
          location: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          event_date: string
          id?: string
          location: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          location?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          media_urls: string[] | null
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          status: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          status?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          status?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_topics: {
        Row: {
          content: string
          created_at: string
          downvotes: number | null
          id: string
          is_pinned: boolean | null
          last_activity_at: string | null
          media_urls: string[] | null
          replies: number | null
          title: string
          upvotes: number | null
          user_id: string
          views: number | null
        }
        Insert: {
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_pinned?: boolean | null
          last_activity_at?: string | null
          media_urls?: string[] | null
          replies?: number | null
          title: string
          upvotes?: number | null
          user_id: string
          views?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_pinned?: boolean | null
          last_activity_at?: string | null
          media_urls?: string[] | null
          replies?: number | null
          title?: string
          upvotes?: number | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      forum_votes: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
          vote_type: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
          vote_type: boolean
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
          vote_type?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          collaborations: string[] | null
          contact_email: string | null
          created_at: string
          description: string
          gallery_urls: string[] | null
          id: string
          is_draft: boolean | null
          is_featured: boolean | null
          launch_date: string | null
          linkedin_url: string | null
          logo_url: string | null
          main_categories: string[]
          metrics: Json | null
          pricing_details: Json | null
          pricing_type: string | null
          problem_description: string | null
          product_purpose: string[] | null
          product_status: string
          short_description: string
          social_links: Json | null
          sub_categories: string[] | null
          target_audience: string[] | null
          team_bio: string | null
          team_location: string
          team_members: Json | null
          title: string
          user_id: string
          video_url: string | null
          views: number | null
          website_url: string | null
        }
        Insert: {
          collaborations?: string[] | null
          contact_email?: string | null
          created_at?: string
          description: string
          gallery_urls?: string[] | null
          id?: string
          is_draft?: boolean | null
          is_featured?: boolean | null
          launch_date?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          main_categories?: string[]
          metrics?: Json | null
          pricing_details?: Json | null
          pricing_type?: string | null
          problem_description?: string | null
          product_purpose?: string[] | null
          product_status?: string
          short_description: string
          social_links?: Json | null
          sub_categories?: string[] | null
          target_audience?: string[] | null
          team_bio?: string | null
          team_location?: string
          team_members?: Json | null
          title: string
          user_id: string
          video_url?: string | null
          views?: number | null
          website_url?: string | null
        }
        Update: {
          collaborations?: string[] | null
          contact_email?: string | null
          created_at?: string
          description?: string
          gallery_urls?: string[] | null
          id?: string
          is_draft?: boolean | null
          is_featured?: boolean | null
          launch_date?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          main_categories?: string[]
          metrics?: Json | null
          pricing_details?: Json | null
          pricing_type?: string | null
          problem_description?: string | null
          product_purpose?: string[] | null
          product_status?: string
          short_description?: string
          social_links?: Json | null
          sub_categories?: string[] | null
          target_audience?: string[] | null
          team_bio?: string | null
          team_location?: string
          team_members?: Json | null
          title?: string
          user_id?: string
          video_url?: string | null
          views?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
