import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormEditVoleyPosicion from "./components/form-edited.component";
import { useVoleyStore } from "./store/Voley.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

export const TablaVoleyPage = () => {
  const { deporte } = useParams();
  const { voleys, getVoley } = useVoleyStore();
  const { setVoley } = useVoleyStore();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getVoley(Number(deporte));
  }, [deporte, getVoley]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Tabla de posicion de{" "}
            {deporte == "2" ? "Voley Femenino" : "Voley Mixto"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Promocion</TableHead>
                  <TableHead className="text-center">Puntos</TableHead>
                  <TableHead className="text-center">
                    Partidos jugados
                  </TableHead>
                  <TableHead className="text-center">
                    Partidos ganados
                  </TableHead>
                  <TableHead className="text-center">
                    Partidos perdidos
                  </TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voleys.map((promocion) => {
                  return (
                    <TableRow key={promocion.id}>
                      <TableCell className="text-center font-medium">
                        {promocion.promocion_participante?.nombre_promocion}
                      </TableCell>
                      <TableCell className="text-center">
                        {promocion.puntos}
                      </TableCell>
                      <TableCell className="text-center">
                        {promocion.partidos_j}
                      </TableCell>
                      <TableCell className="text-center">
                        {promocion.partidos_g}
                      </TableCell>
                      <TableCell className="text-center">
                        {promocion.partidos_p}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setVoley(promocion);
                            setOpenModal(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
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

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          {/* The header is handled inside the form or we can add it here too, 
                but FormEditVoleyPosicion has its own title. 
                Shadcn Dialog usually recommends DialogHeader. 
                I will let FormEditVoleyPosicion handle the content but ideally we should structure it better.
                Since I refactored FormEditVoleyPosicion to have a title, I will treat it as the content.
            */}
          <FormEditVoleyPosicion onSuccess={() => setOpenModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
