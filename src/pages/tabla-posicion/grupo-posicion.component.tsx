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
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PosicionStore } from "../../store/PosicionStore";
import { Pencil } from "lucide-react";

function GrupoPosicionComponents() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getPosicionGrupo = PosicionStore((state) => state.getPosicionGrupo);
  const promocionPosicion = PosicionStore((state) => state.tablaPosicionGrupo);

  useEffect(() => {
    getPosicionGrupo(Number(id));
  }, [id, getPosicionGrupo]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Tabla de posiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Promocion</TableHead>
                  <TableHead className="text-center">Puntos</TableHead>
                  <TableHead className="text-center">Goles a favor</TableHead>
                  <TableHead className="text-center">Goles en contra</TableHead>
                  <TableHead className="text-center">
                    Diferencia de goles
                  </TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promocionPosicion.map((promocion) => {
                  return (
                    <TableRow key={promocion.id}>
                      <TableCell className="text-center font-medium">
                        {promocion.promocion_participante.nombre_promocion}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {promocion.puntos}
                      </TableCell>
                      <TableCell className="text-center">
                        {promocion.goles_f}
                      </TableCell>
                      <TableCell className="text-center">
                        {promocion.goles_e}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">
                        {promocion.diferencia_goles}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700 hover:bg-green-100"
                          onClick={() => {
                            navigate(
                              `/admin/posicion/edit/grupo/${promocion.id}`,
                            );
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">EDITAR</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GrupoPosicionComponents;
