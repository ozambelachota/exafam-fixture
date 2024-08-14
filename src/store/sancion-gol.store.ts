import { create } from "zustand";
import {
  getByIdPromocionales,
  getGoles,
  getPromocionales,
  getSanciones,
  insertedJugadorSancionado,
  jugadorSancionadoById,
  obtenerPromocionWithParticipantes,
  promocionesParticipantesByGrupoId,
  updateJugadorSancionado,
} from "../services/api.service";
import type {
  ListaSancion,
  PromocionParticipante,
  Promocional,
  PromocionalWithParticipante,
  TipoSancion,
} from "../types/fixture.api.type";
import { tipoSanciones } from "./../services/api.service";

interface SancionGolState {
  tipoSancion: TipoSancion[];
  idPromocionParticipante: number;
  setIdPromocionParticipante: (id: number) => void;
  promocionesPartipantes: PromocionParticipante[];
  obtenerPromocionalesPorParticipante: (id: number) => Promise<void>;
  sancion: ListaSancion[];
  jugadorSancionado: ListaSancion;
  goleadoor: Promocional[];
  getSancion: () => Promise<void>;
  getTipoSancion: () => Promise<void>;
  getGoles: () => Promise<void>;
  promocionales: Promocional[];
  obtenerPromocionales: () => Promise<void>;
  insertJugadorSancion: (sancion: ListaSancion) => Promise<void>;
  jugadorSancionadoById: (id: number) => Promise<void>;
  sancionadoId: ListaSancion;
  setSancionJugador: (sancion: ListaSancion) => void;
  getPromocionesParticipantesPorGrupo: (idGrupo: number) => Promise<void>;
  updateJugadorSancion: (sancion: ListaSancion) => Promise<void>;
  setEditarSancion: (sancion: ListaSancion) => void;
  promocionWithParticipante: PromocionalWithParticipante[];
  getPromocionWithParticipante: () => Promise<void>;
}

