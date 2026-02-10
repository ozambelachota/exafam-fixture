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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ResultStore } from "../store/result.store";
import type { Resultado } from "../types/fixture.api.type";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 3; // Número de resultados por página

function ResultPage() {
  const results = ResultStore((state) => state.result);
  const getResults = ResultStore((state) => state.getResult);

  const [currentPage, setCurrentPage] = useState(1);
  const [groupedResults, setGroupedResults] = useState<{
    [key: string]: Resultado[];
  }>({});

  useEffect(() => {
    getResults();
  }, [getResults]);
  useEffect(() => {
    // Filtrar los resultados donde exafam_fixture.por_jugar sea true
    const filteredResults = results.filter(
      (result) => result.fixture_exafam?.por_jugar,
    );

    // Ordenar los resultados por la fecha jugada
    const sortedResults = filteredResults
      .slice()
      .sort(
        (a, b) =>
          (b.fixture_exafam?.n_fecha_jugada ?? 0) -
          (a.fixture_exafam?.n_fecha_jugada ?? 0),
      );

    // Agrupar los resultados
    const grouped = sortedResults.reduce(
      (acc: { [key: string]: Resultado[] }, result) => {
        const { fixture_exafam } = result;
        if (!fixture_exafam) return acc;
        const key = `${fixture_exafam.n_fecha_jugada}_${fixture_exafam.deporte_id}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(result);
        return acc;
      },
      {},
    );

    setGroupedResults(grouped);
  }, [results]);
  const getSportName = (deporteId: number): string => {
    switch (deporteId) {
      case 1:
        return "Fútbol";
      case 2:
        return "Vóley";
      case 3:
        return "Vóley Mixto";
      default:
        return "Desconocido";
    }
  };

  const colors = [
    "bg-[#317f43]/10 border-[#317f43]",
    "bg-[#495e76]/10 border-[#495e76]",
    "bg-[#FF1493]/10 border-[#FF1493]",
    "bg-[#FFA500]/10 border-[#FFA500]",
    "bg-[#746e5d]/10 border-[#746e5d]",
    "bg-[#D400FF]/10 border-[#D400FF]",
    "bg-[#FF0000]/10 border-[#FF0000]",
    "bg-[#082032]/10 border-[#082032]",
    "bg-[#FF6347]/10 border-[#FF6347]",
    "bg-[#1A1A40]/10 border-[#1A1A40]",
    "bg-[#1E5128]/10 border-[#1E5128]",
    "bg-[#04293A]/10 border-[#04293A]",
  ];

  const paginatedResults = Object.entries(groupedResults).slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-center gap-4 my-10">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Fecha siguiente
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={paginatedResults.length < PAGE_SIZE}
        >
          Fecha anterior
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {paginatedResults.map(([groupKey, groupResults], index) => (
        <Card
          key={groupKey}
          className={cn("border-l-4", colors[index % colors.length])}
        >
          <CardHeader>
            <CardTitle className="text-xl">
              Resultados de la fecha{" "}
              {groupResults[0]?.fixture_exafam?.n_fecha_jugada} -{" "}
              {getSportName(groupResults[0]?.fixture_exafam?.deporte_id ?? 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-[30%]">
                      Promoción
                    </TableHead>
                    <TableHead className="text-center w-[10%]">VS</TableHead>
                    <TableHead className="text-center w-[30%]">
                      Promoción
                    </TableHead>
                    <TableHead className="text-center w-[30%]">
                      Resultado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="text-center font-medium">
                        {result.fixture_exafam?.promocion}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        VS
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {result.fixture_exafam?.vs_promocion}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {result.resultado}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ResultPage;
