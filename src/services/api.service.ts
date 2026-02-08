import { clientApi } from "../api/client.api";
import type { FormResult } from "../store/resultado.store";
import type {
  Fixture,
  ListaSancion,
  PromocionParticipante,
  Promocional,
  TablaPosicion,
} from "../types/fixture.api.type";
export const obtenerPromocionalesParticipantes = async () => {
  try {
    const { data: Promociones, error } = await clientApi
      .from("promocion_participante")
      .select("*");

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
    .insert(
      fixture.map((item) => ({
        ...item,
        grupo_id: item.grupo_id ?? 0,
        n_fecha_jugada: item.n_fecha_jugada ?? 0,
        fecha_partido: item.fecha_partido?.toISOString(),
      })),
    );

  if (error) throw error;
  return fixtureData;
};

export const signOut = async () => {
  const { error } = await clientApi.auth.signOut();
  if (error) return error;
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
    return newPromocional;
  } catch (error) {
    throw new Error("error al agregar promocion " + error);
  }
};

export const getPartidosFutbol = async () => {
  try {
    const { data, error } = await clientApi
      .from("fixture_exafam")
      .select("*")
      .eq("deporte_id", 1)
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
export const getPartidosVoley = async () => {
  try {
    const { data, error } = await clientApi
      .from("fixture_exafam")
      .select("*")
      .neq("deporte_id", 1)
      .order("fecha_partido", { ascending: true });

    console.log(error?.message);
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
export const userAdmin = async (userId: string) => {
  try {
    const { data, error } = await clientApi
      .from("usuario")
      .select("rol")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    console.log(data);
    return data[0].rol;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const nombreCampeonato = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("campeonato")
      .select("nombre_campeonato")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data.nombre_campeonato;
  } catch (error) {
    throw new Error("error al obtener nombre " + error);
  }
};

export const getCampeonatoById = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("campeonato")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw new Error("error al obtener campeonato " + error);
  }
};

export const toggleCampeonatoEstado = async (
  id: number,
  estado: "en_curso" | "finalizado",
) => {
  try {
    const updates: any = { estado };
    if (estado === "finalizado") {
      updates.fecha_fin = new Date().toISOString();
    } else {
      updates.fecha_fin = null;
    }

    const { data, error } = await clientApi
      .from("campeonato")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error("error al cambiar estado del campeonato " + error);
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
  promocionParticipante: PromocionParticipante,
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
      .from("campeonato")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getPartidos = async () => {
  try {
    const { data, error } = await clientApi
      .from("fixture_exafam")
      .select("*")
      .order("n_fecha_jugada,grupo_id,fecha_partido, deporte_id", {
        ascending: true,
      });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getResult = async () => {
  try {
    const { data, error } = await clientApi
      .from("resultado_fixture")
      .select(
        "*,fixture_exafam(promocion,vs_promocion,n_fecha_jugada,deporte_id,grupo_id,por_jugar)",
      )
      .order("fixture_id", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getTablaPosiciones = async () => {
  try {
    const { data, error } = await clientApi
      .from("tabla_posicion")
      .select("*,promocion_participante(nombre_promocion)")
      .order("puntos", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getPartidoId = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("fixture_exafam")
      .select("*")
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};

export const insertedResult = async (result: FormResult) => {
  try {
    const { data, error } = await clientApi
      .from("resultado_fixture")
      .insert(result);
    if (error) throw error;
    return data;
  } catch (error) {}
};

export const getGoles = async () => {
  try {
    const { data, error } = await clientApi
      .from("promocionales")
      .select("*")
      .order("n_goles", { ascending: false })
      .gt("n_goles", 0);

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getSanciones = async () => {
  try {
    const { data, error } = await clientApi
      .from("lista_jugador_sancionado")
      .select("*,promocion_participante(nombre_promocion,grupo_id)")
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const tipoSanciones = async () => {
  try {
    const { data, error } = await clientApi
      .from("tipo_sancion")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const voley = async () => {
  try {
    const { data, error } = await clientApi
      .from("Voley_posicion")
      .select("*,promocion_participante(nombre_promocion)");
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getPromocionales = async () => {
  try {
    const { data, error } = await clientApi
      .from("promocionales")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getByIdPromocionales = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("promocionales")
      .select("*")
      .eq("id_promocion_participante", id);
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const insertedJugadorSancionado = async (
  jugadorSancionado: ListaSancion,
) => {
  try {
    if (jugadorSancionado.tipo_sancion == 0) {
      console.log(jugadorSancionado);
      const { error, data } = await clientApi
        .from("lista_jugador_sancionado")
        .insert({
          ...jugadorSancionado,
          tipo_sancion: null,
        });
      console.log(data, error);
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await clientApi
        .from("lista_jugador_sancionado")
        .insert(jugadorSancionado);

      console.log(data, error);

      if (error) throw error;
      return data;
    }
  } catch (error) {}
};

export const jugadorSancionadoById = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("lista_jugador_sancionado")
      .select("*")
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};
export const updateJugadorSancionado = async (
  jugadorSancionado: ListaSancion,
) => {
  try {
    if (jugadorSancionado.tipo_sancion === 0) {
      if (jugadorSancionado.id !== undefined) {
        await clientApi
          .from("lista_jugador_sancionado")
          .update({
            ...jugadorSancionado,
            tipo_sancion: null,
          })
          .eq("id", jugadorSancionado.id);
      } else {
        throw new Error("jugadorSancionado.id is undefined");
      }
    } else {
      if (jugadorSancionado.id !== undefined) {
        const { data, error } = await clientApi
          .from("lista_jugador_sancionado")
          .update(jugadorSancionado)
          .eq("id", jugadorSancionado.id);

        console.log(data, error?.message);
        if (error) throw error;
        return data;
      } else {
        throw new Error("jugadorSancionado.id is undefined");
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const promocionesParticipantesByGrupoId = async (
  id: number,
  tipoId: number,
) => {
  try {
    const { data, error } = await clientApi
      .from("promocion_participante")
      .select("*")
      .eq("grupo_id", id)
      .eq("tipo_id", tipoId);
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const obtenerPromocionWithParticipantes = async () => {
  try {
    const { data, error } = await clientApi
      .from("promocionales")
      .select("*, promocion_participante(nombre_promocion,grupo_id)")
      .order("n_goles", { ascending: false })
      .gt("n_goles", 0);
    if (error) throw new Error(error.message);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const updatingTablaPosicionFutbol = async (
  promocionPosicion: TablaPosicion,
) => {
  try {
    if (promocionPosicion.id === undefined) {
      throw new Error("promocionPosicion.id is undefined");
    }
    const { data, error } = await clientApi
      .from("tabla_posicion")
      .upsert(promocionPosicion)
      .eq("id", promocionPosicion.id);
    if (error) throw error;

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const promocionesPosicionPorGrupo = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("tabla_posicion")
      .select("*, promocion_participante(nombre_promocion)")
      .order("puntos", { ascending: false })
      .eq("grupo_id", id);
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const promocionTablaPosicionById = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("tabla_posicion")
      .select("*, promocion_participante(nombre_promocion)")
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};
export const promocionById = async (id: number) => {
  try {
    const { data, error } = await clientApi
      .from("promocionales")
      .select("*, promocion_participante(nombre_promocion)")
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};
export const updatePromocional = async (promocion: Promocional) => {
  try {
    const { data, error } = await clientApi
      .from("promocionales")
      .upsert(promocion)
      .eq("id", promocion.id!);
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const disableFixture = async (fixture: Fixture) => {
  try {
    const { data, error } = await clientApi
      .from("fixture_exafam")
      .upsert({
        ...fixture,
        fecha_partido: fixture.fecha_partido.toISOString(),
      })

      .eq("id", fixture.id!);

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};
