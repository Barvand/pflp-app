export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string;
          name: string;
          country_code: string;
          lat: number;
          lng: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cities"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["cities"]["Insert"]>;
      };
      places: {
        Row: {
          id: string;
          city_id: string;
          submitted_by: string | null;
          title: string;
          description: string | null;
          lat: number;
          lng: number;
          status: "pending" | "approved" | "rejected";
          car_accessible: boolean;
          stroller_friendly: boolean;
          rainy_day: boolean;
          min_age: number | null;
          max_age: number | null;
          walk_minutes: number | null;
          difficulty: "flat" | "moderate" | "steep" | null;
          has_toilet: boolean;
          has_shelter: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["places"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["places"]["Insert"]>;
      };
      place_images: {
        Row: {
          id: string;
          place_id: string;
          uploaded_by: string | null;
          storage_url: string;
          is_cover: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["place_images"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["place_images"]["Insert"]>;
      };
      place_tags: {
        Row: {
          id: string;
          place_id: string;
          tag: string;
        };
        Insert: Omit<Database["public"]["Tables"]["place_tags"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["place_tags"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: "viewer" | "contributor" | "admin";
          city_id: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          place_id: string;
          user_id: string;
          body: string | null;
          rating: number | null;
          stroller_confirmed: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["saves"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["saves"]["Insert"]>;
      };
      moderation_log: {
        Row: {
          id: string;
          place_id: string;
          reviewed_by: string | null;
          action: "approved" | "rejected" | "flagged";
          note: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["moderation_log"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["moderation_log"]["Insert"]
        >;
      };
    };
  };
};

export type Place = Database["public"]["Tables"]["places"]["Row"];
export type City = Database["public"]["Tables"]["cities"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type PlaceImage = Database["public"]["Tables"]["place_images"]["Row"];
export type PlaceTag = Database["public"]["Tables"]["place_tags"]["Row"];
