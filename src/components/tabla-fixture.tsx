import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import React, { useEffect } from "react";
import { fixtureStore } from "../store/fixture.store";
import { Fixture } from "../types/fixture.api.type";

const TablaFixture: React.FC = () => {
  const partidos = fixtureStore((state) => state.fixture);
  const obtenerPartido = fixtureStore((state) => state.partidosPorFecha);

  useEffect(() => {
    obtenerPartido();
  }, []);

  // Función para agrupar los partidos por grupo_id
  const groupBy = (array: any[] | null, key: string) => {
    if (!array) {
      return {};
    }

    return array.reduce((result, currentValue) => {
      const groupKey = currentValue[key];
      (result[groupKey] = result[groupKey] || []).push(currentValue);
      return result;
    }, {} as { [key: string]: any[] });
  };

  const obtenerProximosPartidos = (grupoPartidos: Fixture[]) => {
    return grupoPartidos
      .filter((partido) => new Date(partido.fecha_partido) > new Date())
      .sort(
        (a, b) =>
          new Date(a.fecha_partido).getTime() -
          new Date(b.fecha_partido).getTime()
      )
      .slice(0, 3);
  };

  const partidosAgrupados = groupBy(partidos, "grupo_id");
  const formatDate = (date: Date | string | null) => {
    if (!date) {
      return "";
    }

    try {
      const parsedDate = typeof date === "string" ? parseISO(date) : date;
      return format(parsedDate, "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Error parsing or formatting date:", error);
      return "";
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        {Object.keys(partidosAgrupados).map((grupoId) => (
          <Grid item xs={6} key={grupoId}>
            <Typography variant="h6" mb={2}>{`Grupo ${grupoId}`}</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Promoción</TableCell>
                    <TableCell>VS</TableCell>
                    <TableCell>Promoción</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Campo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {obtenerProximosPartidos(partidosAgrupados[grupoId]).map(
                    (partido: Fixture) => (
                      <TableRow key={partido.id}>
                        <TableCell>{partido.promocion}</TableCell>
                        <TableCell>VS</TableCell>
                        <TableCell>{partido.vs_promocion}</TableCell>
                        <TableCell>
                          {formatDate(partido.fecha_partido)}
                        </TableCell>
                        <TableCell>{partido.campo_id}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TablaFixture;
