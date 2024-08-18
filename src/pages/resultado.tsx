import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ResultStore } from "../store/result.store";
import type { Resultado } from "../types/fixture.api.type";

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
  }, []);
  useEffect(() => {
    // Filtrar los resultados donde exafam_fixture.por_jugar sea true
    const filteredResults = results.filter(
      (result) => result.fixture_exafam.por_jugar
    );
  
    // Ordenar los resultados por la fecha jugada
    const sortedResults = filteredResults
      .slice()
      .sort(
        (a, b) =>
          b.fixture_exafam.n_fecha_jugada - a.fixture_exafam.n_fecha_jugada
      );
  
    // Agrupar los resultados
    const grouped = sortedResults.reduce(
      (acc: { [key: string]: Resultado[] }, result) => {
        const { fixture_exafam } = result;
        const key = `${fixture_exafam.n_fecha_jugada}_${fixture_exafam.deporte_id}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(result);
        return acc;
      },
      {}
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
    "#317f43",
    "#495e76",
    "#FF1493",
    "#FFA500",
    "#746e5d",
    "#D400FF",
    "#FF0000",
    "#082032",
    "#FF6347",
    "1A1A40",
    "#1E5128",
    "#04293A",
  ];

  const paginatedResults = Object.entries(groupedResults).slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="">
      <div className="flex justify-center my-10">
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowCircleLeftOutlinedIcon color="secondary" fontSize="large" />
          Fecha siguiente
        </Button>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={paginatedResults.length < PAGE_SIZE}
        >
          Fecha anterior
          <ArrowCircleRightOutlinedIcon color="success" fontSize="large" />
        </Button>
      </div>
      {paginatedResults.map(([groupKey, groupResults], index) => (
        <div key={groupKey}>
          <Typography variant="h4">
            Resultados de la fecha{" "}
            {groupResults[0]?.fixture_exafam.n_fecha_jugada} -{" "}
            {getSportName(groupResults[0]?.fixture_exafam.deporte_id)}
          </Typography>
          <TableContainer component={Paper} key={groupKey}>
            <Table size="small" sx={{ bgcolor: colors[index % colors.length] }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Promoción</TableCell>
                  <TableCell align="center">VS</TableCell>
                  <TableCell align="center">Promoción</TableCell>
                  <TableCell align="center">Resultado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell align="center">
                      {result.fixture_exafam.promocion}
                    </TableCell>
                    <TableCell align="center">VS</TableCell>
                    <TableCell align="center">
                      {result.fixture_exafam.vs_promocion}
                    </TableCell>
                    <TableCell align="center">{result.resultado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
  );
}

export default ResultPage;
