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
      blocked_users: {
        Row: {
          blocked_user_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          blocked_user_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          blocked_user_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      event_attendances: {
        Row: {
          created_at: string
          event_id: string
          id: string
          is_public: boolean | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          is_public?: boolean | null
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          is_public?: boolean | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendances_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_comments: {
        Row: {
          content: string
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string
          event_date: string
          id: string
          location: string
          location_coordinates: unknown | null
          location_link: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          event_date: string
          id?: string
          location: string
          location_coordinates?: unknown | null
          location_link?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          location?: string
          location_coordinates?: unknown | null
          location_link?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          content: string
          created_at: string
          downvotes: number | null
          id: string
          media_urls: string[] | null
          topic_id: string
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          media_urls?: string[] | null
          topic_id: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          media_urls?: string[] | null
          topic_id?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_forum_comments_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
        Relationships: [
          {
            foreignKeyName: "fk_forum_topics_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      mentions: {
        Row: {
          created_at: string
          id: string
          mentioned_user_id: string | null
          target_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mentioned_user_id?: string | null
          target_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mentioned_user_id?: string | null
          target_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          link: string
          origin_id: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          link: string
          origin_id?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          link?: string
          origin_id?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      product_comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comment_votes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
          vote_type: boolean
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
          vote_type: boolean
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
          vote_type?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comments: {
        Row: {
          content: string
          created_at: string | null
          depth: number
          downvotes: number | null
          id: string
          parent_id: string | null
          product_id: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          depth?: number
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          product_id: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          depth?: number
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          product_id?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_comments_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_votes: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
          vote_type: boolean
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
          vote_type: boolean
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
          vote_type?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_votes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          collaborations: string[] | null
          contact_email: string | null
          created_at: string
          description: string
          downvotes: number | null
          gallery_urls: string[] | null
          id: string
          is_draft: boolean | null
          is_featured: boolean | null
          launch_date: string | null
          linkedin_url: string | null
          logo_url: string | null
          main_categories: string[]
          metrics: Json | null
          pitchdeck_url: string | null
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
          upvotes: number | null
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
          downvotes?: number | null
          gallery_urls?: string[] | null
          id?: string
          is_draft?: boolean | null
          is_featured?: boolean | null
          launch_date?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          main_categories?: string[]
          metrics?: Json | null
          pitchdeck_url?: string | null
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
          upvotes?: number | null
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
          downvotes?: number | null
          gallery_urls?: string[] | null
          id?: string
          is_draft?: boolean | null
          is_featured?: boolean | null
          launch_date?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          main_categories?: string[]
          metrics?: Json | null
          pitchdeck_url?: string | null
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
          upvotes?: number | null
          user_id?: string
          video_url?: string | null
          views?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievements: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          interests: string[] | null
          location: string | null
          notification_settings: Json | null
          reputation: number | null
          role: string
          social_links: Json | null
          total_downvotes: number | null
          total_upvotes: number | null
          updated_at: string
          username: string
          visibility_settings: Json | null
          website_url: string | null
        }
        Insert: {
          achievements?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          interests?: string[] | null
          location?: string | null
          notification_settings?: Json | null
          reputation?: number | null
          role?: string
          social_links?: Json | null
          total_downvotes?: number | null
          total_upvotes?: number | null
          updated_at?: string
          username: string
          visibility_settings?: Json | null
          website_url?: string | null
        }
        Update: {
          achievements?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          notification_settings?: Json | null
          reputation?: number | null
          role?: string
          social_links?: Json | null
          total_downvotes?: number | null
          total_upvotes?: number | null
          updated_at?: string
          username?: string
          visibility_settings?: Json | null
          website_url?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          content_format: string | null
          course_syllabus: string | null
          created_at: string
          description: string
          duration: string | null
          id: string
          instructor: string | null
          resource_type: string
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          category: string
          content_format?: string | null
          course_syllabus?: string | null
          created_at?: string
          description: string
          duration?: string | null
          id?: string
          instructor?: string | null
          resource_type?: string
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content_format?: string | null
          course_syllabus?: string | null
          created_at?: string
          description?: string
          duration?: string | null
          id?: string
          instructor?: string | null
          resource_type?: string
          title?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_username: {
        Args: {
          new_username: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role:
        | "Normal"
        | "Admin"
        | "Moderator"
        | "Event creator"
        | "Resources creator"
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
