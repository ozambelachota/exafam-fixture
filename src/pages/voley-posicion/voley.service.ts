import { clientApi } from "../../api/client.api";
import { Voley } from "./types/voley.type";

export const voley = async (deporteId: number = 2) => {
  try {
    const { data, error } = await clientApi
      .from("voley_posicion")
      .select("*,promocion_participante(nombre_promocion)")
      .eq("deporte_id", deporteId)
      .order("puntos", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const updateVoley = async (data: Voley) => {
  try {
    if (data.id === undefined) {
      throw new Error("Invalid id: id is undefined");
    }
    const { data: result, error } = await clientApi
      .from("voley_posicion")
      .update({   
        promocion: data.promocion,
        deporte_id: data.deporte_id,
        puntos: data.puntos,
        partidos_g: data.partidos_g,
        partidos_p: data.partidos_p,
        partidos_j: data.partidos_j
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return result;
  } catch (error) {
    console.error(error);
  }
};
