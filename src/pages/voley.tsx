import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";
import TablaPosicionVoley from "../components/tabla-posicion-voley.component";
import { getPartidosVoley } from "../services/api.service";
import { fixtureStore } from "../store/fixture.store";
import { Fixture } from "../types/fixture.api.type";
import { Loader2 } from "lucide-react";

function VoleyPage() {
  const fixtures = fixtureStore((state) => state.fixtureVoley);
  const setFixtures = fixtureStore((state) => state.setFixturesVoley);
  const { isLoading, isError, data } = useQuery({
    queryKey: ["partidosVoley"],
    queryFn: getPartidosVoley,
  });

  useEffect(() => {
    if (data) {
      const fixedData: Fixture[] = data.map((item) => ({
        ...item,
        promocion: item.promocion || "",
        vs_promocion: item.vs_promocion || "",
        campo_id: item.campo_id || 0,
        deporte_id: item.deporte_id || 0,
        n_fecha_jugada: item.n_fecha_jugada || 0,
        por_jugar: item.por_jugar || false,
        fecha_partido: item.fecha_partido
          ? new Date(item.fecha_partido)
          : new Date(),
      }));
      setFixtures(fixedData);
    }
  }, [data, setFixtures]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-32 w-32 animate-spin text-green-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-2xl font-bold text-center mt-10">
        Error al obtener partidos
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h4 className="text-3xl text-purple-600 m-16">
          No hay partidos disponibles
        </h4>
      </div>
    );
  }

  // Function to group matches by group_id
  const groupBy = (array: Fixture[], key: string) => {
    return array.reduce(
      (result, currentValue) => {
        const groupKey = currentValue[key as keyof Fixture] as string;
        (result[groupKey] = result[groupKey] || []).push(currentValue);
        return result;
      },
      {} as { [key: string]: Fixture[] },
    );
  };

  // Function to get upcoming matches
  const obtenerProximosPartidos = (grupoPartidos: Fixture[]) => {
    const fechaActual = new Date();
    return grupoPartidos
      .filter((partido) => partido.por_jugar)
      .sort(
        (a, b) =>
          new Date(a.fecha_partido).getTime() -
          new Date(b.fecha_partido).getTime(),
      )
      .map((partido) => {
        const fechaPartido = new Date(partido.fecha_partido);
        const tiempoRestante = fechaPartido.getTime() - fechaActual.getTime();
        return { ...partido, tiempoRestante };
      });
  };

  const partidosAgrupados = groupBy(fixtures, "deporte_id");

  // Function to format date
  const formatDate = (date: Date | string | null) => {
    if (!date) {
      return "";
    }
    try {
      const parsedDate = typeof date === "string" ? parseISO(date) : date;
      return format(parsedDate, "dd/MM HH:mm");
    } catch (error) {
      console.error("Error parsing or formatting date:", error);
      return "";
    }
  };

  return (
    <div className="w-full h-full p-4 space-y-8">
      <h4 className="text-3xl font-bold text-center mb-6">
        Voley y Voley Mixto
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full">
        {fixtures && fixtures.length > 0 ? (
          Object.keys(partidosAgrupados).map((grupoId) => (
            <div key={grupoId} className="flex flex-col">
              <h6 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
                {grupoId === "2" ? "Voley" : "Voley Mixto"}
              </h6>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-black hover:bg-black/90">
                      <TableHead className="text-white">Promoción</TableHead>
                      <TableHead className="text-white">VS</TableHead>
                      <TableHead className="text-white">Promoción</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-white">Campo</TableHead>
                      <TableHead className="text-white">Deporte</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {obtenerProximosPartidos(partidosAgrupados[grupoId]).map(
                      (partido) => {
                        let rowClass = "";
                        if (partido.tiempoRestante <= 0) {
                          rowClass = "bg-red-500/30 hover:bg-red-500/40";
                        } else if (partido.tiempoRestante < 10 * 60 * 1000) {
                          rowClass = "bg-green-500/30 hover:bg-green-500/40";
                        } else if (
                          new Date().getTime() >
                          new Date(partido.fecha_partido).getTime()
                        ) {
                          rowClass = "bg-red-500/30 hover:bg-red-500/40";
                        } else if (partido.deporte_id === 2) {
                          rowClass = "bg-blue-200/50 hover:bg-blue-200/60";
                        } else if (partido.deporte_id === 3) {
                          rowClass = "bg-blue-600/50 hover:bg-blue-600/60";
                        }

                        return (
                          <TableRow key={partido.id} className={rowClass}>
                            <TableCell className="p-2">
                              {partido.promocion}
                            </TableCell>
                            <TableCell className="p-2">VS</TableCell>
                            <TableCell className="p-2">
                              {partido.vs_promocion}
                            </TableCell>
                            <TableCell className="p-2">
                              {formatDate(partido.fecha_partido)}
                            </TableCell>
                            <TableCell className="p-2">
                              {partido.campo_id}
                            </TableCell>
                            <TableCell className="p-2">
                              {partido.deporte_id === 2
                                ? "Voley"
                                : "Voley Mixto"}
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 flex justify-center items-center h-64 w-full">
            <h4 className="text-3xl text-purple-600 m-16">
              No hay partidos programados
            </h4>
          </div>
        )}
      </div>
      <TablaPosicionVoley />
    </div>
  );
}

export default VoleyPage;
