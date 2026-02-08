import { addDays, addMinutes } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { CampoStore } from "../store/campo.store";
import DeporteStore from "../store/deporte.store";
import { fixtureStore } from "../store/fixture.store";
import { GrupoStore } from "../store/grupoSotre.store";
import { Fixture } from "../types/fixture.api.type";

export const useFixturePage = () => {
  const grupos = GrupoStore((state) => state.grupos);
  const obtenerGrupo = GrupoStore((state) => state.obtenerGrupo);
  const fixture = fixtureStore((state) => state.fixture);
  const obtenerPromocionGrupo = fixtureStore(
    (state) => state.obtenerPromocionGrupo,
  );
  const deporteSelect = DeporteStore((state) => state.deporteSelect);

  const deportes = DeporteStore((state) => state.deportes);

  const selectDeporte = DeporteStore((state) => state.selectDeporte);

  const promocionesPorGrupos = fixtureStore(
    (state) => state.promocionesPorGrupos,
  );
  const setEmparejamiento = fixtureStore((state) => state.setEmparejamiento);
  const equipo1 = fixtureStore((state) => state.equipo1);
  const equipo2 = fixtureStore((state) => state.equipo2);
  const emparejamiento = fixtureStore((state) => state.emparejamiento);
  const setEquipo1 = fixtureStore((state) => state.setEquipo1);
  const setEquipo2 = fixtureStore((state) => state.setEquipo2);

  const [numeroFechaJugados, setNumeroFechaJugados] = useState(0);

  const selectGrupo = GrupoStore((state) => state.selectGrupo);
  const selectedGrupo = GrupoStore((state) => state.selectedGrupo);
  const setVsPromocion = fixtureStore((state) => state.setVsPromcion);
  const vsPromocion = fixtureStore((state) => state.vsPromocion);
  let matches: Fixture[] = [];

  const addPartido = fixtureStore((state) => state.guardarPartido);
  const campos = CampoStore((state) => state.campos);
  const selectCampo = CampoStore((state) => state.selectCampo);
  const campoSelect = CampoStore((state) => state.campoSelect);

  const fecha = fixtureStore((state) => state.fecha);
  const setFecha = fixtureStore((state) => state.setFecha);

  async function cargarDatos() {
    await obtenerGrupo();
    if (selectGrupo <= 0) return;
    else await obtenerPromocionGrupo(selectGrupo);
  }
  useEffect(() => {
    cargarDatos();
    return () => {};
  }, [
    vsPromocion,
    selectGrupo,
    numeroFechaJugados,
    deporteSelect,
    campoSelect,
    emparejamiento,
  ]);
  const handleChangeEmparejamiento = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setEmparejamiento(event.target.value as "automatico" | "manual");
  };

  const handleChangeEquipo1 = (event: ChangeEvent<HTMLSelectElement>) => {
    setEquipo1(event.target.value);
  };

  const handleChangeEquipo2 = (event: ChangeEvent<HTMLSelectElement>) => {
    setEquipo2(event.target.value);
  };
  function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const handleGeneratePartido = () => {
    const partidosGenerados = new Set(); // Conjunto para rastrear partidos generados
    if (
      campoSelect < 0 ||
      deporteSelect <= 0 ||
      selectGrupo <= 0 ||
      numeroFechaJugados <= 0
    ) {
      toast.error(
        "Por favor selecciona un campo, deporte, grupo y número de fecha válido.",
      );
      return;
    }

    if (emparejamiento === "automatico") {
      const promocionesAleatorias = [...promocionesFiltradas];
      const totalPromociones = promocionesAleatorias.length;

      if (totalPromociones < 6) {
        toast.error(
          "Se requieren al menos 6 equipos para generar partidos automáticamente.",
        );
        return;
      }

      // Obtener una copia aleatoria de los equipos disponibles
      const equiposAleatorios = promocionesAleatorias.map(
        (promocion) => promocion.nombre_promocion,
      );
      shuffleArray(equiposAleatorios); // Mezclar aleatoriamente los equipos

      const numEquipos = equiposAleatorios.length;
      const partidosPorRonda: [string, string][][] = [];
      const numRondas = numEquipos - 1;

      // Generación de las 5 fechas de ida
      for (let ronda = 0; ronda < numRondas; ronda++) {
        const partidosRondaActual: [string, string][] = [];
        for (let i = 0; i < numEquipos / 2; i++) {
          const equipoLocal = equiposAleatorios[i];
          const equipoVisitante = equiposAleatorios[numEquipos - 1 - i];
          partidosRondaActual.push([equipoLocal, equipoVisitante]);
        }
        partidosPorRonda.push(partidosRondaActual);

        // Rotar los equipos para la próxima ronda
        equiposAleatorios.splice(1, 0, equiposAleatorios.pop()!);
      }

      matches = [];

      let fechaInicio = new Date(fecha);
      for (let ronda = 0; ronda < partidosPorRonda.length; ronda++) {
        const partidosRonda = partidosPorRonda[ronda];
        let horaPartido = fechaInicio;

        for (let i = 0; i < partidosRonda.length; i++) {
          const [equipoLocal, equipoVisitante] = partidosRonda[i];

          matches.push({
            promocion: equipoLocal,
            vs_promocion: equipoVisitante,
            fecha_partido: horaPartido,
            grupo_id: selectGrupo,
            campo_id: campoSelect,
            deporte_id: deporteSelect,
            n_fecha_jugada: ronda + 1,
            por_jugar: true,
          });

          horaPartido = addMinutes(horaPartido, 30);
        }

        // Añadir una semana (7 días) para la próxima ronda
        fechaInicio = addDays(fechaInicio, 7);
      }

      // Generación de las 5 fechas de vuelta (invirtiendo local y visitante)
      for (let ronda = 0; ronda < partidosPorRonda.length; ronda++) {
        const partidosRonda = partidosPorRonda[ronda];
        let horaPartido = fechaInicio;

        for (let i = 0; i < partidosRonda.length; i++) {
          const [equipoLocal, equipoVisitante] = partidosRonda[i];

          matches.push({
            promocion: equipoVisitante, // Invertir local y visitante
            vs_promocion: equipoLocal,
            fecha_partido: horaPartido,
            grupo_id: selectGrupo,
            campo_id: campoSelect,
            deporte_id: deporteSelect,
            n_fecha_jugada: ronda + numRondas + 1,
            por_jugar: true,
          });

          horaPartido = addMinutes(horaPartido, 30);
        }

        // Añadir una semana (7 días) para la próxima ronda
        fechaInicio = addDays(fechaInicio, 7);
      }
    } else if (emparejamiento === "manual") {
      if (!equipo1 || !equipo2) {
        toast.error(
          "Por favor selecciona ambos equipos para generar un partido manualmente.",
        );
        return;
      }

      if (equipo1 === equipo2) {
        toast.error("Los equipos no pueden ser iguales.");
        return;
      }

      const partidoId = `${equipo1}-${equipo2}`;

      if (
        partidosGenerados.has(partidoId) ||
        partidosGenerados.has(`${equipo2}-${equipo1}`)
      ) {
        // Si el partido ya ha sido generado (en cualquiera de los dos sentidos), mostrar un error
        toast.error("Este partido ya ha sido generado.");
        return;
      }

      matches.push({
        promocion: equipo1,
        vs_promocion: equipo2,
        campo_id: campoSelect,
        grupo_id: selectGrupo,
        n_fecha_jugada: numeroFechaJugados,
        deporte_id: deporteSelect,
        fecha_partido: new Date(fecha),
        por_jugar: true,
      });

      toast.success("Partido generado manualmente con éxito");
    }

    setVsPromocion(matches);
  };

  const promocionesFiltradas = promocionesPorGrupos.filter(
    (promocion) => promocion.tipo_id === deporteSelect,
  );
  const handleEdit = (
    index: number,
    equipo1: string,
    equipo2: string,
    fecha: Date,
    campo: number,
  ) => {
    const updatedMatches = [...vsPromocion];
    updatedMatches[index].promocion = equipo1;
    updatedMatches[index].vs_promocion = equipo2;
    updatedMatches[index].fecha_partido = fecha;
    updatedMatches[index].campo_id = campo;

    if (equipo1 === equipo2) {
      toast.error("Los equipos no pueden ser iguales");
      return;
    } else {
      setVsPromocion(updatedMatches);
      toast.success("Partido editado con éxito");
    }
  };
  const handleChangeSelectGrupo = (event: any) => {
    selectedGrupo(event.target.value as number);
  };
  const handleChangeSelectCampo = (event: any) => {
    selectCampo(event.target.value as number);
  };
  const handleSavePartido = async () => {
    try {
      if (numeroFechaJugados <= 0) {
        toast.error("Se requiere al menos una fecha jugada");
        return;
      } else if (selectGrupo <= 0) {
        toast.error("Se requiere un grupo");
        return;
      } else if (campoSelect <= 0) {
        toast.error("Se requiere un campo");
        return;
      } else if (deporteSelect <= 0) {
        toast.error("Debe seleccionar un deporte");
        return;
      } else {
        await addPartido(vsPromocion);
        setVsPromocion([]);
        toast.success("Partidos guardados");
      }
    } catch (error) {
      console.error("Error al guardar partidos:", error);
      toast.error(
        "Error al guardar partidos. Consulta la consola para más detalles.",
      );
    }
  };

  return {
    emparejamiento,
    deporteSelect,
    deportes,
    numeroFechaJugados,
    selectGrupo,
    campoSelect,
    fecha,
    setFecha,
    vsPromocion,
    grupos,
    campos,
    handleChangeEmparejamiento,
    selectDeporte,
    handleChangeSelectGrupo,
    handleChangeSelectCampo,
    setNumeroFechaJugados,
    handleGeneratePartido,
    handleEdit,
    handleSavePartido,
    handleChangeEquipo1,
    handleChangeEquipo2,
    fixture,
    equipo1,
    equipo2,
    setEquipo1,
    setEquipo2,
    promocionesPorGrupos,
    promocionesFiltradas,
  };
};
