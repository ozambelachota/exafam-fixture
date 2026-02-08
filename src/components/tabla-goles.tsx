import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useSancionGolStore } from "../store/sancion-gol.store";
import { PromocionalWithParticipante } from "../types/fixture.api.type";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TableGolesDocument } from "./pdf/TableGolesDocument";

const colorPalette = [
  "bg-[#317f43]",
  "bg-[#495e76]",
  "bg-[#FF1493]",
  "bg-[#FFA500]",
  "bg-[#746e5d]",
  "bg-[#D400FF]",
  "bg-[#FF0000]",
];

const colorPaletteHex = [
  "#317f43",
  "#495e76",
  "#FF1493",
  "#FFA500",
  "#746e5d",
  "#D400FF",
  "#FF0000",
];

function TablaGolesComponent() {
  const getPromocionWithParticipante = useSancionGolStore(
    (state) => state.getPromocionWithParticipante,
  );

  const promocionWithParticipante = useSancionGolStore(
    (state) => state.promocionWithParticipante,
  );

  const [currentGroup, setCurrentGroup] = useState<number>(() => {
    const storedGroup = localStorage.getItem("currentGroupGoles");
    return storedGroup ? Number(storedGroup) : 1;
  });

  useEffect(() => {
    getPromocionWithParticipante();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentGroupGoles", currentGroup.toString());
  }, [currentGroup]);

  const groupByPromocion = (array: PromocionalWithParticipante[]) => {
    if (!array) {
      return {};
    }

    return array.reduce(
      (result, currentValue) => {
        const groupKey =
          currentValue.promocion_participante.grupo_id.toString(); // Convertir a cadena para usar como clave
        (result[groupKey] = result[groupKey] || []).push(currentValue);
        return result;
      },
      {} as { [key: string]: PromocionalWithParticipante[] },
    );
  };

  const groupedData = groupByPromocion(promocionWithParticipante);

  const handleGroupChange = (group: number) => {
    setCurrentGroup(group);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center flex-wrap my-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((group) => (
          <Button
            key={group}
            variant={currentGroup === group ? "default" : "outline"}
            onClick={() => handleGroupChange(group)}
          >
            Grupo {group}
          </Button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
          <PDFDownloadLink
            document={
              <TableGolesDocument
                groupId={currentGroup}
                data={groupedData[currentGroup] || []}
              />
            }
            fileName={`Grupo_${currentGroup}_Goles.pdf`}
          >
            {({ loading }: { loading: boolean }) => (
              <span className="flex items-center">
                <Download className="mr-2 h-4 w-4" />{" "}
                {loading ? "Generando PDF..." : "Descargar PDF"}
              </span>
            )}
          </PDFDownloadLink>
        </Button>
      </div>
      <div className="w-full h-full">
        {Object.entries(groupedData)
          .filter(([grupoId]) => Number(grupoId) === currentGroup)
          .map(([grupoId, data]) => (
            <div key={`group-${grupoId}`} className="mb-8">
              <h4
                className="text-center text-2xl font-bold my-5"
                style={{
                  color: colorPaletteHex[Number(grupoId) - 1],
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                Grupo {grupoId}
              </h4>
              <div
                className={`rounded-md border p-1 ${
                  colorPalette[Number(grupoId) - 1] || "bg-background"
                } bg-opacity-20`}
              >
                <div className="bg-background rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre Promocional</TableHead>
                        <TableHead>Número de Goles</TableHead>
                        <TableHead>Nombre de Promoción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item) => (
                        <TableRow
                          key={`${grupoId}-${item.id_promocion_participante}-${item.nombre_promocional}`}
                        >
                          <TableCell>{item.nombre_promocional}</TableCell>
                          <TableCell>{item.n_goles}</TableCell>
                          <TableCell>
                            {item.promocion_participante.nombre_promocion}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ))}
        {Object.keys(groupedData).length === 0 && (
          <div className="flex justify-center items-center h-screen w-full">
            <h4 className="text-2xl text-violet-600 m-16">
              No hay datos de tabla de posiciones disponibles
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default TablaGolesComponent;
