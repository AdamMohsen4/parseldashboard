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
      booking: {
        Row: {
          carrier_name: string | null
          carrier_price: number | null
          created_at: string
          delivery_address: string | null
          delivery_speed: string | null
          dimension_height: string | null
          dimension_length: string | null
          dimension_width: string | null
          estimated_delivery: string | null
          id: number
          include_compliance: boolean | null
          label_url: string | null
          pickup_address: string | null
          pickup_time: string | null
          status: string | null
          total_price: number | null
          tracking_code: string | null
          user_id: string | null
          weight: string | null
        }
        Insert: {
          carrier_name?: string | null
          carrier_price?: number | null
          created_at?: string
          delivery_address?: string | null
          delivery_speed?: string | null
          dimension_height?: string | null
          dimension_length?: string | null
          dimension_width?: string | null
          estimated_delivery?: string | null
          id?: number
          include_compliance?: boolean | null
          label_url?: string | null
          pickup_address?: string | null
          pickup_time?: string | null
          status?: string | null
          total_price?: number | null
          tracking_code?: string | null
          user_id?: string | null
          weight?: string | null
        }
        Update: {
          carrier_name?: string | null
          carrier_price?: number | null
          created_at?: string
          delivery_address?: string | null
          delivery_speed?: string | null
          dimension_height?: string | null
          dimension_length?: string | null
          dimension_width?: string | null
          estimated_delivery?: string | null
          id?: number
          include_compliance?: boolean | null
          label_url?: string | null
          pickup_address?: string | null
          pickup_time?: string | null
          status?: string | null
          total_price?: number | null
          tracking_code?: string | null
          user_id?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      collaborations: {
        Row: {
          business_name: string
          contact_email: string
          contact_phone: string
          created_at: string
          destination: string
          frequency: string
          id: string
          next_shipment_date: string
          notes: string | null
          user_id: string
          volume: string
        }
        Insert: {
          business_name: string
          contact_email: string
          contact_phone: string
          created_at?: string
          destination: string
          frequency: string
          id?: string
          next_shipment_date: string
          notes?: string | null
          user_id: string
          volume: string
        }
        Update: {
          business_name?: string
          contact_email?: string
          contact_phone?: string
          created_at?: string
          destination?: string
          frequency?: string
          id?: string
          next_shipment_date?: string
          notes?: string | null
          user_id?: string
          volume?: string
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company: string | null
          created_at: string
          demo_type: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_date: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          demo_type?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_date?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          demo_type?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_date?: string | null
          status?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string | null
          id: string
          is_admin: boolean | null
          message: string
          ticket_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          message: string
          ticket_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          message?: string
          ticket_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message: string
          priority: string
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      three_pl_requests: {
        Row: {
          average_orders_per_month: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string | null
          custom_requirements: string | null
          document_url: string | null
          estimated_volume: string | null
          hazardous_materials: boolean | null
          id: string
          integration_needed: boolean | null
          integration_systems: string[] | null
          international_shipping: boolean | null
          peak_season_months: string[] | null
          product_category: string | null
          product_type: string | null
          request_id: string | null
          security_requirements: string | null
          special_handling_needed: boolean | null
          special_handling_notes: string | null
          temperature_controlled: boolean | null
          user_id: string
        }
        Insert: {
          average_orders_per_month?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string | null
          custom_requirements?: string | null
          document_url?: string | null
          estimated_volume?: string | null
          hazardous_materials?: boolean | null
          id?: string
          integration_needed?: boolean | null
          integration_systems?: string[] | null
          international_shipping?: boolean | null
          peak_season_months?: string[] | null
          product_category?: string | null
          product_type?: string | null
          request_id?: string | null
          security_requirements?: string | null
          special_handling_needed?: boolean | null
          special_handling_notes?: string | null
          temperature_controlled?: boolean | null
          user_id: string
        }
        Update: {
          average_orders_per_month?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          custom_requirements?: string | null
          document_url?: string | null
          estimated_volume?: string | null
          hazardous_materials?: boolean | null
          id?: string
          integration_needed?: boolean | null
          integration_systems?: string[] | null
          international_shipping?: boolean | null
          peak_season_months?: string[] | null
          product_category?: string | null
          product_type?: string | null
          request_id?: string | null
          security_requirements?: string | null
          special_handling_needed?: boolean | null
          special_handling_notes?: string | null
          temperature_controlled?: boolean | null
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
