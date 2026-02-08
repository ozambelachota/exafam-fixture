import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSancionGolStore } from "../store/sancion-gol.store";
import { Pencil, Search } from "lucide-react";

function TablaEditSancion() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const listSancion = useSancionGolStore((state) => state.sancion);
  const getSanciones = useSancionGolStore((state) => state.getSancion);

  useEffect(() => {
    getSanciones();
  }, [getSanciones]);

  const filteredRows = listSancion.filter((row) =>
    row.nombre_promocion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/sancion/edit/${id}`);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre de jugador..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">ID</TableHead>
              <TableHead className="text-center">Promocion</TableHead>
              <TableHead className="text-center">Tarjetas Amarillas</TableHead>
              <TableHead className="text-center">Tarjetas Rojas</TableHead>
              <TableHead className="text-center">Tipo Sancion</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-center">
                    {row.id}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.nombre_promocion}
                  </TableCell>
                  <TableCell className="text-center font-bold text-yellow-600">
                    {row.cant_tarjeta_amarilla}
                  </TableCell>
                  <TableCell className="text-center font-bold text-red-600">
                    {row.cant_tarjeta_roja}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.tipo_sancion}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(row.id || 0)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TablaEditSancion;
