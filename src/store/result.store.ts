import { create } from "zustand";
import { getResult } from "../services/api.service";
import type { Resultado } from "./../types/fixture.api.type";

interface storeResult {
  result: Resultado[];
  getResult: () => Promise<void>;
}


export const ResultStore = create<storeResult>()((set) => ({
  result: [
    {
      id: 0,
      create_at: new Date(),
      fixture_id: 0,
      resultado: "",
      ganador_id: 0,
      fixture_exafam: {
        n_fecha_jugada: 0,
        promocion: "",
        vs_promocion: "",
        deporte_id: 0,
        grupo_id: 0,
        por_jugar: false,
      }
    },
  ],
  getResult: async () => {
    try {
      const results = await getResult();
      if (results) {
        set({ result: results });
      }
    } catch (error) {
      console.error(error);
    }
  },
}));
