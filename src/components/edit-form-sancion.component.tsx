import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useSancionGolStore } from "../store/sancion-gol.store";
import { ListaSancion } from "../types/fixture.api.type";

interface FormUpdate {
  nombre_promocion: string;
  motivo_sancion: string;
  cant_tarjeta_amarilla: number;
  cant_tarjeta_roja: number;
  tipo_sancion: number;
}

function FormEditSaancionComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jugadorSancionadoById = useSancionGolStore(
    (state) => state.jugadorSancionadoById,
  );
  const updatingJugadorSancionado = useSancionGolStore(
    (state) => state.updateJugadorSancion,
  );
  const tipoSancion = useSancionGolStore((state) => state.tipoSancion);
  const getTipoSancion = useSancionGolStore((state) => state.getTipoSancion);
  const sancionadoId = useSancionGolStore((state) => state.sancionadoId);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormUpdate>({
    defaultValues: {
      nombre_promocion: "",
      cant_tarjeta_amarilla: 0,
      cant_tarjeta_roja: 0,
      tipo_sancion: 0,
      motivo_sancion: "",
    },
    values: {
      nombre_promocion: sancionadoId.nombre_promocion,
      cant_tarjeta_amarilla: sancionadoId.cant_tarjeta_amarilla,
      cant_tarjeta_roja: sancionadoId.cant_tarjeta_roja,
      tipo_sancion: sancionadoId.tipo_sancion,
      motivo_sancion: sancionadoId.motivo_sancion,
    },
  });

  useEffect(() => {
    getTipoSancion();

    if (id) {
      jugadorSancionadoById(Number(id));
    }
  }, [id, getTipoSancion, jugadorSancionadoById]);

  // Force reset when sancionadoId changes to ensure form is updated
  useEffect(() => {
    if (sancionadoId) {
      reset({
        nombre_promocion: sancionadoId.nombre_promocion,
        cant_tarjeta_amarilla: sancionadoId.cant_tarjeta_amarilla,
        cant_tarjeta_roja: sancionadoId.cant_tarjeta_roja,
        tipo_sancion: sancionadoId.tipo_sancion,
        motivo_sancion: sancionadoId.motivo_sancion,
      });
    }
  }, [sancionadoId, reset]);

  const onUpdateJugadorSancionado: SubmitHandler<FormUpdate> = (data) => {
    console.log(data);
    if (data.cant_tarjeta_amarilla < sancionadoId.cant_tarjeta_amarilla) {
      toast.error(
        "La cantidad de tarjetas amarillas no puede ser menor a la actual",
      );
      return;
    }
    if (data.cant_tarjeta_amarilla < 0) {
      toast.error(
        "Se requiere una cantidad de tarjetas amarillas mayor a cero",
      );
      return;
    }

    onUpdate({
      ...sancionadoId,
      cant_tarjeta_amarilla: Number(data.cant_tarjeta_amarilla),
      cant_tarjeta_roja: Number(data.cant_tarjeta_roja),
      motivo_sancion: data.motivo_sancion,
      tipo_sancion: Number(data.tipo_sancion),
    });
    console.log(data);
    toast.success("Jugador sancionado editado");
  };

  const onUpdate = async (jugador: ListaSancion) => {
    if (jugador === sancionadoId) {
      toast.error("No se puede editar porque no hay cambios");
      return;
    }
    updatingJugadorSancionado(jugador);
  };
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Editando al jugador sancionado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onUpdateJugadorSancionado)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="nombre_promocion">Nombre Promocion</Label>
              <Controller
                name="nombre_promocion"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="nombre_promocion" disabled />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo_sancion">Motivo Sancion</Label>
              <Controller
                name="motivo_sancion"
                control={control}
                render={({ field }) => <Input {...field} id="motivo_sancion" />}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_sancion">Tipo Sancion</Label>
              <Controller
                name="tipo_sancion"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <SelectTrigger id="tipo_sancion">
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Ninguno</SelectItem>
                      {tipoSancion.map((tipo) => (
                        <SelectItem key={tipo.id} value={String(tipo.id)}>
                          {tipo.nombre_tipo + "-" + tipo.cantidad_fecha}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cant_tarjeta_amarilla">
                Cant. Tarjetas Amarillas
              </Label>
              <Controller
                name="cant_tarjeta_amarilla"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <Input {...field} type="number" id="cant_tarjeta_amarilla" />
                )}
              />
              {errors.cant_tarjeta_amarilla && (
                <span className="text-sm text-red-500">
                  {errors.cant_tarjeta_amarilla.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cant_tarjeta_roja">Cant. Tarjetas Rojas</Label>
              <Controller
                name="cant_tarjeta_roja"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="number" id="cant_tarjeta_roja" />
                )}
              />
              {errors.cant_tarjeta_roja && (
                <span className="text-sm text-red-500">
                  {errors.cant_tarjeta_roja.message}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  navigate("/admin/sancion");
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                Actualizar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster position="top-center" duration={4000} theme="dark" />
    </div>
  );
}

export default FormEditSaancionComponent;
