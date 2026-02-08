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
import { useEffect, useState } from "react";
import { useSancionGolStore } from "../store/sancion-gol.store";

function TablaSancion() {
  const sancion = useSancionGolStore((state) => state.sancion);
  const getSanciones = useSancionGolStore((state) => state.getSancion);
  const tipo = useSancionGolStore((state) => state.tipoSancion);
  const getTipoSancion = useSancionGolStore((state) => state.getTipoSancion);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number>(1);

  const redCardStyle =
    "bg-red-500 text-white px-2 py-1 rounded text-xs font-bold";
  const yellowCardStyle =
    "bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold";

  useEffect(() => {
    getSanciones();
    getTipoSancion();
  }, [getSanciones, getTipoSancion]);

  const handleGrupoChange = (grupoId: number) => {
    setGrupoSeleccionado(grupoId);
  };

  const sancionesFiltradas = sancion.filter(
    (sancion) => sancion.promocion_participante?.grupo_id === grupoSeleccionado,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Tabla de Sanciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {[...Array(8)].map((_, index) => (
            <Button
              key={index}
              variant={grupoSeleccionado === index + 1 ? "default" : "outline"}
              onClick={() => handleGrupoChange(index + 1)}
              className="min-w-[80px]"
            >
              Grupo {index + 1}
            </Button>
          ))}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Tarjeta</TableHead>
                <TableHead className="text-center">Jugador</TableHead>
                <TableHead className="text-center">Promoción</TableHead>
                <TableHead className="text-center">Sanción</TableHead>
                <TableHead className="text-center">Amarillas</TableHead>
                <TableHead className="text-center">Rojas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sancionesFiltradas.map((sancion) => {
                const tipoId = tipo.find(
                  (tipo) => sancion.tipo_sancion === tipo.id,
                );
                return (
                  <TableRow key={sancion.id}>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {sancion.cant_tarjeta_roja > 0 && (
                          <span className={redCardStyle}>Roja</span>
                        )}
                        {sancion.cant_tarjeta_amarilla > 0 && (
                          <span className={yellowCardStyle}>Amarilla</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {sancion.nombre_promocion}
                    </TableCell>
                    <TableCell className="text-center">
                      {sancion.promocion_participante?.nombre_promocion}
                    </TableCell>
                    <TableCell className="text-center">
                      {tipoId?.nombre_tipo}
                    </TableCell>
                    <TableCell className="text-center font-bold text-yellow-600">
                      {sancion.cant_tarjeta_amarilla}
                    </TableCell>
                    <TableCell className="text-center font-bold text-red-600">
                      {sancion.cant_tarjeta_roja}
                    </TableCell>
                  </TableRow>
                );
              })}
              {sancionesFiltradas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No hay sanciones para este grupo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default TablaSancion;
