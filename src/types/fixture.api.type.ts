import type { Database } from "./database.types";

// =====================================================
// Tipos derivados de la DB (source of truth)
// =====================================================
type Tables = Database["public"]["Tables"];
type Enums = Database["public"]["Enums"];

// Row types (lo que devuelve un SELECT)
export type CampeonatoRow = Tables["campeonato"]["Row"];
export type FixtureRow = Tables["fixture_exafam"]["Row"];
export type GrupoPromocionRow = Tables["grupos_promociones"]["Row"];
export type PromocionParticipanteRow = Tables["promocion_participante"]["Row"];
export type PromocionalesRow = Tables["promocionales"]["Row"];
export type ResultadoFixtureRow = Tables["resultado_fixture"]["Row"];
export type TablaPosicionRow = Tables["tabla_posicion"]["Row"];
export type VoleyPosicionRow = Tables["voley_posicion"]["Row"];
export type TipoSancionRow = Tables["tipo_sancion"]["Row"];
export type ListaJugadorSancionadoRow =
  Tables["lista_jugador_sancionado"]["Row"];
export type TipoDeporteRow = Tables["tipo_deporte"]["Row"];
export type UsuarioRow = Tables["usuario"]["Row"];

// Insert types (lo que mandas en un INSERT)
export type CampeonatoInsert = Tables["campeonato"]["Insert"];
export type FixtureInsert = Tables["fixture_exafam"]["Insert"];
export type PromocionParticipanteInsert =
  Tables["promocion_participante"]["Insert"];
export type PromocionalesInsert = Tables["promocionales"]["Insert"];
export type ResultadoFixtureInsert = Tables["resultado_fixture"]["Insert"];
export type TablaPosicionInsert = Tables["tabla_posicion"]["Insert"];
export type ListaJugadorSancionadoInsert =
  Tables["lista_jugador_sancionado"]["Insert"];

// Update types (lo que mandas en un UPDATE)
export type TablaPosicionUpdate = Tables["tabla_posicion"]["Update"];
export type PromocionalesUpdate = Tables["promocionales"]["Update"];
export type ListaJugadorSancionadoUpdate =
  Tables["lista_jugador_sancionado"]["Update"];

// Enum types
export type EstadoCampeonato = Enums["estado_campeonato"];

// =====================================================
// Interfaces extendidas (con relaciones/joins)
// =====================================================

export interface Campeonato {
  id?: number;
  nombre_campeonato: string;
  estado: EstadoCampeonato | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface Campo {
  id_campo: number;
  nombre_campo: string;
}

export interface Fixture {
  id?: number;
  promocion: string;
  vs_promocion: string;
  fecha_partido: Date;
  campo_id: number;
  grupo_id: number;
  deporte_id: number;
  n_fecha_jugada: number;
  por_jugar: boolean;
}

export interface GrupoPromocion {
  id: number;
  nombre_grupo: string;
}

export interface PromocionParticipante {
  id: number;
  nombre_promocion: string;
  estado: boolean;
  campeonato_id: number;
  grupo_id: number;
  tipo_id: number;
}

export interface TablaPosicion {
  id?: number;
  created_at?: string;
  promocion: number | null;
  goles_f: number | null;
  goles_c: number | null;
  diferencia_goles: number | null;
  grupo_id: number;
  puntos: number | null;
  pj: number | null;
  pg: number | null;
  pe: number | null;
  pp: number | null;
  promocion_participante?: {
    nombre_promocion: string;
  } | null;
}

export interface ListaDeuda {
  id?: number;
  nombre_jugador: string;
  estado: string;
  mes_deuda: Date;
  promocion_id: number;
}

export interface ListaSancion {
  id?: number;
  motivo_sancion: string;
  estado_sancion: boolean;
  monto_sancion: number;
  estado_pago_sancion: boolean;
  cant_tarjeta_amarilla: number;
  cant_tarjeta_roja: number;
  promocion_id: number;
  tipo_sancion: number;
  nombre_promocion: string;
  ultima_fecha: number;
  promocion_participante?: {
    nombre_promocion: string;
    grupo_id: number;
  };
}

export interface Deporte {
  id?: number;
  nombre_tipo: string;
}

export interface Promocional {
  id?: number;
  nombre_promocional: string;
  id_promocion_participante: number;
  n_goles: number | null;
}

export interface Resultado {
  id?: number;
  created_at?: string;
  fixture_id: number;
  resultado: string;
  ganador_id: number | null;
  fixture_exafam: {
    promocion: string;
    vs_promocion: string;
    n_fecha_jugada: number;
    deporte_id: number | null;
    grupo_id: number;
    por_jugar: boolean;
  } | null;
}

export interface TipoSancion {
  id?: number;
  nombre_tipo: string;
  cantidad_fecha: string | null;
}

export interface VoleyPosicion {
  id?: number;
  promocion: number;
  deporte_id: number;
  puntos: number;
  partidos_g: number | null;
  partidos_p: number | null;
  partidos_j: number | null;
  promocion_participante: {
    nombre_promocion: string;
  } | null;
}

export interface PromocionalWithParticipante {
  id?: number;
  nombre_promocional: string;
  id_promocion_participante: number;
  n_goles: number | null;
  promocion_participante: {
    grupo_id: number;
    nombre_promocion: string;
  } | null;
}

export interface PosicionTablaParticipante {
  id?: number;
  created_at?: string;
  promocion: number | null;
  goles_f: number | null;
  goles_c: number | null;
  diferencia_goles: number | null;
  grupo_id: number;
  puntos: number | null;
  pj: number | null;
  pg: number | null;
  pe: number | null;
  pp: number | null;
  promocion_participante: {
    nombre_promocion: string;
  } | null;
}

export interface PromocionalWhitId {
  id?: number;
  nombre_promocional: string;
  id_promocion_participante: number;
  n_goles: number | null;
  promocion_participante: {
    nombre_promocion: string;
  } | null;
}
