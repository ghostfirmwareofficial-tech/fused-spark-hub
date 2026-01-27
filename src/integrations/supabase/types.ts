export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          admin_notes: string | null
          age: number | null
          availability: string | null
          created_at: string
          discord_username: string | null
          experience: string | null
          id: string
          ign: string
          pr_score: number | null
          region: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
          why_join: string
        }
        Insert: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          discord_username?: string | null
          experience?: string | null
          id?: string
          ign: string
          pr_score?: number | null
          region?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
          why_join: string
        }
        Update: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          discord_username?: string | null
          experience?: string | null
          id?: string
          ign?: string
          pr_score?: number | null
          region?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
          why_join?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          channel: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          channel?: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["friend_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: Database["public"]["Enums"]["friend_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["friend_request_status"]
          updated_at?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      point_transfers: {
        Row: {
          amount: number
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean
          is_pinned: boolean
          likes_count: number
          pinned_at: string | null
          pinned_by: string | null
          reposts_count: number
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_pinned?: boolean
          likes_count?: number
          pinned_at?: string | null
          pinned_by?: string | null
          reposts_count?: number
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_pinned?: boolean
          likes_count?: number
          pinned_at?: string | null
          pinned_by?: string | null
          reposts_count?: number
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      prize_tiers: {
        Row: {
          created_at: string
          id: string
          max_participants: number | null
          min_participants: number
          prize_pool: number
        }
        Insert: {
          created_at?: string
          id?: string
          max_participants?: number | null
          min_participants: number
          prize_pool: number
        }
        Update: {
          created_at?: string
          id?: string
          max_participants?: number | null
          min_participants?: number
          prize_pool?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          current_streak: number
          discord_id: string | null
          discord_username: string | null
          epic_games_id: string | null
          equipped_items: Json | null
          followers_count: number
          following_count: number
          friends_count: number
          fused_points: number
          id: string
          ign: string
          is_verified: boolean
          last_check_in: string | null
          last_post_points_date: string | null
          longest_streak: number
          purchased_items: string[] | null
          rank: string
          riot_id: string | null
          role: string
          social_links: Json | null
          steam_id: string | null
          total_likes_received: number
          total_points_earned: number
          total_posts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number
          discord_id?: string | null
          discord_username?: string | null
          epic_games_id?: string | null
          equipped_items?: Json | null
          followers_count?: number
          following_count?: number
          friends_count?: number
          fused_points?: number
          id?: string
          ign: string
          is_verified?: boolean
          last_check_in?: string | null
          last_post_points_date?: string | null
          longest_streak?: number
          purchased_items?: string[] | null
          rank?: string
          riot_id?: string | null
          role?: string
          social_links?: Json | null
          steam_id?: string | null
          total_likes_received?: number
          total_points_earned?: number
          total_posts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number
          discord_id?: string | null
          discord_username?: string | null
          epic_games_id?: string | null
          equipped_items?: Json | null
          followers_count?: number
          following_count?: number
          friends_count?: number
          fused_points?: number
          id?: string
          ign?: string
          is_verified?: boolean
          last_check_in?: string | null
          last_post_points_date?: string | null
          longest_streak?: number
          purchased_items?: string[] | null
          rank?: string
          riot_id?: string | null
          role?: string
          social_links?: Json | null
          steam_id?: string | null
          total_likes_received?: number
          total_points_earned?: number
          total_posts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reposts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reposts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      team_up_requests: {
        Row: {
          created_at: string
          description: string | null
          game: string
          game_mode: Database["public"]["Enums"]["game_mode"]
          id: string
          is_active: boolean
          slots_available: number
          team_size: Database["public"]["Enums"]["team_size"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          game: string
          game_mode?: Database["public"]["Enums"]["game_mode"]
          id?: string
          is_active?: boolean
          slots_available?: number
          team_size: Database["public"]["Enums"]["team_size"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          game?: string
          game_mode?: Database["public"]["Enums"]["game_mode"]
          id?: string
          is_active?: boolean
          slots_available?: number
          team_size?: Database["public"]["Enums"]["team_size"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tournament_entries: {
        Row: {
          created_at: string
          current_kills: number | null
          current_wins: number | null
          entry_paid: boolean
          epic_games_id: string
          id: string
          initial_kills: number | null
          initial_wins: number | null
          payout_notes: string | null
          payout_status: string | null
          placement: number | null
          prize_amount: number | null
          total_score: number | null
          tournament_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_kills?: number | null
          current_wins?: number | null
          entry_paid?: boolean
          epic_games_id: string
          id?: string
          initial_kills?: number | null
          initial_wins?: number | null
          payout_notes?: string | null
          payout_status?: string | null
          placement?: number | null
          prize_amount?: number | null
          total_score?: number | null
          tournament_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_kills?: number | null
          current_wins?: number | null
          entry_paid?: boolean
          epic_games_id?: string
          id?: string
          initial_kills?: number | null
          initial_wins?: number | null
          payout_notes?: string | null
          payout_status?: string | null
          placement?: number | null
          prize_amount?: number | null
          total_score?: number | null
          tournament_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_entries_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          base_prize_pool: number
          created_at: string
          created_by: string
          current_prize_pool: number
          description: string | null
          ends_at: string | null
          entry_fee: number
          id: string
          max_participants: number | null
          name: string
          starts_at: string | null
          status: Database["public"]["Enums"]["tournament_status"]
          updated_at: string
        }
        Insert: {
          base_prize_pool?: number
          created_at?: string
          created_by: string
          current_prize_pool?: number
          description?: string | null
          ends_at?: string | null
          entry_fee?: number
          id?: string
          max_participants?: number | null
          name: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
        }
        Update: {
          base_prize_pool?: number
          created_at?: string
          created_by?: string
          current_prize_pool?: number
          description?: string | null
          ends_at?: string | null
          entry_fee?: number
          id?: string
          max_participants?: number | null
          name?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_moderation: {
        Row: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          moderator_id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          moderator_id: string
          reason?: string | null
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["moderation_action_type"]
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          moderator_id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_admin_role_if_eligible: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_moderated: {
        Args: {
          _action_type: Database["public"]["Enums"]["moderation_action_type"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      application_status: "pending" | "reviewing" | "accepted" | "rejected"
      friend_request_status: "pending" | "accepted" | "rejected"
      game_mode: "ranked" | "unranked" | "casual"
      moderation_action_type: "ban" | "timeout" | "restrict" | "kick" | "warn"
      team_size: "duos" | "trios" | "quads"
      tournament_status:
        | "draft"
        | "registration"
        | "active"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      application_status: ["pending", "reviewing", "accepted", "rejected"],
      friend_request_status: ["pending", "accepted", "rejected"],
      game_mode: ["ranked", "unranked", "casual"],
      moderation_action_type: ["ban", "timeout", "restrict", "kick", "warn"],
      team_size: ["duos", "trios", "quads"],
      tournament_status: [
        "draft",
        "registration",
        "active",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
