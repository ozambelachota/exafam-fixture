import { clientApi } from "../api/client.api";
import { Fixture, Promocional } from "../types/fixture.api.type";
export const obtenerPromocionalesParticipantes = async () => {
  try {
    const { data: Promociones, error } = await clientApi
      .from("promocion_participante")
      .select();
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
      .select();

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

export const obtenerDeporte = async (id: number) => {
  const { data: deporte, error } = await clientApi
    .from("tipo_deporte")
    .select("nombre_tipo")
    .eq("id", id);
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
    console.log(data);
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

    console.log(data);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
