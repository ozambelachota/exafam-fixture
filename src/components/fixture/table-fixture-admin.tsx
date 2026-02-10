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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fixtureStore } from "../../store/fixture.store";

interface FixtureUpdate {
  id?: number;
  promocion: string;
  vs_promocion: string;
  fecha_partido: string;
  campo_id: number | null;
  grupo_id: number;
  deporte_id: number | null;
  n_fecha_jugada: number;
  por_jugar: boolean;
}

export function TableFixtureAdmin() {
  const fixutres = fixtureStore((state) => state.fixture);
  const { desactivePartido } = fixtureStore();
  const [open, setOpen] = useState(false);
  const [fixture, setFixture] = useState<FixtureUpdate>({
    promocion: "",
    vs_promocion: "",
    fecha_partido: new Date().toISOString(),
    campo_id: 0,
    grupo_id: 0,
    deporte_id: 0,
    n_fecha_jugada: 0,
    por_jugar: false,
    id: 0,
  });
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const partidosObtenidos = fixtureStore((state) => state.obtenerPartidos);

  const cargarDatos = async () => {
    await partidosObtenidos();
  };

  const fixtureFiltradoPorJugr =
    fixutres?.filter(({ por_jugar }) => por_jugar === true) || [];

  const fixtureFiltradoPorRondaYGrupo = fixtureFiltradoPorJugr.filter(
    (fixture) => {
      if (selectedRound && fixture.n_fecha_jugada !== Number(selectedRound))
        return false;
      if (selectedGroup && fixture.grupo_id !== Number(selectedGroup))
        return false;
      return true;
    },
  );

  const deporte = (tipo: number) => {
    switch (tipo) {
      case 1:
        return "Fútbol";
      case 2:
        return "Voley";
      case 3:
        return "Voley Mixto";
      default:
        return "Desconocido";
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const navigate = useNavigate();

  const handleResult = (idFixture: number) => {
    navigate(`/admin/result-fixture/${idFixture}`);
  };

  const handleConfirm = async () => {
    await desactivePartido({
      ...fixture,
      fecha_partido: new Date(fixture.fecha_partido),
      campo_id: fixture.campo_id ?? 0,
      deporte_id: fixture.deporte_id ?? 0,
      por_jugar: false,
    });
    cargarDatos();
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-[180px]">
          <Select value={selectedRound} onValueChange={setSelectedRound}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar ronda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las rondas</SelectItem>
              {[...Array(11).keys()].map((round) => (
                <SelectItem key={round + 1} value={(round + 1).toString()}>
                  Ronda {round + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[180px]">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los grupos</SelectItem>
              {[...Array(8).keys()].map((group) => (
                <SelectItem key={group + 1} value={(group + 1).toString()}>
                  Grupo {group + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Partidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">Equipo 1</TableHead>
                  <TableHead className="text-center w-[50px]">VS</TableHead>
                  <TableHead className="text-left">Equipo 2</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Deporte</TableHead>
                  <TableHead className="text-center">Ronda</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixtureFiltradoPorRondaYGrupo.map((fixture) => (
                  <TableRow key={fixture.id}>
                    <TableCell className="text-right font-medium">
                      {fixture.promocion}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      vs
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {fixture.vs_promocion}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {fixture.por_jugar ? "Por jugar" : "Finalizado"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {deporte(fixture.deporte_id ?? 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {fixture.n_fecha_jugada}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setFixture(fixture);
                            setOpen(true);
                          }}
                        >
                          Terminar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => {
                            handleResult(fixture.id as number);
                          }}
                        >
                          Resultado
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate(`partido/${fixture.id}`);
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar terminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas terminar el partido entre{" "}
              {fixture.promocion} y {fixture.vs_promocion}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
