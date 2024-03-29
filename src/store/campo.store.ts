import { create } from "zustand";
import { obtenerTodosCampos } from "../services/api.service";
import { Campo } from "./../types/fixture.api.type";

interface CampoType {
  campos: Campo[];
  campoSelect: number;
  obtenrCampos: () => Promise<void>;
  selectCampo: (id: number) => void;
}

export const CampoStore = create<CampoType>()((set) => ({
  campos: [
    {
      id_campo: 0,
      nombre_campo: "",
    },
  ],
  campoSelect: 0,
  obtenrCampos: async () => {
    const campos = await obtenerTodosCampos();
    set({ campos });
  },
  selectCampo: (id: number) => {
    if (id <= 0) {
      console.error("no hay ningun campo seleccionado");
    } else {
      set({ campoSelect: id });
    }
  },
}));
