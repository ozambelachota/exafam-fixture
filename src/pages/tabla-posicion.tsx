import { useEffect, useState } from "react";
import { PosicionStore } from "../store/PosicionStore";
import { type TablaPosicion } from "../types/fixture.api.type";
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
import { Download } from "lucide-react";

// TODO: Implement PDF Download using @react-pdf/renderer
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import StandingsDocument from "../components/pdf/StandingsDocument";

const colorPalette = [
  "border-[#4285f4] to-[#4285f4]/10",
  "border-[#34a853] to-[#34a853]/10",
  "border-[#8900f2] to-[#8900f2]/10",
  "border-[#ea4335] to-[#ea4335]/10",
  "border-[#4361ee] to-[#4361ee]/10",
  "border-[#e91e63] to-[#e91e63]/10",
  "border-[#795548] to-[#795548]/10",
];

const hexColors = [
  "#4285f4",
  "#34a853",
  "#8900f2",
  "#ea4335",
  "#4361ee",
  "#e91e63",
  "#795548",
];

const TablaPosicionPage: React.FC = () => {
  const tablaPosicion = PosicionStore((state) => state.tablaPosicion);
  const uploadTablaPosicion = PosicionStore(
    (state) => state.uploadTablaPosicion,
  );

  const [currentGroup, setCurrentGroup] = useState<number>(
    parseInt(localStorage.getItem("currentGroupPosicion") || "1", 10),
  );

  useEffect(() => {
    uploadTablaPosicion();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentGroupPosicion", currentGroup.toString());
  }, [currentGroup]);

  const groupBy = (array: TablaPosicion[] | null, key: string) => {
    if (!array) {
      return {};
    }

    const sortedArray = [...array].sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos; // Ordenar por puntos de mayor a menor
      } else {
        return b.diferencia_goles - a.diferencia_goles; // Si los puntos son iguales, ordenar por diferencia de goles
      }
    });

    return sortedArray.reduce(
      (result, currentValue: TablaPosicion) => {
        const groupKey = (currentValue as any)[key];
        (result[groupKey] = result[groupKey] || []).push(currentValue);
        return result;
      },
      {} as { [key: string]: TablaPosicion[] },
    );
  };

  const groupsTabla = groupBy(tablaPosicion, "grupo_id");

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert(
      "La generación de PDF se está actualizando. Pronto estará disponible.",
    );
  };

  const handleGroupChange = (group: number) => {
    setCurrentGroup(group);
  };

  return (
    <div className="w-full h-full p-4 space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Descargar PDF
        </Button>
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
        {Object.keys(groupsTabla).map((grupoId, index) => {
          if (parseInt(grupoId) !== currentGroup) return null;

          const groupIndex = index % hexColors.length;
          const primaryColor = hexColors[groupIndex];

          return (
            <Card
              key={grupoId}
              className={cn(
                "w-full max-w-5xl border-l-4 shadow-md bg-gradient-to-r from-transparent",
                colorPalette[groupIndex],
              )}
              style={{ borderLeftColor: primaryColor }}
            >
              <CardHeader>
                <CardTitle
                  className="text-2xl font-bold text-center"
                  style={{ color: primaryColor }}
                >
                  Tabla de Posiciones - Grupo {grupoId}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto bg-background/50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead className="text-center font-bold">
                          PTS
                        </TableHead>
                        <TableHead className="text-center">PJ</TableHead>
                        <TableHead className="text-center">PG</TableHead>
                        <TableHead className="text-center">PE</TableHead>
                        <TableHead className="text-center">PP</TableHead>
                        <TableHead className="text-center">GF</TableHead>
                        <TableHead className="text-center">GC</TableHead>
                        <TableHead className="text-center">DG</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupsTabla[grupoId].map((equipo, idx) => (
                        <TableRow key={equipo.id}>
                          <TableCell className="font-medium">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {equipo.promocion_participante?.nombre_promocion}
                          </TableCell>
                          <TableCell className="text-center font-bold text-lg bg-primary/10 rounded">
                            {equipo.puntos}
                          </TableCell>
                          <TableCell className="text-center">
                            {equipo.pj}
                          </TableCell>
                          <TableCell className="text-center">
                            {equipo.pg}
                          </TableCell>
                          <TableCell className="text-center">
                            {equipo.pe}
                          </TableCell>
                          <TableCell className="text-center">
                            {equipo.pp}
                          </TableCell>
                          <TableCell className="text-center">
                            {equipo.goles_f}
                          </TableCell>
                          <TableCell className="text-center">
                            {equipo.goles_e}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {equipo.diferencia_goles}
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
    </div>
  );
};

export default TablaPosicionPage;
