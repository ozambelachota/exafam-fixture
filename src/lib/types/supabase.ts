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
      Campeonato: {
        Row: {
          created_at: string
          id: number
          nombre_campeonato: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nombre_campeonato?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nombre_campeonato?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fixture_exafam: {
        Row: {
          campo_id: number | null
          deporte_id: number | null
          fecha_partido: string | null
          grupo_id: number
          id: number
          n_fecha_jugada: number
          por_jugar: boolean
          promocion: string | null
          vs_promocion: string | null
        }
        Insert: {
          campo_id?: number | null
          deporte_id?: number | null
          fecha_partido?: string | null
          grupo_id: number
          id?: number
          n_fecha_jugada: number
          por_jugar?: boolean
          promocion?: string | null
          vs_promocion?: string | null
        }
        Update: {
          campo_id?: number | null
          deporte_id?: number | null
          fecha_partido?: string | null
          grupo_id?: number
          id?: number
          n_fecha_jugada?: number
          por_jugar?: boolean
          promocion?: string | null
          vs_promocion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_fixture_exafam_grupo_id_fkey"
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
          nombre_grupo: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nombre_grupo?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nombre_grupo?: string | null
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
        }
        Relationships: [
          {
            foreignKeyName: "lista_jugador_sancionado_promocion_id_fkey"
            columns: ["promocion_id"]
            isOneToOne: false
            referencedRelation: "promocion_participante"
            referencedColumns: ["id"]
          },
        ]
      }
      promocion_participante: {
        Row: {
          campeonato_id: number | null
          estado: boolean | null
          grupo_id: number | null
          id: number
          nombre_promocion: string | null
          tipo_id: number | null
        }
        Insert: {
          campeonato_id?: number | null
          estado?: boolean | null
          grupo_id?: number | null
          id?: number
          nombre_promocion?: string | null
          tipo_id?: number | null
        }
        Update: {
          campeonato_id?: number | null
          estado?: boolean | null
          grupo_id?: number | null
          id?: number
          nombre_promocion?: string | null
          tipo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promocion_participante_campeonato_id_fkey"
            columns: ["campeonato_id"]
            isOneToOne: false
            referencedRelation: "Campeonato"
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
          id: number
          id_promocion_participante: number
          n_goles: number | null
          nombre_promocional: string | null
        }
        Insert: {
          id?: number
          id_promocion_participante: number
          n_goles?: number | null
          nombre_promocional?: string | null
        }
        Update: {
          id?: number
          id_promocion_participante?: number
          n_goles?: number | null
          nombre_promocional?: string | null
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
        }
        Insert: {
          created_at?: string
          fixture_id?: number | null
          ganador_id?: number | null
          id?: number
          resultado?: string | null
        }
        Update: {
          created_at?: string
          fixture_id?: number | null
          ganador_id?: number | null
          id?: number
          resultado?: string | null
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
          goles_e: number | null
          goles_f: number | null
          grupo_id: number
          id: number
          pe: number | null
          pg: number | null
          pj: number | null
          pp: number | null
          promocion: number | null
          puntos: number | null
        }
        Insert: {
          created_at?: string
          diferencia_goles?: number | null
          goles_e?: number | null
          goles_f?: number | null
          grupo_id?: number
          id?: number
          pe?: number | null
          pg?: number | null
          pj?: number | null
          pp?: number | null
          promocion?: number | null
          puntos?: number | null
        }
        Update: {
          created_at?: string
          diferencia_goles?: number | null
          goles_e?: number | null
          goles_f?: number | null
          grupo_id?: number
          id?: number
          pe?: number | null
          pg?: number | null
          pj?: number | null
          pp?: number | null
          promocion?: number | null
          puntos?: number | null
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
          nombre_tipo: string | null
        }
        Insert: {
          cantidad_fecha?: string | null
          created_at?: string
          id?: number
          nombre_tipo?: string | null
        }
        Update: {
          cantidad_fecha?: string | null
          created_at?: string
          id?: number
          nombre_tipo?: string | null
        }
        Relationships: []
      }
      usuario: {
        Row: {
          id: number
          rol: string
          user_id: string | null
        }
        Insert: {
          id?: number
          rol: string
          user_id?: string | null
        }
        Update: {
          id?: number
          rol?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Voley_posicion: {
        Row: {
          deporte_id: number
          id: number
          partidos_g: number | null
          partidos_j: number | null
          partidos_p: number | null
          promocion: number
          puntos: number
        }
        Insert: {
          deporte_id: number
          id?: number
          partidos_g?: number | null
          partidos_j?: number | null
          partidos_p?: number | null
          promocion: number
          puntos: number
        }
        Update: {
          deporte_id?: number
          id?: number
          partidos_g?: number | null
          partidos_j?: number | null
          partidos_p?: number | null
          promocion?: number
          puntos?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_Voley_posicion_promocion_fkey"
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
