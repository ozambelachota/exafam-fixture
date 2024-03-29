import { addMinutes } from "date-fns";
import { useEffect, useState } from "react";
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
    (state) => state.obtenerPromocionGrupo
  );
  const deporteSelect = DeporteStore((state) => state.deporteSelect);

  const deportes = DeporteStore((state) => state.deportes);

  const getDeportes = DeporteStore((state) => state.getDeporte);

  const selectDeporte = DeporteStore((state) => state.selectDeporte);

  const promocionesPorGrupos = fixtureStore(
    (state) => state.promocionesPorGrupos
  );
  const {
    setEmparejamiento,
    equipo1,
    equipo2,
    emparejamiento,
    setEquipo1,
    setEquipo2,
  } = fixtureStore();

  const [numeroFechaJugados, setNumeroFechaJugados] = useState(0);

  const selectGrupo = GrupoStore((state) => state.selectGrupo);
  const selectedGrupo = GrupoStore((state) => state.selectedGrupo);
  const setVsPromocion = fixtureStore((state) => state.setVsPromcion);
  const vsPromocion = fixtureStore((state) => state.vsPromocion);
  const matches: Fixture[] = [];

  const addPartido = fixtureStore((state) => state.guardarPartido);
  const campos = CampoStore((state) => state.campos);
  const obtenerCampos = CampoStore((state) => state.obtenrCampos);
  const selectCampo = CampoStore((state) => state.selectCampo);
  const campoSelect = CampoStore((state) => state.campoSelect);
  
  const fecha = fixtureStore((state) => state.fecha);
  const setFecha = fixtureStore((state) => state.setFecha);

  async function cargarDatos() {
    await obtenerGrupo();
    await obtenerCampos();
    await getDeportes();
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
  const handleChangeEmparejamiento = (event: any) => {
    setEmparejamiento(event.target.value);
  };

  const handleChangeEquipo1 = (event: any) => {
    setEquipo1(event.target.value);
  };

  const handleChangeEquipo2 = (event: any) => {
    setEquipo2(event.target.value);
  };
  const handleGeneratePartido = () => {
    const promocionesAleatorias = [...promocionesFiltradas];
    const totalPromociones = promocionesAleatorias.length;
    const usedIndices = new Set<number>();
    let horaActual = new Date(fecha);
    if (campoSelect < 0) {
      toast.error("Se requiere un campo");
      return;
    }
    if (deporteSelect <= 0) {
      toast.error("debe seleccionar un deporte");
      return;
    }
    if (selectGrupo <= 0) {
      toast.error("Se requiere un grupo");
      return;
    }
    if (numeroFechaJugados <= 0) {
      toast.error("Se requiere un numero de fecha");
      return;
    }

    if (emparejamiento === "automatico") {
      for (let i = 0; i < totalPromociones - (totalPromociones % 2); i += 2) {
        const index1 = getRandomIndex(totalPromociones, usedIndices);
        const equipo1 = promocionesAleatorias[index1].nombre_promocion;
        const horaSegundoPartido = addMinutes(horaActual, 30);

        const index2 = getRandomIndex(totalPromociones, usedIndices);
        const equipo2 = promocionesAleatorias[index2].nombre_promocion;

        matches.push({
          promocion: equipo1,
          vs_promocion: equipo2,
          fecha_partido: new Date(horaActual),
          grupo_id: selectGrupo,
          campo_id: campoSelect,
          deporte_id: deporteSelect,
          n_fecha_jugada: numeroFechaJugados,
          por_jugar: true,
        });

        horaActual = horaSegundoPartido;
      }

      // Genera un partido para el equipo impar con un bye
      if (totalPromociones % 2 !== 0) {
        const indexOdd = getRandomIndex(totalPromociones, usedIndices);
        const equipoOdd = promocionesAleatorias[indexOdd].nombre_promocion;

        matches.push({
          promocion: equipoOdd,
          vs_promocion: "descansa una fecha",
          fecha_partido: horaActual,
          grupo_id: selectGrupo,
          campo_id: campoSelect,
          deporte_id: deporteSelect,
          n_fecha_jugada: numeroFechaJugados,
          por_jugar: true,
        });
      }

      toast.success("Partidos generados con éxito");
    } else if (emparejamiento === "manual") {
      if (equipo1 === equipo2) {
        toast.error("Los equipos no pueden ser iguales");
        return;
      }
      if (equipo1 == "" || equipo2 == "") {
        toast.error("Los equipos no pueden ser vacíos");
        return;
      }

      matches.push({
        promocion: equipo1,
        vs_promocion: equipo2,
        campo_id: campoSelect,
        grupo_id: selectGrupo,
        n_fecha_jugada: numeroFechaJugados,
        deporte_id: deporteSelect,
        fecha_partido: horaActual,
        por_jugar: true,
      });

      toast.success("Partido generado con éxito");
    }

    setVsPromocion(matches);
  };

  const getRandomIndex = (max: number, usedIndices: Set<number>) => {
    let index;
    do {
      index = Math.floor(Math.random() * max);
    } while (usedIndices.has(index));

    usedIndices.add(index);
    return index;
  };

  const promocionesFiltradas = promocionesPorGrupos.filter(
    (promocion) => promocion.tipo_id === deporteSelect
  );
  const handleEdit = (index: number, equipo1: string, equipo2: string) => {
    const updatedMatches = [...vsPromocion];
    updatedMatches[index].promocion = equipo1;
    updatedMatches[index].vs_promocion = equipo2;

    if (equipo1 == equipo2) {
      toast.error("Los equipos no pueden ser iguales");
      return;
    } else if (
      updatedMatches[index].promocion == updatedMatches[index].vs_promocion
    ) {
      toast.error("No se puede editar el partido");
      return;
    } else {
      setVsPromocion(updatedMatches);
      toast.success("Partido editado con exito");
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
        setNumeroFechaJugados(0);
        setFecha(new Date());
        toast.success("Partidos guardados");
      }
    } catch (error) {
      console.error("Error al guardar partidos:", error);
      toast.error(
        "Error al guardar partidos. Consulta la consola para más detalles."
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
