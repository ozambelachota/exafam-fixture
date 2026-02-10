import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPartidosFutbol } from "../services/api.service";
import { fixtureStore } from "../store/fixture.store";
import type { Tables } from "../types/database.types";

type FixtureDB = Tables<"fixture_exafam">;
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Helper for pure hex colors for dynamic styles
const hexColors = [
  "#4285f4",
  "#34a853",
  "#7E6363",
  "#ea4335",
  "#673ab7",
  "#e91e63",
  "#795548",
  "#f4b400",
];

const TablaFixture = () => {
  const fixtures = fixtureStore((state) => state.fixtureFutbol);
  const setFixtures = fixtureStore((state) => state.setFixturesFutbol);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["partidosFutbol"],
    queryFn: () => getPartidosFutbol(),
  });

  const [currentGroup, setCurrentGroup] = useState<number>(
    parseInt(localStorage.getItem("currentGroup") || "1", 10),
  );

  useEffect(() => {
    if (data) {
      setFixtures(data);
    }
  }, [data, setFixtures]);
  useEffect(() => {
    localStorage.setItem("currentGroup", currentGroup.toString());
  }, [currentGroup]);

  if (isError) {
    return (
      <div className="text-center text-red-500 text-xl font-bold mt-4">
        Error al obtener partidos
      </div>
    );
  }
  if (isLoading) {
    return <div className="text-center text-xl mt-4">Cargando partidos...</div>;
  }
  if (!data) {
    return (
      <div className="text-center text-xl mt-4">
        No hay partidos disponibles
      </div>
    );
  }

  const groupBy = (array: FixtureDB[] | null, key: string) => {
    if (!array) {
      return {};
    }

    return array.reduce(
      (result, currentValue) => {
        const groupKey = currentValue[key as keyof FixtureDB] as string;
        (result[groupKey] = result[groupKey] || []).push(currentValue);
        return result;
      },
      {} as { [key: string]: FixtureDB[] },
    );
  };

  const obtenerProximosPartidos = (grupoPartidos: FixtureDB[]) => {
    const fechaActual = new Date();
    return grupoPartidos
      .filter((partido) => partido.por_jugar === true)
      .sort(
        (a, b) =>
          new Date(a.fecha_partido).getTime() -
          new Date(b.fecha_partido).getTime(),
      )
      .map((partido) => {
        const fechaPartido = new Date(partido.fecha_partido);
        const tiempoRestante = fechaPartido.getTime() - fechaActual.getTime();

        return {
          ...partido,
          tiempoRestante,
        };
      });
  };

  const partidosAgrupados = groupBy(fixtures, "grupo_id");

  const handleGroupChange = (group: number) => {
    setCurrentGroup(group);
  };
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
    <div className="w-full h-full p-4 space-y-6">
      <h2 className="text-3xl font-bold text-center mt-2 text-primary">
        FUTBOL
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-4 text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Campo 1 : COLEGIO FAUSTINO MALDONADO
        </h3>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Campo 2 : PARQUE TUPAC
        </h3>
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((group) => (
          <Button
            key={group}
            variant={currentGroup === group ? "default" : "outline"}
            onClick={() => handleGroupChange(group)}
            size="sm"
            className={
              currentGroup === group ? "bg-primary text-primary-foreground" : ""
            }
          >
            Grupo {group}
          </Button>
        ))}
      </div>
      <div className="flex w-full h-full flex-col items-center">
        {fixtures && fixtures.length > 0 ? (
          Object.keys(partidosAgrupados)
            .filter((grupoId) => parseInt(grupoId, 10) === currentGroup)
            .map((grupoId) => {
              const groupIndex = (parseInt(grupoId) - 1) % hexColors.length;
              const primaryColor = hexColors[groupIndex];

              return (
                <Card
                  key={grupoId}
                  className="w-full max-w-4xl border-l-4 shadow-sm"
                  style={{ borderLeftColor: primaryColor }}
                >
                  <CardHeader>
                    <CardTitle
                      className="text-2xl md:text-3xl text-center"
                      style={{
                        color: primaryColor,
                        textShadow: `0px 0px 10px ${primaryColor}40`,
                      }}
                    >
                      Grupo {grupoId}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="rounded-md border overflow-x-auto"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <Table className="min-w-[650px]">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-gray-800">
                              Promoción
                            </TableHead>
                            <TableHead className="font-bold text-gray-800">
                              VS
                            </TableHead>
                            <TableHead className="font-bold text-gray-800">
                              Promoción
                            </TableHead>
                            <TableHead className="font-bold text-gray-800">
                              Fecha
                            </TableHead>
                            <TableHead className="text-center font-bold text-gray-800">
                              C
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {obtenerProximosPartidos(
                            partidosAgrupados[grupoId],
                          ).map((partido) => {
                            let rowBg = "bg-transparent";
                            if (partido.tiempoRestante <= 0) {
                              rowBg = "bg-red-500/30 hover:bg-red-500/40"; // Finished/Started
                            } else if (
                              partido.tiempoRestante <
                              10 * 60 * 1000
                            ) {
                              rowBg = "bg-green-500/30 hover:bg-green-500/40"; // Starting soon
                            } else if (
                              new Date().getTime() >
                              new Date(partido.fecha_partido).getTime()
                            ) {
                              rowBg = "bg-red-500/30 hover:bg-red-500/40"; // Past date
                            }

                            return (
                              <TableRow
                                key={partido.id}
                                className={cn("transition-colors", rowBg)}
                              >
                                <TableCell className="py-2 font-medium">
                                  {partido.promocion}
                                </TableCell>
                                <TableCell className="py-2">VS</TableCell>
                                <TableCell className="py-2 font-medium">
                                  {partido.vs_promocion}
                                </TableCell>
                                <TableCell className="py-2">
                                  {formatDate(partido.fecha_partido)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className="py-2 font-bold"
                                >
                                  {partido.campo_id}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              );
            })
        ) : (
          <div className="flex justify-center items-center h-[50vh] w-full">
            <h4 className="text-2xl text-violet-500 font-semibold m-16">
              No hay partidos programados
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaFixture;
