import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { CampoStore } from "../store/campo.store";
import {
  Fixture,
  PromocionParticipanteRow,
} from "../types/fixture.api.type";
import { format } from "date-fns";

type ListFixtureProps = {
  vsPromocion: Fixture[];
  promociones: PromocionParticipanteRow[];
  onEdit: (
    index: number,
    equipo1: string,
    equipo2: string,
    fecha: Date,
    campo: number,
  ) => void;
};

export const ListFixture = ({
  vsPromocion,
  promociones,
  onEdit,
}: ListFixtureProps) => {
  const [editMode, setEditMode] = useState<number | null>(null);

  const handleEditClick = (index: number) => {
    setEditMode((prevMode) => (prevMode === index ? null : index));
  };
  const campos = CampoStore((state) => state.campos);

  const handleSaveClick = (index: number) => {
    setEditMode(null);
    const editedTeam1 = vsPromocion[index].promocion;
    const editedTeam2 = vsPromocion[index].vs_promocion;
    const editedDate = vsPromocion[index].fecha_partido;
    const editedCampo = vsPromocion[index].campo_id;

    if (editedTeam1 === editedTeam2) {
      toast.error("Los equipos no pueden ser iguales");
      return;
    }

    onEdit(index, editedTeam1, editedTeam2, editedDate, editedCampo);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipo 1</TableHead>
              <TableHead>VS</TableHead>
              <TableHead>Equipo 2</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>CAMPO</TableHead>
              <TableHead>Ronda</TableHead>
              <TableHead>GRUPO</TableHead>
              <TableHead>Deporte</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vsPromocion.map((promocion, index) => (
              <TableRow key={index}>
                <TableCell>
                  {editMode === index ? (
                    <Select
                      value={promocion.promocion}
                      onValueChange={(value) =>
                        onEdit(
                          index,
                          value,
                          promocion.vs_promocion,
                          promocion.fecha_partido,
                          promocion.campo_id,
                        )
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Equipo 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {promociones.map(({ id, nombre_promocion }) => (
                          <SelectItem key={id} value={nombre_promocion}>
                            {nombre_promocion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    promocion.promocion
                  )}
                </TableCell>
                <TableCell>VS</TableCell>
                <TableCell>
                  {editMode === index ? (
                    <Select
                      value={promocion.vs_promocion}
                      onValueChange={(value) => {
                        onEdit(
                          index,
                          promocion.promocion,
                          value,
                          promocion.fecha_partido,
                          promocion.campo_id,
                        );
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Equipo 2" />
                      </SelectTrigger>
                      <SelectContent>
                        {promociones.map(({ id, nombre_promocion }) => (
                          <SelectItem key={id} value={nombre_promocion}>
                            {nombre_promocion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    promocion.vs_promocion
                  )}
                </TableCell>
                <TableCell>
                  {editMode === index ? (
                    <Input
                      type="datetime-local"
                      value={
                        promocion.fecha_partido
                          ? format(
                              new Date(promocion.fecha_partido),
                              "yyyy-MM-dd'T'HH:mm",
                            )
                          : ""
                      }
                      onChange={(e) => {
                        const newDate = e.target.value
                          ? new Date(e.target.value)
                          : new Date();
                        onEdit(
                          index,
                          promocion.promocion,
                          promocion.vs_promocion,
                          newDate,
                          promocion.campo_id,
                        );
                      }}
                    />
                  ) : promocion.fecha_partido ? (
                    format(
                      new Date(promocion.fecha_partido),
                      "dd/MM/yyyy HH:mm",
                    )
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  {editMode === index ? (
                    <Select
                      value={promocion.campo_id?.toString()}
                      onValueChange={(value) => {
                        const newCampo = parseInt(value);
                        onEdit(
                          index,
                          promocion.promocion,
                          promocion.vs_promocion,
                          promocion.fecha_partido,
                          newCampo,
                        );
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {campos.map(({ id_campo, nombre_campo }) => (
                          <SelectItem
                            key={id_campo}
                            value={id_campo.toString()}
                          >
                            {nombre_campo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    campos.find((c) => c.id_campo === promocion.campo_id)
                      ?.nombre_campo || promocion.campo_id
                  )}
                </TableCell>
                <TableCell>{`ronda n° ${promocion.n_fecha_jugada}`}</TableCell>
                <TableCell>{promocion.grupo_id}</TableCell>
                <TableCell>{promocion.deporte_id}</TableCell>
                <TableCell>
                  {editMode === index ? (
                    <Button onClick={() => handleSaveClick(index)} size="sm">
                      Guardar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEditClick(index)}
                      variant="outline"
                      size="sm"
                    >
                      Editar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Toaster position="top-center" duration={3000} />
    </>
  );
};
