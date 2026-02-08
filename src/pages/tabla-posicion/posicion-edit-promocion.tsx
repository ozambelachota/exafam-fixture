import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { PosicionStore } from "../../store/PosicionStore";

interface FormData {
  nombre_promocion: string;
  goles_favor: number;
  goles_contra: number;
  diferencia_goles: number;
  puntos: number;
  pj: number;
  pg: number;
  pp: number;
  pe: number;
}

function PosicionEditPage() {
  const navigate = useNavigate();
  const promocionTabla = PosicionStore((state) => state.promocionTablaPosicion);
  const { control, handleSubmit } = useForm<FormData>({
    values: {
      nombre_promocion:
        promocionTabla.promocion_participante?.nombre_promocion || "",
      goles_favor: promocionTabla.goles_f,
      goles_contra: promocionTabla.goles_e,
      diferencia_goles: promocionTabla.diferencia_goles,
      puntos: promocionTabla.puntos,
      pj: promocionTabla.pj,
      pg: promocionTabla.pg,
      pp: promocionTabla.pp,
      pe: promocionTabla.pe,
    },
  });
  const updateTablaPosicion = PosicionStore(
    (state) => state.updatingTablaPosicionFutbol,
  );

  const getByIdPromocion = PosicionStore(
    (state) => state.getPosicionByIdPromocion,
  );

  const { id } = useParams();

  useEffect(() => {
    getByIdPromocion(Number(id));
  }, [id, getByIdPromocion]);

  const onUpdate = (data: FormData) => {
    updateTablaPosicion({
      id: Number(id),
      promocion: promocionTabla.promocion,
      goles_f: Number(data.goles_favor),
      goles_e: Number(data.goles_contra),
      diferencia_goles: Number(data.diferencia_goles),
      puntos: Number(data.puntos),
      pj: Number(data.pj),
      pg: Number(data.pg),
      pp: Number(data.pp),
      pe: Number(data.pe),
      grupo_id: promocionTabla.grupo_id,
    });
  };

  const onSubmit = (data: FormData) => {
    if (data.goles_favor < 0 || data.goles_contra < 0) {
      toast.error("Se requiere un numero de goles positivo");
      return;
    }
    if (data.pj < 0) {
      toast.error("Se requiere un numero de partidos jugados positivo");
      return;
    }
    if (data.pg < 0) {
      toast.error("Se requiere un numero de partidos ganados positivo");
      return;
    }
    if (data.pp < 0) {
      toast.error("Se requiere un numero de partidos perdidos positivo");
      return;
    }
    if (data.pe < 0) {
      toast.error("Se requiere un numero de partidos empatados positivo");
      return;
    }
    onUpdate(data);
    toast.success("Promocional guardado");
    // Optionally navigate back
    // navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-muted/10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Editar tabla de la promocion{" "}
            <span className="text-primary">
              {promocionTabla.promocion_participante?.nombre_promocion}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="nombre_promocion"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="nombre_promocion">Nombre promocion</Label>
                  <Input id="nombre_promocion" disabled {...field} />
                </div>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="goles_favor"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="goles_favor">Goles a favor</Label>
                    <Input id="goles_favor" type="number" {...field} />
                  </div>
                )}
              />
              <Controller
                name="goles_contra"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="goles_contra">Goles en contra</Label>
                    <Input id="goles_contra" type="number" {...field} />
                  </div>
                )}
              />
            </div>

            <Controller
              name="diferencia_goles"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="diferencia_goles">Diferencia de goles</Label>
                  <Input id="diferencia_goles" type="number" {...field} />
                </div>
              )}
            />

            <Controller
              name="puntos"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="puntos">Puntos</Label>
                  <Input id="puntos" type="number" {...field} />
                </div>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Controller
                name="pj"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="pj">PJ</Label>
                    <Input id="pj" type="number" {...field} />
                  </div>
                )}
              />

              <Controller
                name="pg"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="pg">PG</Label>
                    <Input id="pg" type="number" {...field} />
                  </div>
                )}
              />

              <Controller
                name="pp"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="pp">PP</Label>
                    <Input id="pp" type="number" {...field} />
                  </div>
                )}
              />

              <Controller
                name="pe"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="pe">PE</Label>
                    <Input id="pe" type="number" {...field} />
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster position="top-center" duration={4000} theme="dark" />
    </div>
  );
}

export default PosicionEditPage;
