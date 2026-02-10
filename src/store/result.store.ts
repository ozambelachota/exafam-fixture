import { create } from "zustand";
import { getResult } from "../services/api.service";
import type { Resultado } from "./../types/fixture.api.type";

interface storeResult {
  result: Resultado[];
  getResult: () => Promise<void>;
}


export const ResultStore = create<storeResult>()((set) => ({
  result: [],
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
