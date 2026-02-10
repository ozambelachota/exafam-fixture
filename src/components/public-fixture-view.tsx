import { useEffect, useState } from "react";
import { clientApi } from "@/api/client.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, Trophy } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { Tables } from "@/types/database.types";

type PublicFixtureView = Tables<"public_fixture_view">;

interface PublicFixture {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  fecha_partido: string;
  numero_fecha: number;
  por_jugar: boolean;
  grupo: string;
  resultado: string | null;
  ganador: string | null;
  estado_partido: string;
}

export function PublicFixtureView() {
  const [fixtures, setFixtures] = useState<PublicFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const { data, error } = await clientApi
          .from("public_fixture_view")
          .select("*")
          .order("fecha_partido", { ascending: false });

        if (error) throw error;

        // Mapear datos de la vista (campos nullable) a la interface
        const mapped: PublicFixture[] = (data || [])
          .filter((d): d is PublicFixtureView & { id: number } => d.id !== null)
          .map((d) => ({
            id: d.id!,
            equipo_local: d.equipo_local ?? "",
            equipo_visitante: d.equipo_visitante ?? "",
            fecha_partido: d.fecha_partido ?? "",
            numero_fecha: d.numero_fecha ?? 0,
            por_jugar: d.por_jugar ?? false,
            grupo: d.grupo ?? "",
            resultado: d.resultado,
            ganador: d.ganador,
            estado_partido: d.estado_partido ?? "",
          }));
        setFixtures(mapped);
      } catch (err) {
        console.error("Error fetching fixtures:", err);
        setError("Error al cargar los partidos");
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando fixture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Group fixtures by fecha
  const fixturesByFecha = fixtures.reduce(
    (acc, fixture) => {
      const fecha = fixture.numero_fecha;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(fixture);
      return acc;
    },
    {} as Record<number, PublicFixture[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Fixture del Campeonato</h2>
      </div>

      {Object.entries(fixturesByFecha)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([fecha, fixturesInFecha]) => (
          <Card key={fecha}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fecha {fecha}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Equipo Local</TableHead>
                    <TableHead className="text-center">VS</TableHead>
                    <TableHead>Equipo Visitante</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixturesInFecha.map((fixture) => (
                    <TableRow key={fixture.id}>
                      <TableCell className="font-medium">
                        {fixture.grupo}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {fixture.equipo_local}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        VS
                      </TableCell>
                      <TableCell className="font-semibold">
                        {fixture.equipo_visitante}
                      </TableCell>
                      <TableCell>
                        {fixture.fecha_partido
                          ? format(
                              new Date(fixture.fecha_partido),
                              "dd/MM/yyyy HH:mm",
                              { locale: es },
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {fixture.resultado || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            fixture.estado_partido === "Finalizado"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : fixture.estado_partido === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {fixture.estado_partido}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
