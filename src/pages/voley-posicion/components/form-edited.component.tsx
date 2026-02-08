import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useVoleyStore } from "../store/Voley.store";

interface FormVoley {
  id?: number;
  puntos: number;
  partidos_g: number;
  partidos_p: number;
  partidos_j: number;
}

interface FormEditVoleyPosicionProps {
  onSuccess?: () => void;
}

function FormEditVoleyPosicion({ onSuccess }: FormEditVoleyPosicionProps) {
  const { voley, updateVoleySet, getVoley } = useVoleyStore();
  const { control, handleSubmit } = useForm<FormVoley>({
    defaultValues: {
      puntos: voley?.puntos,
      partidos_g: voley?.partidos_g,
      partidos_p: voley?.partidos_p,
      partidos_j: voley?.partidos_j,
    },
  });

  const onUpdateVoley: SubmitHandler<FormVoley> = async (data) => {
    if (
      data.puntos < 0 ||
      data.partidos_g < 0 ||
      data.partidos_p < 0 ||
      data.partidos_j < 0
    ) {
      toast.error("Se requiere un numero positivo");
    } else {
      // Convert string inputs to numbers if necessary, though type="number" usually handles it in HTML,
      // react-hook-form might pass strings. Safe to cast.
      const payload = {
        ...voley,
        ...data,
        puntos: Number(data.puntos),
        partidos_g: Number(data.partidos_g),
        partidos_p: Number(data.partidos_p),
        partidos_j: Number(data.partidos_j),
      };

      await updateVoleySet(payload);
      toast.success("Posicion actualizada");
      getVoley(voley.deporte_id);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">
          Editar Posicion {voley.promocion_participante?.nombre_promocion}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onUpdateVoley)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
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
          <Controller
            name="partidos_g"
            control={control}
            render={({ field }) => (
              <div className="grid gap-2">
                <Label htmlFor="partidos_g">Partidos ganados</Label>
                <Input id="partidos_g" type="number" {...field} />
              </div>
            )}
          />
          <Controller
            name="partidos_p"
            control={control}
            render={({ field }) => (
              <div className="grid gap-2">
                <Label htmlFor="partidos_p">Partidos perdidos</Label>
                <Input id="partidos_p" type="number" {...field} />
              </div>
            )}
          />
          <Controller
            name="partidos_j"
            control={control}
            render={({ field }) => (
              <div className="grid gap-2">
                <Label htmlFor="partidos_j">Partidos jugados</Label>
                <Input id="partidos_j" type="number" {...field} />
              </div>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Guardar
        </Button>
      </form>
    </div>
  );
}

export default FormEditVoleyPosicion;
