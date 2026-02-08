import { useEffect, useState } from "react";
import { clientApi } from "@/api/client.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trophy, Target, Award, Medal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopScorer {
  nombre_completo: string;
  nombre_promocion: string;
  nombre_grupo: string;
  n_goles: number;
}

interface Champion {
  nombre_grupo: string;
  nombre_promocion: string;
  puntos: number;
  partidos_ganados: number;
}

interface FinalStanding {
  nombre_grupo: string;
  nombre_promocion: string;
  posicion: number;
  puntos: number;
  partidos_ganados: number;
  partidos_empatados: number;
  partidos_perdidos: number;
}

interface ChampionshipStatsProps {
  campeonatoId: number;
}

export function ChampionshipStats({ campeonatoId }: ChampionshipStatsProps) {
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [standings, setStandings] = useState<FinalStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch top scorers
        const { data: scorersData, error: scorersError } = await clientApi
          .from("promocionales")
          .select(
            `
            nombre_completo:nombre_promocional,
            n_goles,
            promocion_participante!inner(
              nombre_promocion,
              grupos_promociones!inner(nombre_grupo)
            )
          `,
          )
          .gt("n_goles", 0)
          .order("n_goles", { ascending: false })
          .limit(10);

        if (scorersError) throw scorersError;

        // Transform scorers data
        const transformedScorers =
          scorersData?.map((item: any) => ({
            nombre_completo: item.nombre_completo,
            n_goles: item.n_goles,
            nombre_promocion: item.promocion_participante.nombre_promocion,
            nombre_grupo:
              item.promocion_participante.grupos_promociones.nombre_grupo,
          })) || [];

        setTopScorers(transformedScorers);

        // Fetch champions (position 1 per group)
        const { data: championsData, error: championsError } = await clientApi
          .from("tabla_posicion")
          .select(
            `
            puntos,
            partidos_ganados:pg,
            promocion_participante!inner(
              nombre_promocion,
              grupos_promociones!inner(nombre_grupo)
            )
          `,
          )
          .eq("posicion", 1)
          .order("puntos", { ascending: false });

        if (championsError) throw championsError;

        const transformedChampions =
          championsData?.map((item: any) => ({
            nombre_grupo:
              item.promocion_participante.grupos_promociones.nombre_grupo,
            nombre_promocion: item.promocion_participante.nombre_promocion,
            puntos: item.puntos,
            partidos_ganados: item.partidos_ganados,
          })) || [];

        setChampions(transformedChampions);

        // Fetch final standings (top 3 per group)
        const { data: standingsData, error: standingsError } = await clientApi
          .from("tabla_posicion")
          .select(
            `
            posicion,
            puntos,
            partidos_ganados:pg,
            partidos_empatados:pe,
            partidos_perdidos:pp,
            promocion_participante!inner(
              nombre_promocion,
              grupos_promociones!inner(nombre_grupo)
            )
          `,
          )
          .lte("posicion", 3)
          .order("posicion", { ascending: true });

        if (standingsError) throw standingsError;

        const transformedStandings =
          standingsData?.map((item: any) => ({
            nombre_grupo:
              item.promocion_participante.grupos_promociones.nombre_grupo,
            nombre_promocion: item.promocion_participante.nombre_promocion,
            posicion: item.posicion,
            puntos: item.puntos,
            partidos_ganados: item.partidos_ganados,
            partidos_empatados: item.partidos_empatados,
            partidos_perdidos: item.partidos_perdidos,
          })) || [];

        setStandings(transformedStandings);
      } catch (err) {
        console.error("Error fetching championship stats:", err);
        setError("Error al cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [campeonatoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Cargando estadísticas finales...
          </p>
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

  // Group standings by group
  const standingsByGroup = standings.reduce(
    (acc, standing) => {
      if (!acc[standing.nombre_grupo]) {
        acc[standing.nombre_grupo] = [];
      }
      acc[standing.nombre_grupo].push(standing);
      return acc;
    },
    {} as Record<string, FinalStanding[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Estadísticas Finales</h2>
      </div>

      <Tabs defaultValue="champions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="champions">
            <Award className="h-4 w-4 mr-2" />
            Campeones
          </TabsTrigger>
          <TabsTrigger value="scorers">
            <Target className="h-4 w-4 mr-2" />
            Goleadores
          </TabsTrigger>
          <TabsTrigger value="standings">
            <Medal className="h-4 w-4 mr-2" />
            Posiciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="champions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campeones por Grupo</CardTitle>
              <CardDescription>
                Equipos que obtuvieron el primer lugar en cada grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="text-right">Puntos</TableHead>
                    <TableHead className="text-right">Victorias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {champions.map((champion, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {champion.nombre_grupo}
                      </TableCell>
                      <TableCell className="font-bold text-yellow-600 dark:text-yellow-400">
                        {champion.nombre_promocion}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {champion.puntos}
                      </TableCell>
                      <TableCell className="text-right">
                        {champion.partidos_ganados}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scorers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tabla de Goleadores</CardTitle>
              <CardDescription>
                Top 10 jugadores con más goles en el campeonato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Jugador</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead className="text-right">Goles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((scorer, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold">
                        {idx === 0 && "🥇"}
                        {idx === 1 && "🥈"}
                        {idx === 2 && "🥉"}
                        {idx > 2 && idx + 1}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {scorer.nombre_completo}
                      </TableCell>
                      <TableCell>{scorer.nombre_promocion}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {scorer.nombre_grupo}
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {scorer.n_goles}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standings" className="space-y-4">
          {Object.entries(standingsByGroup).map(([grupo, groupStandings]) => (
            <Card key={grupo}>
              <CardHeader>
                <CardTitle>{grupo}</CardTitle>
                <CardDescription>Posiciones finales del grupo</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Pos</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead className="text-right">PJ</TableHead>
                      <TableHead className="text-right">PG</TableHead>
                      <TableHead className="text-right">PE</TableHead>
                      <TableHead className="text-right">PP</TableHead>
                      <TableHead className="text-right">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupStandings.map((standing) => (
                      <TableRow key={`${grupo}-${standing.posicion}`}>
                        <TableCell className="font-bold">
                          {standing.posicion === 1 && "🥇"}
                          {standing.posicion === 2 && "🥈"}
                          {standing.posicion === 3 && "🥉"}
                        </TableCell>
                        <TableCell
                          className={
                            standing.posicion === 1
                              ? "font-bold text-yellow-600 dark:text-yellow-400"
                              : "font-medium"
                          }
                        >
                          {standing.nombre_promocion}
                        </TableCell>
                        <TableCell className="text-right">
                          {standing.partidos_ganados +
                            standing.partidos_empatados +
                            standing.partidos_perdidos}
                        </TableCell>
                        <TableCell className="text-right">
                          {standing.partidos_ganados}
                        </TableCell>
                        <TableCell className="text-right">
                          {standing.partidos_empatados}
                        </TableCell>
                        <TableCell className="text-right">
                          {standing.partidos_perdidos}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {standing.puntos}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
