export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type BaseTable<T> = {
  Row: T
  Insert: Partial<T> & { id?: string }
  Update: Partial<T>
  Relationships: Array<{
    foreignKeyName: string
    columns: string[]
    isOneToOne: boolean
    referencedRelation: string
    referencedColumns: string[]
  }>
}

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          business_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          business_name: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          business_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      booking: {
        Row: {
          business_name: string | null
          cancellation_deadline: string | null
          carrier_name: string | null
          carrier_price: number | null
          created_at: string
          customer_type: string | null
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
          vat_number: string | null
          weight: string | null
        }
        Insert: {
          business_name?: string | null
          cancellation_deadline?: string | null
          carrier_name?: string | null
          carrier_price?: number | null
          created_at?: string
          customer_type?: string | null
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
          vat_number?: string | null
          weight?: string | null
        }
        Update: {
          business_name?: string | null
          cancellation_deadline?: string | null
          carrier_name?: string | null
          carrier_price?: number | null
          created_at?: string
          customer_type?: string | null
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
          vat_number?: string | null
          weight?: string | null
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
      high_volume_businesses: BaseTable<{
        id: string
        name: string
        vat_number: string
        address: string
        city: string
        postal_code: string
        country: string
        contact_person: string
        email: string
        phone: string
        created_at: string
        updated_at: string
      }>
      high_volume_shipments: BaseTable<{
        id: string
        business_id: string
        tracking_code: string
        recipient_name: string
        recipient_address: string
        recipient_city: string
        recipient_postal_code: string
        recipient_country: string
        package_weight: number
        package_length: number
        package_width: number
        package_height: number
        special_instructions: string | null
        label_url: string | null
        status: string
        created_at: string
        updated_at: string
      }>
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

type PublicSchema = Database["public"]
type TableName = keyof PublicSchema["Tables"]

export type Tables<T extends TableName> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends TableName> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends TableName> = PublicSchema["Tables"][T]["Update"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]
export type CompositeTypes<T extends keyof PublicSchema["CompositeTypes"]> = PublicSchema["CompositeTypes"][T]