export const useSancionGolStore = create<SancionGolState>((set) => ({
  tipoSancion: [],
  grupoSelect: 0,
  sancion: [],
  goleadoor: [],
  promocionales: [],
  promocionesPartipantes: [],
  idPromocionParticipante: 0,
  setIdPromocionParticipante: (id: number) => {
    set({ idPromocionParticipante: id });
  },
  promocionalesYparticipante: [],
  getPromocionesParticipantesPorGrupo: async (
    grupoId: number,
    tipoId: number = 1
  ) => {
    if (grupoId < 0) {
      set({ promocionesPartipantes: [] });
    } else {
      const promocionParticipantes = await promocionesParticipantesByGrupoId(
        grupoId,
        tipoId
      );
      if (!promocionParticipantes) return;

      set({
        promocionesPartipantes: promocionParticipantes.map(participante => ({
          ...participante,
          campeonato_id: participante.campeonato_id ?? 0,
          estado: participante.estado ?? false,
          grupo_id: participante.grupo_id ?? 0,
          nombre_promocion: participante.nombre_promocion ?? '',
          tipo_id: participante.tipo_id ?? 0
        }))
      });
    }
  },
  promocionParticipanteSelect: 0,
  obtenerPromocionalesPorParticipante: async (id: number) => {
    const promocionales = await getByIdPromocionales(id);
    if (!promocionales) return;
    set({
      promocionales: promocionales.map(promocional => ({
        ...promocional,
        nombre_promocional: promocional.nombre_promocional ?? '',
        n_goles: promocional.n_goles ?? 0
      }))
    });
  },
  setSancionJugador: (jugador: ListaSancion) => {
    set({ jugadorSancionado: jugador });
  },
  jugadorSancionado: {
    promocion_id: 0,
    nombre_promocion: "",
    tipo_sancion: 0,
    cant_tarjeta_amarilla: 0,
    cant_tarjeta_roja: 0,
    estado_pago_sancion: false,
    estado_sancion: true,
    monto_sancion: 0,
    motivo_sancion: "",
    ultima_fecha: 0,
  },
  jugadorSancionadoById: async (id: number) => {
    const jugadorSancionado = await jugadorSancionadoById(id);
    if (!jugadorSancionado || id <= 0) return;
    set({
      sancionadoId: {
        ...jugadorSancionado,
        promocion_id: jugadorSancionado.promocion_id ?? 0,
        nombre_promocion: jugadorSancionado.nombre_promocion ?? "",
        tipo_sancion: jugadorSancionado.tipo_sancion ?? 0,
        cant_tarjeta_amarilla: jugadorSancionado.cant_tarjeta_amarilla ?? 0,
        cant_tarjeta_roja: jugadorSancionado.cant_tarjeta_roja ?? 0,
        estado_pago_sancion: jugadorSancionado.estado_pago_sancion ?? false,
        estado_sancion: jugadorSancionado.estado_sancion ?? true,
        monto_sancion: jugadorSancionado.monto_sancion ?? 0,
        motivo_sancion: jugadorSancionado.motivo_sancion ?? "",
        ultima_fecha: jugadorSancionado.ultima_fecha ?? 0,
      }
    });
  },
  sancionadoId: {
    id: 0,
    promocion_id: 0,
    nombre_promocion: "",
    tipo_sancion: 0,
    cant_tarjeta_amarilla: 0,
    cant_tarjeta_roja: 0,
    estado_pago_sancion: false,
    estado_sancion: true,
    ultima_fecha: 0,
    monto_sancion: 0,
    motivo_sancion: "",
  },
  obtenerPromocionales: async () => {
    const promocionales = await getPromocionales();
    if (!promocionales) return;
    set({ promocionales: promocionales.map(p => ({
      ...p,
      nombre_promocional: p.nombre_promocional || '',
      n_goles: p.n_goles || 0
    })) });
  },
  getSancion: async () => {
    const sancion = await getSanciones();
    if (!sancion) return;
    set({
      sancion: sancion.map(item => ({
        ...item,
        motivo_sancion: item.motivo_sancion || '',
        cant_tarjeta_amarilla: item.cant_tarjeta_amarilla || 0,
        cant_tarjeta_roja: item.cant_tarjeta_roja || 0,
        estado_pago_sancion: item.estado_pago_sancion || false,
        estado_sancion: item.estado_sancion || false,
        monto_sancion: item.monto_sancion || 0,
        promocion_id: item.promocion_id || 0,
        tipo_sancion: item.tipo_sancion || 0,
        nombre_promocion: item.nombre_promocion || '',
      })) as ListaSancion[]
    });
  },
  getGoles: async () => {
    const goles = await getGoles();
    if (!goles) return;
    set({
      goleadoor: goles.map(gol => ({
        ...gol,
        nombre_promocional: gol.nombre_promocional || '',
        n_goles: gol.n_goles || 0
      }))
    });
  },
  getTipoSancion: async () => {
    const tipoSancion = await tipoSanciones();
    if (!tipoSancion) return;
    set({
      tipoSancion: tipoSancion.map(item => ({
        ...item,
        cantidad_fecha: item.cantidad_fecha || 0,
        nombre_tipo: item.nombre_tipo || '',
      })) as TipoSancion[]
    });
  },
  insertJugadorSancion: async (sancion: ListaSancion) => {
    await insertedJugadorSancionado(sancion);
    console.log(sancion);
    if (!sancion) return;
    set({ jugadorSancionado: sancion });
  },
  updateJugadorSancion: async (sancion: ListaSancion) => {
    if (!sancion) return;
    const jugador = await updateJugadorSancionado(sancion);
    if (!jugador) return;
    set({ sancionadoId: jugador });
  },
  setEditarSancion: (jugador: ListaSancion) => {
    set({ sancionadoId: jugador });
  },
  promocionWithParticipante: [],
  getPromocionWithParticipante: async () => {
    const promocionWithParticipanteData =
      await obtenerPromocionWithParticipantes();
    if (!promocionWithParticipanteData) return;

    set({
      promocionWithParticipante: promocionWithParticipanteData.map(item => ({
        ...item,
        nombre_promocional: item.nombre_promocional || '',
        n_goles: item.n_goles || 0,
        promocion_participante: item.promocion_participante ? {
          ...item.promocion_participante,
          nombre_promocion: item.promocion_participante.nombre_promocion || '',
          grupo_id: item.promocion_participante.grupo_id || 0
        } : { nombre_promocion: '', grupo_id: 0 }
      })) as PromocionalWithParticipante[]
    });
  },
}));
