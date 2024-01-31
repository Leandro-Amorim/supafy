export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          avatar_url: string
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string
          color: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          avatar_url?: string
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      featured_playlists: {
        Row: {
          playlist_id: string
        }
        Insert: {
          playlist_id: string
        }
        Update: {
          playlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_playlists_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: true
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          }
        ]
      }
      genres: {
        Row: {
          color: string
          id: string
          image_url: string
          name: string
        }
        Insert: {
          color: string
          id: string
          image_url?: string
          name: string
        }
        Update: {
          color?: string
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      music_likes: {
        Row: {
          liked_at: string
          music_id: string
          user_id: string
        }
        Insert: {
          liked_at?: string
          music_id: string
          user_id: string
        }
        Update: {
          liked_at?: string
          music_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_likes_music_id_fkey"
            columns: ["music_id"]
            isOneToOne: false
            referencedRelation: "musics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      musics: {
        Row: {
          album_name: string
          artist_id: string
          created_at: string
          duration: number
          genre_id: string
          id: string
          image_url: string | null
          name: string
          url: string | null
        }
        Insert: {
          album_name: string
          artist_id: string
          created_at?: string
          duration?: number
          genre_id: string
          id?: string
          image_url?: string | null
          name: string
          url?: string | null
        }
        Update: {
          album_name?: string
          artist_id?: string
          created_at?: string
          duration?: number
          genre_id?: string
          id?: string
          image_url?: string | null
          name?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "musics_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "musics_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          }
        ]
      }
      playlist_history: {
        Row: {
          last_played_at: string
          playlist_id: string
          user_id: string
        }
        Insert: {
          last_played_at?: string
          playlist_id: string
          user_id: string
        }
        Update: {
          last_played_at?: string
          playlist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_history_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      playlists: {
        Row: {
          author_id: string
          color: string
          created_at: string
          genre_data: Json
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          author_id: string
          color?: string
          created_at?: string
          genre_data?: Json
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          author_id?: string
          color?: string
          created_at?: string
          genre_data?: Json
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      playlists_musics: {
        Row: {
          added_at: string
          music_id: string
          order: number
          playlist_id: string
        }
        Insert: {
          added_at?: string
          music_id: string
          order: number
          playlist_id: string
        }
        Update: {
          added_at?: string
          music_id?: string
          order?: number
          playlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_musics_music_id_fkey"
            columns: ["music_id"]
            isOneToOne: false
            referencedRelation: "musics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_musics_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          color: string
          created_at: string
          id: string
          last_played_liked_music_at: string
          signup_completed: boolean
          username: string
        }
        Insert: {
          avatar_url?: string
          color?: string
          created_at?: string
          id: string
          last_played_liked_music_at?: string
          signup_completed?: boolean
          username?: string
        }
        Update: {
          avatar_url?: string
          color?: string
          created_at?: string
          id?: string
          last_played_liked_music_at?: string
          signup_completed?: boolean
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_playlists: {
        Row: {
          added_at: string
          last_played_at: string
          playlist_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          last_played_at?: string
          playlist_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          last_played_at?: string
          playlist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_playlists_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_artist: {
        Args: {
          aid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          avatar_url: string
          color: string
          musics: Json
        }[]
      }
      get_artist_musics: {
        Args: {
          aid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          artist_id: string
          artist_name: string
          genre_name: string
          album_name: string
          duration: number
          url: string
          liked_by_me: boolean
        }[]
      }
      get_featured_playlists: {
        Args: {
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          author_id: string
          author_name: string
          saved_by_me: boolean
          color: string
        }[]
      }
      get_genre: {
        Args: {
          gid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          color: string
          playlists: Json
        }[]
      }
      get_genre_playlists: {
        Args: {
          gid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          author_id: string
          author_name: string
          saved_by_me: boolean
        }[]
      }
      get_home: {
        Args: {
          my_id: string
        }
        Returns: {
          history: Json
          featured: Json
          popular: Json
        }[]
      }
      get_library: {
        Args: {
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          author_id: string
          author_name: string
          last_played_at: string
          added_at: string
        }[]
      }
      get_liked_library: {
        Args: {
          my_id: string
        }
        Returns: {
          liked_musics: number
          last_played_at: string
          added_at: string
        }[]
      }
      get_liked_musics: {
        Args: {
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          artist_id: string
          artist_name: string
          genre_name: string
          album_name: string
          duration: number
          url: string
          music_order: number
          added_at: string
          liked_by_me: boolean
        }[]
      }
      get_liked_musics_ids: {
        Args: {
          my_id: string
        }
        Returns: {
          id: string
          playlist_id: string
        }[]
      }
      get_music_info: {
        Args: {
          mid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          artist_id: string
          artist_name: string
          album_name: string
          duration: number
          url: string
          liked_by_me: boolean
        }[]
      }
      get_playlist: {
        Args: {
          pid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          color: string
          author_id: string
          author_name: string
          save_count: number
          saved_by_me: boolean
          musics: Json
          genre_data: Json
          created_at: string
        }[]
      }
      get_playlist_genres: {
        Args: {
          pid: string
        }
        Returns: {
          genre: string
        }[]
      }
      get_playlist_history: {
        Args: {
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          author_id: string
          author_name: string
          saved_by_me: boolean
          color: string
        }[]
      }
      get_playlist_musics: {
        Args: {
          pid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          artist_id: string
          artist_name: string
          genre_name: string
          album_name: string
          duration: number
          url: string
          music_order: number
          added_at: string
          liked_by_me: boolean
        }[]
      }
      get_playlist_musics_ids: {
        Args: {
          pid: string
          my_id: string
        }
        Returns: {
          id: string
          playlist_id: string
        }[]
      }
      get_popular_playlists: {
        Args: {
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          author_id: string
          author_name: string
          saved_by_me: boolean
          color: string
          save_count: number
        }[]
      }
      get_profile: {
        Args: {
          pid: string
          my_id: string
        }
        Returns: {
          id: string
          username: string
          avatar_url: string
          color: string
          playlists: Json
        }[]
      }
      get_profile_playlists: {
        Args: {
          pid: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          author_id: string
          author_name: string
          saved_by_me: boolean
        }[]
      }
      get_queue_info: {
        Args: {
          mids: string[]
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          artist_id: string
          artist_name: string
          album_name: string
          duration: number
          url: string
          liked_by_me: boolean
        }[]
      }
      get_search: {
        Args: {
          search_term: string
          my_id: string
        }
        Returns: {
          musics: Json
          artists: Json
          playlists: Json
        }[]
      }
      search_artists: {
        Args: {
          search_term: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          avatar_url: string
          color: string
        }[]
      }
      search_musics: {
        Args: {
          search_term: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          artist_id: string
          artist_name: string
          genre_name: string
          album_name: string
          duration: number
          url: string
          liked_by_me: boolean
        }[]
      }
      search_playlists: {
        Args: {
          search_term: string
          my_id: string
        }
        Returns: {
          id: string
          name: string
          image_url: string
          author_id: string
          author_name: string
          saved_by_me: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
