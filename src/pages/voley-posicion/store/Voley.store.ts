import {create} from 'zustand'
import { Voley } from '../types/voley.type'
import { updateVoley, voley } from '../voley.service'

interface VoleyStore {
  voleys: Voley[],
  voley: Voley
  setVoley: (voley: Voley) => void
  getVoley: (deporte:number) => void
  updateVoleySet: (voley: Voley) => Promise<void>
}
export const useVoleyStore = create<VoleyStore>()((set) => ({
  voleys: [],
  voley:{
    id: 0,
    promocion: 0,
    deporte_id: 0,
    puntos: 0,
    partidos_g: 0,
    partidos_p: 0,
    partidos_j: 0,
    promocion_participante: {
      nombre_promocion: "",
    }
  }, 
  setVoley: (voley) => set({ voley }),
  getVoley: async (deporte: number) => {
    const tblVoley = await voley(deporte);
    if (tblVoley) {
      const validVoleys: Voley[] = tblVoley.map(item => ({
        ...item,
        partidos_g: item.partidos_g ?? 0,
        partidos_j: item.partidos_j ?? 0,
        partidos_p: item.partidos_p ?? 0,
        promocion_participante: item.promocion_participante ? {
          nombre_promocion: item.promocion_participante.nombre_promocion ?? ""
        } : undefined
      }));
      set({ voleys: validVoleys });
    } else {
      set({ voleys: [] });
    }
  },
  updateVoleySet: async (voley:Voley) => {
    const voleyNew = await updateVoley(voley);
    console.log(voleyNew)
    if(voleyNew)  
    set({ voley: voleyNew });
  }
}))
