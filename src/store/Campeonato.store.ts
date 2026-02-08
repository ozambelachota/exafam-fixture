import { create } from "zustand";
import { getCampeonatos } from "../services/api.service";
import { Campeonato } from "./../types/fixture.api.type";

interface CampeonatoType {
  campeonatos: Campeonato[];
  campeonato: Campeonato;
  campeonatoParticipante: number;
  setCampeonato: (campeonato: Campeonato) => void;
  setCampeonatoParticipante: (campeonato: number) => void;
  getCampeonato: () => Promise<void>;
}
export const CampeonatoStore = create<CampeonatoType>((set) => ({
  campeonatos: [],
  campeonato: {
    id: 0,
    nombre_campeonato: "",
    estado: "en_curso",
    fecha_inicio: null,
    fecha_fin: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null,
  },
  campeonatoParticipante: 0,
  setCampeonato: (campeonato: Campeonato) => set({ campeonato }),
  setCampeonatoParticipante: (campeonato: number) =>
    set({ campeonatoParticipante: campeonato }),
  getCampeonato: async () => {
    try {
      const campeonato = await getCampeonatos();
      if (campeonato) set({ campeonatos: campeonato });
    } catch (error) {
      console.error(error);
    }
  },
}));
