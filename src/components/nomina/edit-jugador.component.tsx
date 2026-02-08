import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { PromocionStore } from "../../store/promocionales.store";

interface FormData {
  nombre_promocional: string;
  n_goles: number;
}

function EditjugadorComponent() {
  const { id } = useParams();
  const promocion = PromocionStore((state) => state.promocionById);
  const getPromocionById = PromocionStore((state) => state.getPromocionById);
  const navigate = useNavigate();
  const updatePromocion = PromocionStore((state) => state.updatePromcoion);

  const form = useForm<FormData>({
    defaultValues: {
      nombre_promocional: "",
      n_goles: 0,
    },
    values: {
      nombre_promocional: promocion?.nombre_promocional || "",
      n_goles: promocion?.n_goles || 0,
    },
  });

  const { control, handleSubmit } = form;

  const onUpdate = (data: FormData) => {
    if (data.nombre_promocional === "") {
      toast.error("Se requiere un nombre");
      return;
    }
    if (data.n_goles < 0) {
      toast.error("Se requiere un numero de goles positivo");
      return;
    }
    updatePromocion({
      id: Number(id),
      id_promocion_participante: promocion?.id_promocion_participante || 0,
      nombre_promocional: data.nombre_promocional,
      n_goles: data.n_goles,
    });
    toast.success("Promocional actualizado");
    // Optionally navigate back after update
    // navigate("/admin/registrar-promociones");
  };

  useEffect(() => {
    getPromocionById(Number(id));
  }, [id]);

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Editar jugador de la promoción{" "}
            <span className="text-primary">
              {promocion?.promocion_participante?.nombre_promocion}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <FormField
                control={control}
                name="nombre_promocional"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Promocional</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre Promocional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="n_goles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de goles</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Número de goles"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" className="w-full">
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate("/admin/registrar-promociones");
                  }}
                >
                  Volver
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster position="top-center" duration={4000} theme="dark" />
    </div>
  );
}

export default EditjugadorComponent;
