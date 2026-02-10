import { create } from "zustand";
import {
  getTablaPosiciones,
  promocionesPosicionPorGrupo,
  promocionTablaPosicionById,
  updatingTablaPosicionFutbol,
} from "../services/api.service";
import type {
  PosicionTablaParticipante,
  TablaPosicion,
} from "../types/fixture.api.type";

interface PosicionType {
  tablaPosicion: TablaPosicion[];
  tablaPosicionGrupo: PosicionTablaParticipante[];
  promocionTablaPosicion: PosicionTablaParticipante
  promocionPosicion: TablaPosicion;
  uploadTablaPosicion: () => Promise<void>;
  updatingTablaPosicionFutbol: (
    promocionPosicion: TablaPosicion
  ) => Promise<void>;
  getPosicionByIdPromocion: (id: number) => Promise<void>;
  getPosicionGrupo: (id: number) => Promise<void>;
}

export const PosicionStore = create<PosicionType>()((set) => ({
  tablaPosicion: [],
  promocionPosicion: {
    id: 0,
    promocion: 0,
    goles_f: 0,
    goles_c: 0,
    puntos: 0,
    diferencia_goles: 0,
    grupo_id: 0,
    pj: 0,
    pg: 0,
    pp: 0,
    pe: 0,
  },
  tablaPosicionGrupo: [],
  promocionTablaPosicion: {
    id: 0,
    promocion: 0,
    goles_f: 0,
    goles_c: 0,
    puntos: 0,
    diferencia_goles: 0,
    grupo_id: 0,
    pj: 0,
    pg: 0,
    pp: 0,
    pe: 0,
    promocion_participante: {
      nombre_promocion: "",
    },
  },
  uploadTablaPosicion: async () => {
    const tablaPosicion = await getTablaPosiciones();
    set({ tablaPosicion });
  },
  updatingTablaPosicionFutbol: async (promocionPosicion: TablaPosicion) => {
    const tablaPosicion = await updatingTablaPosicionFutbol(promocionPosicion);
    if (!tablaPosicion) return;
    set({ tablaPosicion });
  },
  getPosicionGrupo: async (id: number) => {
    const promocionPosicion = await promocionesPosicionPorGrupo(id);
    if (!promocionPosicion) return;
    set({ tablaPosicionGrupo: promocionPosicion });
  },
  getPosicionByIdPromocion: async (id: number) => {
    const promocionPosicion = await promocionTablaPosicionById(id);
    if (!promocionPosicion) return;
    set({ promocionTablaPosicion: promocionPosicion });
  },
}));
