import { Save } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { CampeonatoStore } from "../store/Campeonato.store";
import DeporteStore from "../store/deporte.store";
import { GrupoStore } from "../store/grupoSotre.store";
import { PromocionStore } from "../store/promocionales.store";
import { PromocionParticipante } from "../types/fixture.api.type";

function FormPromocionParticipante() {
  const form = useForm<PromocionParticipante>({
    defaultValues: {
      nombre_promocion: "",
      campeonato_id: 0,
      grupo_id: 0,
      tipo_id: 0,
    },
  });

  const { control, handleSubmit, reset } = form;

  const handleFormSubmit = (data: PromocionParticipante) => {
    if (Number(data.campeonato_id) < 0) {
      toast.error("Se requiere un campeonato");
      return;
    }
    if (Number(data.tipo_id) < 0) {
      toast.error("Se requiere un deporte");
      return;
    }
    if (Number(data.grupo_id) < 0) {
      toast.error("Se requiere un grupo");
      return;
    }
    if (data.nombre_promocion == "") {
      toast.error("Se requiere un nombre");
      return;
    }
    reset();
    toast.success("Participante guardado");
    onSave({
      ...data,
      campeonato_id: Number(data.campeonato_id),
      grupo_id: Number(data.grupo_id),
      tipo_id: Number(data.tipo_id),
    });
  };
  const promocionParticipanteSet = PromocionStore(
    (state) => state.setPromocionParticipante,
  );
  const onSave = (promocion: PromocionParticipante) => {
    promocionParticipanteSet(promocion);
  };
  const deportes = DeporteStore((state) => state.deportes);
  const getGrupos = GrupoStore((state) => state.obtenerGrupo);
  const grupos = GrupoStore((state) => state.grupos);
  const campeonatos = CampeonatoStore((state) => state.campeonatos);
  const getCampeonatos = CampeonatoStore((state) => state.getCampeonato);
  useEffect(() => {
    getGrupos();
    getCampeonatos();
  }, []);

  return (
    <div className="p-4 bg-background rounded-lg border shadow-sm">
      <h4 className="text-2xl font-semibold text-center mb-6">
        Inscripción de nueva promoción
      </h4>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="nombre_promocion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la promoción</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la promoción" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="campeonato_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campeonato</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : "0"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar campeonato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0" disabled>
                      Seleccionar campeonato
                    </SelectItem>
                    {campeonatos.map((campeonato) => (
                      <SelectItem
                        key={campeonato.id ?? Math.random()}
                        value={campeonato.id?.toString() ?? "0"}
                      >
                        {campeonato.nombre_campeonato}
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
            name="grupo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : "0"}
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
            name="tipo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deporte</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : "0"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar deporte" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0" disabled>
                      Seleccionar deporte
                    </SelectItem>
                    {deportes.map((deporte) => (
                      <SelectItem
                        key={deporte.id ?? Math.random()}
                        value={deporte.id?.toString() ?? "0"}
                      >
                        {deporte.nombre_tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button type="submit" className="w-full md:w-auto" size="lg">
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </div>
        </form>
      </Form>
      <Toaster position="top-center" />
    </div>
  );
}

export default FormPromocionParticipante;
