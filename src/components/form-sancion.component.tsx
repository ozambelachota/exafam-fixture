import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { GrupoStore } from "../store/grupoSotre.store";
import { useSancionGolStore } from "../store/sancion-gol.store";
import { ListaSancion } from "../types/fixture.api.type";

interface FormData {
  grupo_id: number;
  cant_tarjeta_amarilla: number;
  cant_tarjeta_roja: number;
  nombre_promocion: string;
  promocion_id: number;
  tipo_sancion: number;
  motivo_sancion: string;
}

function FormSancionComponent() {
  const grupos = GrupoStore((state) => state.grupos);
  const getGrupos = GrupoStore((state) => state.obtenerGrupo);
  const sancion = useSancionGolStore((state) => state.jugadorSancionado);
  const getTipoSancion = useSancionGolStore((state) => state.getTipoSancion);
  const tipoSanciones = useSancionGolStore((state) => state.tipoSancion);
  const promcionesPartcipantes = useSancionGolStore(
    (state) => state.promocionesPartipantes,
  );
  const promoionesParticipantesPorGrupo = useSancionGolStore(
    (state) => state.getPromocionesParticipantesPorGrupo,
  );
  const promocionales = useSancionGolStore((state) => state.promocionales);

  const insertarSancionJugador = useSancionGolStore(
    (state) => state.insertJugadorSancion,
  );
  const promocionalesPorPromocionParticipante = useSancionGolStore(
    (state) => state.obtenerPromocionalesPorParticipante,
  );
  const form = useForm<FormData>({
    defaultValues: {
      grupo_id: 0,
      cant_tarjeta_amarilla: 0,
      cant_tarjeta_roja: 0,
      nombre_promocion: "",
      promocion_id: 0,
      tipo_sancion: 0,
      motivo_sancion: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const idPromocionParticipante = useSancionGolStore(
    (state) => state.idPromocionParticipante,
  );
  const setIdPromocionParticipante = useSancionGolStore(
    (state) => state.setIdPromocionParticipante,
  );

  useEffect(() => {
    getGrupos();
    getTipoSancion();
    if (idPromocionParticipante > 0) {
      promocionalesPorPromocionParticipante(idPromocionParticipante);
      console.log(promocionales);
    }
  }, [promcionesPartcipantes, idPromocionParticipante]);

  const onInsertJugadorSancion: SubmitHandler<FormData> = (data) => {
    if (Number(data.cant_tarjeta_amarilla) < 0) {
      toast.error(
        "Se requiere una cantidad de tarjetas amarillas mayor a cero",
      );
      return;
    }
    if (data.nombre_promocion === "") {
      toast.error("Se requiere una promoción");
      return;
    }
    if (Number(data.cant_tarjeta_roja) < 0) {
      toast.error("Se requiere una cantidad de tarjetas rojas mayor a cero");
      return;
    }
    if (data.promocion_id === 0) {
      toast.error("Se requiere una promoción");
      return;
    }
    console.log(data);
    onSave({
      ...sancion,
      tipo_sancion: Number(data.tipo_sancion),
      promocion_id: data.promocion_id,
      cant_tarjeta_amarilla: Number(data.cant_tarjeta_amarilla),
      cant_tarjeta_roja: Number(data.cant_tarjeta_roja),
      motivo_sancion: data.motivo_sancion,
      nombre_promocion: data.nombre_promocion,
    });
    toast.success("Jugador sancionado");
  };
  const onSave = async (sancionJugador: ListaSancion) => {
    await insertarSancionJugador(sancionJugador);
    reset();
  };

  return (
    <div className="p-4 bg-background rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Registro de Sanciones</h3>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onInsertJugadorSancion)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="grupo_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar grupo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      if (Number(value) > 0) {
                        promoionesParticipantesPorGrupo(Number(value));
                      }
                    }}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0" disabled>
                        Seleccionar grupo
                      </SelectItem>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.id} value={grupo.id.toString()}>
                          {grupo.nombre_grupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="promocion_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar promocion participante</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      setIdPromocionParticipante(Number(value));
                    }}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar promocion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0" disabled>
                        Seleccionar promocion
                      </SelectItem>
                      {promcionesPartcipantes &&
                        promcionesPartcipantes.map((promocion) => (
                          <SelectItem
                            key={promocion.id}
                            value={promocion.id.toString()}
                          >
                            {promocion.nombre_promocion}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="nombre_promocion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar promocional</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar promocional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="" disabled>
                        Seleccionar promocional
                      </SelectItem>
                      {promocionales.map((promocional) => (
                        <SelectItem
                          key={promocional.id}
                          value={promocional.nombre_promocional}
                        >
                          {promocional.nombre_promocional}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="tipo_sancion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar tipo de sancion</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0" disabled>
                        Ninguno
                      </SelectItem>
                      {tipoSanciones.map((sancion) => (
                        <SelectItem
                          key={sancion.id ?? Math.random()}
                          value={sancion.id?.toString() ?? "0"}
                        >
                          {sancion.nombre_tipo + "-" + sancion.cantidad_fecha}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="cant_tarjeta_amarilla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cant. Tarjeta Amarillas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="motivo_sancion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de la sanción</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Motivo de la sanción" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="cant_tarjeta_roja"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cant. Tarjeta Rojas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Insertar Jugador
          </Button>
        </form>
      </Form>
      <Toaster position="top-center" duration={4000} />
    </div>
  );
}

export default FormSancionComponent;
