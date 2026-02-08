import { useEffect } from "react";
import voleyStore from "../store/voley.store";
import { VoleyPosicion } from "../types/fixture.api.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const hexColors = ["#808080", "#478C9C"];

function TablaPosicionVoley() {
  const voleyPositions = voleyStore((state) => state.voley);
  const getVoleyPositions = voleyStore((state) => state.getVoley);

  useEffect(() => {
    getVoleyPositions();
  }, [getVoleyPositions]);

  const groupBy = (array: VoleyPosicion[] | null, key: string) => {
    if (!array) {
      return {};
    }

    const sortedArray = [...array].sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos; // Ordenar por puntos de mayor a menor
      } else {
        return b.partidos_g - a.partidos_g; // Si los puntos son iguales, ordenar por diferencia de goles
      }
    });

    return sortedArray.reduce(
      (result, currentValue: VoleyPosicion) => {
        const groupKey = (currentValue as any)[key];
        // rome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        (result[groupKey] = result[groupKey] || []).push(currentValue);
        return result;
      },
      {} as { [key: string]: VoleyPosicion[] },
    );
  };

  const groupsTabla = groupBy(voleyPositions, "deporte_id"); // Group by deporte_id instead of grupo_id

  return (
    <div className="w-full mt-6 space-y-8 p-4">
      {Object.keys(groupsTabla).map((deporteId, index) => {
        const primaryColor = hexColors[index % hexColors.length];
        return (
          <Card key={deporteId} className="w-full border shadow-md">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
                Tabla de Posiciones -{" "}
                {deporteId == "2" ? "Voley Femenino" : "Voley Mixto"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table
                  className="min-w-full"
                  style={{
                    // Apply color as a border or accent if needed, otherwise rely on clean design
                    borderTop: `4px solid ${primaryColor}`,
                  }}
                >
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                        Equipo
                      </TableHead>
                      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                        Puntos
                      </TableHead>
                      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                        Partidos Ganados
                      </TableHead>
                      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                        Partidos Perdidos
                      </TableHead>
                      <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                        N° de partidos jugados
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupsTabla[deporteId].map((equipo) => (
                      <TableRow
                        key={equipo.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <TableCell className="text-center font-medium">
                          {equipo.promocion_participante?.nombre_promocion}
                        </TableCell>
                        <TableCell className="text-center font-bold text-lg">
                          <span className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                            {equipo.puntos}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {equipo.partidos_g}
                        </TableCell>
                        <TableCell className="text-center">
                          {equipo.partidos_p}
                        </TableCell>
                        <TableCell className="text-center text-blue-600 dark:text-blue-400 font-semibold">
                          {equipo.partidos_j}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {Object.keys(groupsTabla).length === 0 && (
        <div className="flex justify-center items-center h-[50vh] w-full">
          <h4 className="text-2xl text-violet-500 font-semibold m-16">
            No hay datos de tabla de posiciones disponibles
          </h4>
        </div>
      )}
    </div>
  );
}

export default TablaPosicionVoley;
