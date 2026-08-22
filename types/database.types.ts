export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: Database["public"]["Enums"]["achievement_category_type"]
          code: string
          created_at: string
          description: string
          gamecoins_reward: number
          icon_name: string
          id: number
          title: string
          xp_reward: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["achievement_category_type"]
          code: string
          created_at?: string
          description: string
          gamecoins_reward?: number
          icon_name?: string
          id?: number
          title: string
          xp_reward?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["achievement_category_type"]
          code?: string
          created_at?: string
          description?: string
          gamecoins_reward?: number
          icon_name?: string
          id?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_name: string
          id: number
          ip_address: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_name: string
          id?: number
          ip_address?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_name?: string
          id?: number
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          game_id: number
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: number
          metadata_json: Json | null
          sender: Database["public"]["Enums"]["chat_sender_type"]
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          metadata_json?: Json | null
          sender?: Database["public"]["Enums"]["chat_sender_type"]
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          metadata_json?: Json | null
          sender?: Database["public"]["Enums"]["chat_sender_type"]
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          title: string
          topic_category: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string
          topic_category?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string
          topic_category?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          code: string | null
          created_at: string
          discount_percent: number
          end_date: string
          game_id: number
          id: number
          is_active: boolean
          start_date: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          discount_percent: number
          end_date: string
          game_id: number
          id?: number
          is_active?: boolean
          start_date: string
        }
        Update: {
          code?: string | null
          created_at?: string
          discount_percent?: number
          end_date?: string
          game_id?: number
          id?: number
          is_active?: boolean
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "discounts_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_categories: {
        Row: {
          category_id: number
          game_id: number
        }
        Insert: {
          category_id: number
          game_id: number
        }
        Update: {
          category_id?: number
          game_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_categories_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_media: {
        Row: {
          game_id: number
          id: number
          media_type: string
          media_url: string
          sort_order: number
        }
        Insert: {
          game_id: number
          id?: number
          media_type: string
          media_url: string
          sort_order?: number
        }
        Update: {
          game_id?: number
          id?: number
          media_type?: string
          media_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_media_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          age_rating: string | null
          banner_image_url: string | null
          base_price: number
          cover_image_url: string
          created_at: string
          description: string
          developer: string
          discount_percent: number
          final_price: number | null
          id: number
          is_active: boolean
          is_featured: boolean
          publisher: string | null
          rating_avg: number
          rating_count: number
          release_date: string
          short_description: string | null
          slug: string
          title: string
          trailer_url: string | null
          updated_at: string
        }
        Insert: {
          age_rating?: string | null
          banner_image_url?: string | null
          base_price: number
          cover_image_url: string
          created_at?: string
          description: string
          developer: string
          discount_percent?: number
          final_price?: number | null
          id?: number
          is_active?: boolean
          is_featured?: boolean
          publisher?: string | null
          rating_avg?: number
          rating_count?: number
          release_date: string
          short_description?: string | null
          slug: string
          title: string
          trailer_url?: string | null
          updated_at?: string
        }
        Update: {
          age_rating?: string | null
          banner_image_url?: string | null
          base_price?: number
          cover_image_url?: string
          created_at?: string
          description?: string
          developer?: string
          discount_percent?: number
          final_price?: number | null
          id?: number
          is_active?: boolean
          is_featured?: boolean
          publisher?: string | null
          rating_avg?: number
          rating_count?: number
          release_date?: string
          short_description?: string | null
          slug?: string
          title?: string
          trailer_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          discount_applied: number
          final_price: number
          game_id: number
          id: number
          order_id: number
          unit_price: number
        }
        Insert: {
          discount_applied?: number
          final_price: number
          game_id: number
          id?: number
          order_id: number
          unit_price: number
        }
        Update: {
          discount_applied?: number
          final_price?: number
          game_id?: number
          id?: number
          order_id?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          discount_total: number
          id: number
          order_code: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          receipt_pdf_url: string | null
          status: Database["public"]["Enums"]["order_status_type"]
          subtotal: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_total?: number
          id?: number
          order_code: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          receipt_pdf_url?: string | null
          status?: Database["public"]["Enums"]["order_status_type"]
          subtotal: number
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          discount_total?: number
          id?: number
          order_code?: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          receipt_pdf_url?: string | null
          status?: Database["public"]["Enums"]["order_status_type"]
          subtotal?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_level: number
          current_streak: number
          dna_collection: number
          dna_competitive: number
          dna_exploration: number
          dna_narrative: number
          full_name: string | null
          gamecoins_balance: number
          id: string
          last_login_date: string | null
          longest_streak: number
          role: Database["public"]["Enums"]["user_role"]
          total_xp: number
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_level?: number
          current_streak?: number
          dna_collection?: number
          dna_competitive?: number
          dna_exploration?: number
          dna_narrative?: number
          full_name?: string | null
          gamecoins_balance?: number
          id: string
          last_login_date?: string | null
          longest_streak?: number
          role?: Database["public"]["Enums"]["user_role"]
          total_xp?: number
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_level?: number
          current_streak?: number
          dna_collection?: number
          dna_competitive?: number
          dna_exploration?: number
          dna_narrative?: number
          full_name?: string | null
          gamecoins_balance?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          role?: Database["public"]["Enums"]["user_role"]
          total_xp?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          created_at: string
          id: number
          is_helpful: boolean
          review_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_helpful?: boolean
          review_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_helpful?: boolean
          review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          game_id: number
          helpful_votes_count: number
          id: number
          is_verified_purchase: boolean
          rating: number
          status: Database["public"]["Enums"]["review_status_type"]
          title: string | null
          unhelpful_votes_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          game_id: number
          helpful_votes_count?: number
          id?: number
          is_verified_purchase?: boolean
          rating: number
          status?: Database["public"]["Enums"]["review_status_type"]
          title?: string | null
          unhelpful_votes_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          game_id?: number
          helpful_votes_count?: number
          id?: number
          is_verified_purchase?: boolean
          rating?: number
          status?: Database["public"]["Enums"]["review_status_type"]
          title?: string | null
          unhelpful_votes_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streak_logs: {
        Row: {
          activity_date: string
          created_at: string
          id: number
          streak_count: number
          user_id: string
          xp_awarded: number
        }
        Insert: {
          activity_date?: string
          created_at?: string
          id?: number
          streak_count: number
          user_id: string
          xp_awarded?: number
        }
        Update: {
          activity_date?: string
          created_at?: string
          id?: number
          streak_count?: number
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "streak_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: number
          id: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: number
          id?: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: number
          id?: number
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_library: {
        Row: {
          acquired_at: string
          game_id: number
          hours_played: number
          id: number
          install_status: Database["public"]["Enums"]["install_status_type"]
          last_played_at: string | null
          order_id: number | null
          user_id: string
        }
        Insert: {
          acquired_at?: string
          game_id: number
          hours_played?: number
          id?: number
          install_status?: Database["public"]["Enums"]["install_status_type"]
          last_played_at?: string | null
          order_id?: number | null
          user_id: string
        }
        Update: {
          acquired_at?: string
          game_id?: number
          hours_played?: number
          id?: number
          install_status?: Database["public"]["Enums"]["install_status_type"]
          last_played_at?: string | null
          order_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_library_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_library_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          game_id: number
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      achievement_category_type:
        | "EXPLORATION"
        | "COMPETITIVE"
        | "COLLECTION"
        | "SOCIAL"
      chat_sender_type: "USER" | "ASSISTANT" | "SYSTEM"
      install_status_type:
        | "NOT_INSTALLED"
        | "INSTALLING"
        | "INSTALLED"
        | "READY_TO_PLAY"
      order_status_type: "COMPLETED" | "PENDING" | "FAILED" | "CANCELLED"
      payment_method_type: "SIMULATED_CARD" | "GAMECOINS" | "WALLET"
      review_status_type: "APPROVED" | "PENDING" | "REJECTED"
      user_role: "VISITOR" | "USER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
