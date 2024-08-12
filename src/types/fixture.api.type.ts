export interface Campeonato {
  id?: number;
  nombre_campeonato: string;
  user_id: string;
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
  create_at?: Date;
  promocion: number;
  goles_f: number;
  goles_e: number;
  diferencia_goles: number;
  grupo_id: number;
  puntos: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  promocion_participante?: {
    nombre_promocion: string;
  };
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
  }
}

export interface Deporte {
  id?: number;
  nombre_tipo: string;
}
export interface Promocional {
  id?: number;
  nombre_promocional: string;
  id_promocion_participante: number;
  n_goles: number;
}

export interface Resultado {
  id?: number;
  create_at?: Date;
  fixture_id: number;
  resultado: string;
  ganador_id: number | null;
  fixture_exafam: {
    promocion: string;
    vs_promocion: string;
    n_fecha_jugada: number;
    deporte_id: number;
    grupo_id: number;
  };
}

export interface TipoSancion {
  id?: number;
  nombre_tipo: string;
  cantidad_fecha: number;
}

export interface VoleyPosicion {
  id?: number;
  promocion: number;
  deporte_id: number;
  puntos: number;
  partidos_g: number;
  partidos_p: number;
  partidos_j: number;
  promocion_participante: {
    nombre_promocion: string;
  };
}
export interface PromocionalWithParticipante {
  id?: number;
  nombre_promocional: string;
  id_promocion_participante: number;
  n_goles: number;
  promocion_participante: {
    grupo_id: number;
    nombre_promocion: string;
  };
}

export interface PosicionTablaParticipante {
  id?: number;
  create_at?: Date;
  promocion: number;
  goles_f: number;
  goles_e: number;
  diferencia_goles: number;
  grupo_id: number;
  puntos: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  promocion_participante: {
    nombre_promocion: string;
  };
}

export interface PromocionalWhitId {
  id?: number;
  nombre_promocional: string;
  id_promocion_participante: number;
  n_goles: number;
  promocion_participante: {
    nombre_promocion: string;
  };
}
