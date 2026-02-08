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
      campeonato: {
        Row: {
          created_at: string
          id: number
          nombre_campeonato: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nombre_campeonato: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nombre_campeonato?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fixture_exafam: {
        Row: {
          campo_id: number | null
          created_at: string
          deporte_id: number | null
          fecha_partido: string | null
          grupo_id: number
          id: number
          n_fecha_jugada: number
          por_jugar: boolean
          promocion: string
          updated_at: string
          vs_promocion: string
        }
        Insert: {
          campo_id?: number | null
          created_at?: string
          deporte_id?: number | null
          fecha_partido?: string | null
          grupo_id: number
          id?: number
          n_fecha_jugada: number
          por_jugar?: boolean
          promocion: string
          updated_at?: string
          vs_promocion: string
        }
        Update: {
          campo_id?: number | null
          created_at?: string
          deporte_id?: number | null
          fecha_partido?: string | null
          grupo_id?: number
          id?: number
          n_fecha_jugada?: number
          por_jugar?: boolean
          promocion?: string
          updated_at?: string
          vs_promocion?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixture_exafam_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos_promociones"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos_promociones: {
        Row: {
          created_at: string
          id: number
          nombre_grupo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          nombre_grupo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          nombre_grupo?: string
          updated_at?: string
        }
        Relationships: []
      }
      lista_jugador_sancionado: {
        Row: {
          cant_tarjeta_amarilla: number | null
          cant_tarjeta_roja: number | null
          created_at: string
          estado_pago_sancion: boolean | null
          estado_sancion: boolean | null
          id: number
          monto_sancion: number | null
          motivo_sancion: string | null
          n_fecha: number | null
          nombre_promocion: string | null
          promocion_id: number | null
          tipo_sancion: number | null
          ultima_fecha: number | null
          updated_at: string
        }
        Insert: {
          cant_tarjeta_amarilla?: number | null
          cant_tarjeta_roja?: number | null
          created_at?: string
          estado_pago_sancion?: boolean | null
          estado_sancion?: boolean | null
          id?: number
          monto_sancion?: number | null
          motivo_sancion?: string | null
          n_fecha?: number | null
          nombre_promocion?: string | null
          promocion_id?: number | null
          tipo_sancion?: number | null
          ultima_fecha?: number | null
          updated_at?: string
        }
        Update: {
          cant_tarjeta_amarilla?: number | null
          cant_tarjeta_roja?: number | null
          created_at?: string
          estado_pago_sancion?: boolean | null
          estado_sancion?: boolean | null
          id?: number
          monto_sancion?: number | null
          motivo_sancion?: string | null
          n_fecha?: number | null
          nombre_promocion?: string | null
          promocion_id?: number | null
          tipo_sancion?: number | null
          ultima_fecha?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lista_jugador_sancionado_promocion_id_fkey"
            columns: ["promocion_id"]
            isOneToOne: false
            referencedRelation: "promocion_participante"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lista_jugador_sancionado_tipo_sancion_fkey"
            columns: ["tipo_sancion"]
            isOneToOne: false
            referencedRelation: "tipo_sancion"
            referencedColumns: ["id"]
          },
        ]
      }
      promocion_participante: {
        Row: {
          campeonato_id: number | null
          created_at: string
          estado: boolean
          grupo_id: number | null
          id: number
          nombre_promocion: string
          tipo_id: number | null
          updated_at: string
        }
        Insert: {
          campeonato_id?: number | null
          created_at?: string
          estado?: boolean
          grupo_id?: number | null
          id?: number
          nombre_promocion: string
          tipo_id?: number | null
          updated_at?: string
        }
        Update: {
          campeonato_id?: number | null
          created_at?: string
          estado?: boolean
          grupo_id?: number | null
          id?: number
          nombre_promocion?: string
          tipo_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promocion_participante_campeonato_id_fkey"
            columns: ["campeonato_id"]
            isOneToOne: false
            referencedRelation: "campeonato"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promocion_participante_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos_promociones"
            referencedColumns: ["id"]
          },
        ]
      }
      promocionales: {
        Row: {
          created_at: string
          id: number
          id_promocion_participante: number
          n_goles: number | null
          nombre_promocional: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          id_promocion_participante: number
          n_goles?: number | null
          nombre_promocional: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          id_promocion_participante?: number
          n_goles?: number | null
          nombre_promocional?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promocionales_id_promocion_participante_fkey"
            columns: ["id_promocion_participante"]
            isOneToOne: false
            referencedRelation: "promocion_participante"
            referencedColumns: ["id"]
          },
        ]
      }
      resultado_fixture: {
        Row: {
          created_at: string
          fixture_id: number | null
          ganador_id: number | null
          id: number
          resultado: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fixture_id?: number | null
          ganador_id?: number | null
          id?: number
          resultado?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fixture_id?: number | null
          ganador_id?: number | null
          id?: number
          resultado?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resultado_fixture_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: false
            referencedRelation: "fixture_exafam"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultado_fixture_ganador_id_fkey"
            columns: ["ganador_id"]
            isOneToOne: false
            referencedRelation: "promocion_participante"
            referencedColumns: ["id"]
          },
        ]
      }
      tabla_posicion: {
        Row: {
          created_at: string
          diferencia_goles: number | null
          goles_c: number | null
          goles_f: number | null
          grupo_id: number
          id: number
          pe: number | null
          pg: number | null
          pj: number | null
          pp: number | null
          promocion: number | null
          puntos: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          diferencia_goles?: number | null
          goles_c?: number | null
          goles_f?: number | null
          grupo_id: number
          id?: number
          pe?: number | null
          pg?: number | null
          pj?: number | null
          pp?: number | null
          promocion?: number | null
          puntos?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          diferencia_goles?: number | null
          goles_c?: number | null
          goles_f?: number | null
          grupo_id?: number
          id?: number
          pe?: number | null
          pg?: number | null
          pj?: number | null
          pp?: number | null
          promocion?: number | null
          puntos?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tabla_posicion_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos_promociones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabla_posicion_promocion_fkey"
            columns: ["promocion"]
            isOneToOne: false
            referencedRelation: "promocion_participante"
            referencedColumns: ["id"]
          },
        ]
      }
      tipo_sancion: {
        Row: {
          cantidad_fecha: string | null
          created_at: string
          id: number
          nombre_tipo: string
          updated_at: string
        }
        Insert: {
          cantidad_fecha?: string | null
          created_at?: string
          id?: number
          nombre_tipo: string
          updated_at?: string
        }
        Update: {
          cantidad_fecha?: string | null
          created_at?: string
          id?: number
          nombre_tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      usuario: {
        Row: {
          created_at: string
          id: number
          rol: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          rol: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          rol?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      voley_posicion: {
        Row: {
          created_at: string
          deporte_id: number
          id: number
          partidos_g: number | null
          partidos_j: number | null
          partidos_p: number | null
          promocion: number
          puntos: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deporte_id: number
          id?: number
          partidos_g?: number | null
          partidos_j?: number | null
          partidos_p?: number | null
          promocion: number
          puntos?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deporte_id?: number
          id?: number
          partidos_g?: number | null
          partidos_j?: number | null
          partidos_p?: number | null
          promocion?: number
          puntos?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voley_posicion_promocion_fkey"
            columns: ["promocion"]
            isOneToOne: false
            referencedRelation: "promocion_participante"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const

