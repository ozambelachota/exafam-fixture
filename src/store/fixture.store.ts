import { create } from "zustand";
import {
  disableFixture,
  getPartidoId,
  insertFixturePartidos,
  obtenerGrupo,
  obtenerPromocionalesParticipantes,
  obtenerPromocionesPorGrupos,
} from "../services/api.service";
import type {
  GrupoPromocion,
  Fixture,
} from "../types/fixture.api.type";
import type { Tables } from "../types/database.types";
import { getPartidos } from "./../services/api.service";

// Usamos los tipos directos de la DB para lo que viene de Supabase
type PromocionParticipanteDB = Tables<"promocion_participante">;
type FixtureDB = Tables<"fixture_exafam">;

type FixtureStore = {
  promocionParticipante: PromocionParticipanteDB[];
  promocionesPorGrupos: PromocionParticipanteDB[];
  grupo: GrupoPromocion[];
  fixture: FixtureDB[] | [] | null;
  fixtureVoley: Fixture[];
  fecha: Date;
  fixtureFutbol: FixtureDB[] | [] | null;
  selectGrupo: number;
  emparejamiento: "automatico" | "manual";
  equipo1: string;
  equipo2: string;
  vsPromocion: Fixture[];
  partido: Fixture | FixtureDB;
  obtenerPromociones: () => Promise<void>;
  obtenerGrupo: () => Promise<void>;
  obtenerPromocionGrupo: (id: number) => Promise<void>;
  guardarPartido: (partido: Fixture[]) => Promise<void>;
  setEmparejamiento: (tipo: "automatico" | "manual") => void;
  setEquipo1: (equipo: string) => void;
  setEquipo2: (equipo: string) => void;
  setVsPromcion: (vsPromocion: Fixture[]) => void;
  obtenerPartidos: () => Promise<void>;
  buscarPartido: (id: number) => Promise<void>;
  setFecha: (fecha: Date) => void;
  desactivePartido: (fixture: Fixture) => Promise<void>;
  setFixturesFutbol: (fixture: FixtureDB[]) => void;
  setFixturesVoley: (fixture: Fixture[]) => void;
};

export const fixtureStore = create<FixtureStore>()((set) => ({
  partido: {
    id: 0,
    fecha_partido: new Date(),
    grupo_id: 0,
    promocion: "",
    deporte_id: 0,
    vs_promocion: "",
    por_jugar: false,
    n_fecha_jugada: 0,
    campo_id: 0,
  },
  promocionParticipante: [],
  promocionesPorGrupos: [],
  grupo: [
    {
      id: 0,
      nombre_grupo: "",
    },
  ],
  fixture: [],
  fecha: new Date(),
  selectGrupo: 1,
  emparejamiento: "automatico",
  equipo1: "",
  equipo2: "",
  vsPromocion: [
    {
      promocion: "",
      vs_promocion: "",
      fecha_partido: new Date(),
      grupo_id: 0,
      campo_id: 0,
      deporte_id: 0,
      n_fecha_jugada: 0,
      por_jugar: false,
    },
  ],

  obtenerPromociones: async () => {
    const promociones = await obtenerPromocionalesParticipantes();
    set({ promocionParticipante: promociones });
  },
  obtenerGrupo: async () => {
    const grupo = await obtenerGrupo();
    set({ grupo });
  },
  obtenerPromocionGrupo: async (id: number) => {
    const promociones = await obtenerPromocionesPorGrupos(id);
    set({ promocionesPorGrupos: promociones });
  },
  guardarPartido: async (partido: Fixture[]) => {
    const savePartido = await insertFixturePartidos(partido);
    set({ fixture: savePartido });
  },

  setEmparejamiento: (tipo: "automatico" | "manual") =>
    set({ emparejamiento: tipo }),
  setEquipo1: (equipo: string) => set({ equipo1: equipo }),
  setEquipo2: (equipoId: string) => set({ equipo2: equipoId }),
  setVsPromcion: (vsPromocion: Fixture[]) => set({ vsPromocion: vsPromocion }),
  obtenerPartidos: async () => {
    const partidos = await getPartidos();
    if (!partidos || partidos.length > 0) {
      set({ fixture: partidos });
    }
  },
  setFecha: (fecha: Date) => set({ fecha }),
  buscarPartido: async (id: number) => {
    const partido = await getPartidoId(id);
    if (partido !== null) {
      set({ partido });
    }
  },
  desactivePartido: async (fixture) => {
    const partido = await disableFixture(fixture);
    if (partido !== null) {
      set({ partido });
    }
  },
  fixtureFutbol: null,
  fixtureVoley: [],
  setFixturesFutbol: (fixture: FixtureDB[]) => set({ fixtureFutbol: fixture }),
  setFixturesVoley: (fixture: Fixture[]) => set({ fixtureVoley: fixture }),
}));
