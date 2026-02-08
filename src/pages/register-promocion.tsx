import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { PromocionStore } from "../store/promocionales.store";

interface FormData {
  nombre_promocional: string;
  n_goles: number;
}

export const RegisterPromocion = () => {
  const { control, handleSubmit, setValue, reset } = useForm<FormData>({
    defaultValues: {
      nombre_promocional: "",
      n_goles: 0,
    },
  });

  const { id } = useParams();
  const agregarPromocion = PromocionStore((state) => state.agregarPromocion);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { nombre_promocional, n_goles } = data;
    if (nombre_promocional === "") {
      toast.error("Se requiere un nombre");
      return;
    }
    if (n_goles < 0) {
      toast.error("Se requiere un numero de goles positivo");
      return;
    } else {
      toast.success("Promocional guardado");
      console.log(data);
      agregarPromocion({
        nombre_promocional: nombre_promocional,
        id_promocion_participante: parseInt(id as string),
        n_goles: n_goles,
      });
      reset();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-muted/10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Registrar Promocional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            autoComplete="off"
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="nombre_promocional"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="nombrePromocional">Nombre Promocional</Label>
                  <Input
                    {...field}
                    id="nombrePromocional"
                    onChange={(e) => {
                      setValue("nombre_promocional", e.target.value);
                    }}
                  />
                </div>
              )}
            />

            <Controller
              name="n_goles"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="n_goles">N° de goles</Label>
                  <Input
                    {...field}
                    id="n_goles"
                    type="number"
                    onChange={(e) => {
                      if (Number(e.target.value) == 0) {
                        setValue("n_goles", 0);
                      }
                      field.onChange(e);
                    }}
                  />
                </div>
              )}
            />

            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Guardar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toaster position="top-center" duration={4000} theme="dark" />
    </div>
  );
};
