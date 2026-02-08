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
import { PromocionStore } from "../store/promocionales.store";

function NominaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const promocionales = PromocionStore((state) => state.promocionales);
  const getPromocionalesId = PromocionStore(
    (state) => state.getPromocionalesId,
  );

  useEffect(() => {
    getPromocionalesId(Number(id));
  }, [id]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Nómina de jugadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Jugador</TableHead>
                  <TableHead className="text-center">N° de goles</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promocionales.map((promocion) => (
                  <TableRow key={promocion.id}>
                    <TableCell className="text-center font-medium">
                      {promocion.nombre_promocional}
                    </TableCell>
                    <TableCell className="text-center">
                      {promocion.n_goles}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="secondary"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          navigate(`/admin/nomina/edit/${promocion.id}`);
                        }}
                      >
                        Editar jugador
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NominaPage;
