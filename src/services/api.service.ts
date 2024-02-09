import { clientApi } from "../api/client.api";
import {
  Fixture,
  PromocionParticipante,
  Promocional,
} from "../types/fixture.api.type";
export const obtenerPromocionalesParticipantes = async () => {
  try {
    const { data: Promociones, error } = await clientApi
      .from("promocion_participante")
      .select();

    console.log(Promociones);
    console.log(error);
    if (error) throw error;
    return Promociones;
  } catch (error) {
    console.error("Error al obtener los promocionales participantes: ", error);
  }
};
export const obtenerGrupo = async () => {
  try {
    const { data: Grupo, error } = await clientApi
      .from("grupos_promociones")
      .select()
      .order("id", { ascending: true });

    if (error) throw error;
    return Grupo;
  } catch (error) {
    console.error("no se encontraron grupos : ", error);
  }
};
export const insertFixturePartidos = async (fixture: Fixture[]) => {
  const { data: fixtureData, error } = await clientApi
    .from("fixture_exafam")
    .insert(fixture);

  if (error) throw error;
  return fixtureData;
};

export const signOut = async () => {
  const { error } = await clientApi.auth.signOut();
  if (error) return error;
};

export const obtenerDeporte = async () => {
  const { data: deporte, error } = await clientApi
    .from("tipo_deporte")
    .select("*");
  if (error) throw error;
  return deporte;
};

export const obtenerPromocionesPorGrupos = async (id: number) => {
  try {
    const { data: promociones, error } = await clientApi
      .from("promocion_participante")
      .select("*")
      .eq("grupo_id", id);
    if (error) throw error;
    return promociones;
  } catch (error) {
    throw new Error("error al obtener promociones");
  }
};

export const insertarPromociones = async (promocional: Promocional) => {
  try {
    const { data: newPromocional, error } = await clientApi
      .from("promocionales")
      .insert(promocional);
    if (error) throw error;
    return { newPromocional, error };
  } catch (error) {
    throw new Error("error al agregar promocion " + error);
  }
};

export const obtenerTodosCampos = async () => {
  try {
    const { data: campos, error } = await clientApi.from("campo").select("*");

    if (error) throw error;

    return campos;
  } catch (error) {
    throw new Error("error al obtener promocion " + error);
  }
};

export const getPartidosFechaNoMayor = async () => {
  try {
    const { data, error } = await clientApi
      .from("fixture_exafam")
      .select("*")
      .order("fecha_partido", { ascending: true });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error al obtener partidos:", error);
    // Manejar el error según tus necesidades
    return null;
  }
};

export const userAdmin = async (
  userId: string
): Promise<string | undefined> => {
  try {
    const { data, error } = await clientApi
      .from("usuario")
      .select("rol")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);

    return data[0].rol;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const nombreCampeonato = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("Campeonato")
      .select("nombre_campeonato")
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data[0].nombre_campeonato;
  } catch (error) {
    throw new Error("error al obtener nombre " + error);
  }
};

export const deporteId = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("tipo_deporte")
      .select("*")
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};
export const insertPromocionParticipante = async (
  promocionParticipante: PromocionParticipante
) => {
  try {
    const { data, error } = await clientApi
      .from("promocion_participante")
      .insert(promocionParticipante);
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getCampeonatos = async () => {
  try {
    const { data, error } = await clientApi
      .from("Campeonato")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
}