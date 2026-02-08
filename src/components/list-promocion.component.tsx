import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeporteStore from "../store/deporte.store";
import { fixtureStore } from "../store/fixture.store";
import { Plus } from "lucide-react";

const ListPromociones = () => {
  const navigate = useNavigate();
  const { promocionParticipante, obtenerPromociones, grupo, obtenerGrupo } =
    fixtureStore();
  const deportes = DeporteStore((state) => state.deportes);
  const [selectedGrupo, setSelectedGrupo] = useState<string>("");

  // Sort by ID
  const sortedPromociones = [...promocionParticipante].sort(
    (a, b) => a.id - b.id,
  );

  useEffect(() => {
    obtenerPromociones();
    obtenerGrupo();
  }, []);

  const handleGrupoChange = (value: string) => {
    setSelectedGrupo(value);
  };

  const filteredPromociones = selectedGrupo
    ? sortedPromociones.filter(
        (promocion) => promocion.grupo_id === Number(selectedGrupo),
      )
    : sortedPromociones;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Promocionales afiliados
        </h2>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/admin/promocion/create">
            <Plus className="mr-2 h-4 w-4" /> INSCRIBIR NUEVO PARTICIPANTE
          </Link>
        </Button>
      </div>

      <div className="w-full md:w-1/3">
        <Select value={selectedGrupo} onValueChange={handleGrupoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {grupo.map((g) => (
              <SelectItem key={g.id} value={g.id.toString()}>
                {g.nombre_grupo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Promociones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">N°</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Nombre de la Promoción</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Deporte</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromociones.map((promocion, index) => {
                  const grupoFiltter = grupo.filter(
                    (grupo) => grupo.id === promocion.grupo_id,
                  );
                  const deporte = deportes.filter(
                    (deporte) => deporte.id === promocion.tipo_id,
                  );
                  return (
                    <TableRow key={promocion.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {promocion.estado ? (
                          <span className="text-green-600 font-bold">
                            Activo
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold">
                            Inactivo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{promocion.nombre_promocion}</TableCell>
                      <TableCell>
                        {grupoFiltter
                          .map((grupo) => grupo.nombre_grupo)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {deporte.map((d) => d.nombre_tipo).join(", ")}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          asChild
                          variant="secondary"
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          <Link to={`create/${promocion.id}`}>Registrar</Link>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate(`/admin/nomina/${promocion.id}`);
                          }}
                        >
                          Ver nómina
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
};

export default ListPromociones;
