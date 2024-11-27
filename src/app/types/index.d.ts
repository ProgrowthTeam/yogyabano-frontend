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
      Compan: {
        Row: {
          "Company id": string
          "Company name": number
          "Document index": string | null
          "Number of documents": string | null
          Payment: string | null
          "Query asked": string | null
          "Size taken": string | null
        }
        Insert: {
          "Company id"?: string
          "Company name"?: number
          "Document index"?: string | null
          "Number of documents"?: string | null
          Payment?: string | null
          "Query asked"?: string | null
          "Size taken"?: string | null
        }
        Update: {
          "Company id"?: string
          "Company name"?: number
          "Document index"?: string | null
          "Number of documents"?: string | null
          Payment?: string | null
          "Query asked"?: string | null
          "Size taken"?: string | null
        }
        Relationships: []
      }
      "Company payment": {
        Row: {
          "Company id": number
          "Paid amount": number | null
          "Payment date": string
          "Payment status": number | null
        }
        Insert: {
          "Company id"?: number
          "Paid amount"?: number | null
          "Payment date"?: string
          "Payment status"?: number | null
        }
        Update: {
          "Company id"?: number
          "Paid amount"?: number | null
          "Payment date"?: string
          "Payment status"?: number | null
        }
        Relationships: []
      }
      Employer: {
        Row: {
          email: string
          "Employment status": string | null
          Phone: number
          score: number | null
        }
        Insert: {
          email: string
          "Employment status"?: string | null
          Phone?: number
          score?: number | null
        }
        Update: {
          email?: string
          "Employment status"?: string | null
          Phone?: number
          score?: number | null
        }
        Relationships: []
      }
      USER: {
        Row: {
          about: string | null
          created_at: string
          Email: string | null
          "Employer id": string | null
          "F.name": string | null
          "L.name": string | null
          Occupation: string | null
          Password: string | null
          "Phone no": number
        }
        Insert: {
          about?: string | null
          created_at?: string
          Email?: string | null
          "Employer id"?: string | null
          "F.name"?: string | null
          "L.name"?: string | null
          Occupation?: string | null
          Password?: string | null
          "Phone no"?: number
        }
        Update: {
          about?: string | null
          created_at?: string
          Email?: string | null
          "Employer id"?: string | null
          "F.name"?: string | null
          "L.name"?: string | null
          Occupation?: string | null
          Password?: string | null
          "Phone no"?: number
        }
        Relationships: []
      }
      "User dashboard": {
        Row: {
          Email: string
          Field: string | null
          Phone: number
          "Save messages": string | null
          "Suggested query": string | null
        }
        Insert: {
          Email?: string
          Field?: string | null
          Phone?: number
          "Save messages"?: string | null
          "Suggested query"?: string | null
        }
        Update: {
          Email?: string
          Field?: string | null
          Phone?: number
          "Save messages"?: string | null
          "Suggested query"?: string | null
        }
        Relationships: []
      }
      "User Payment": {
        Row: {
          "Paid amount": number | null
          "Payment date": string
          "Payment status": boolean | null
          "Phone number": number
        }
        Insert: {
          "Paid amount"?: number | null
          "Payment date"?: string
          "Payment status"?: boolean | null
          "Phone number"?: number
        }
        Update: {
          "Paid amount"?: number | null
          "Payment date"?: string
          "Payment status"?: boolean | null
          "Phone number"?: number
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