import {
  Box,
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
import { useSancionGolStore } from "../store/sancion-gol.store";

function TablaSancion() {
  const sancion = useSancionGolStore((state) => state.sancion);
  const getSanciones = useSancionGolStore((state) => state.getSancion);
  const tipo = useSancionGolStore((state) => state.tipoSancion);
  const getTipoSancion = useSancionGolStore((state) => state.getTipoSancion);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number>(1);

  const redCardStyle = "bg-red-500 text-white px-2 py-1";
  const yellowCardStyle = "bg-yellow-500 text-black px-2 py-1";

  useEffect(() => {
    getSanciones();
    getTipoSancion();
  }, []);

  const handleGrupoChange = (grupoId: number) => {
    setGrupoSeleccionado(grupoId);
  };

  const sancionesFiltradas = sancion.filter(
    (sancion) => sancion.promocion_participante?.grupo_id === grupoSeleccionado
  );

  return (
    <>
      <Typography variant="h4" margin={4} align="center">
        Tabla de Sanciones
      </Typography>

      <Box display="flex" justifyContent="center" sx={{display: 'flex', justifyContent: 'center', marginBottom: 2,flexWrap:"wrap"}}>
        {[...Array(8)].map((_, index) => (
          <Button
            key={index}
            variant={grupoSeleccionado === index + 1 ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleGrupoChange(index + 1)}
            sx={{ margin: 0.5 }}
          >
            Grupo {index + 1}
          </Button>
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "black" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">tarjeta</TableCell>
              <TableCell align="center">Jugador</TableCell>
              <TableCell align="center">Promoción</TableCell>
              <TableCell align="center">Sanción</TableCell>
              <TableCell align="center">
                Cantidad de Tarjetas Amarillas
              </TableCell>
              <TableCell align="center">Cantidad de Tarjetas Rojas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sancionesFiltradas.map((sancion) => {
              const tipoId = tipo.find(
                (tipo) => sancion.tipo_sancion === tipo.id
              );
              return (
                <TableRow key={sancion.id}>
                  <TableCell className="flex" align="center">
                    {sancion.cant_tarjeta_roja > 0 && (
                      <div className={redCardStyle}>Tarjeta Roja</div>
                    )}
                    {sancion.cant_tarjeta_amarilla > 0 && (
                      <div className={yellowCardStyle}>Tarjeta Amarilla</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center" align="center">
                    {sancion.nombre_promocion}
                  </TableCell>
                  <TableCell align="center">
                    {sancion.promocion_participante?.nombre_promocion}
                  </TableCell>
                  <TableCell align="center">{tipoId?.nombre_tipo}</TableCell>
                  <TableCell align="center">
                    {sancion.cant_tarjeta_amarilla}
                  </TableCell>
                  <TableCell align="center">
                    {sancion.cant_tarjeta_roja}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TablaSancion;
