import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCampeonatoEstado } from "@/services/api.service";
import type { Campeonato } from "@/types/fixture.api.type";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, StopCircle, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/login.store";

interface ChampionshipStatusToggleProps {
  campeonato: Campeonato;
}

export function ChampionshipStatusToggle({
  campeonato,
}: ChampionshipStatusToggleProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const userRole = useUserStore((state) => state.rol);

  const mutation = useMutation({
    mutationFn: (newEstado: "en_curso" | "finalizado") =>
      toggleCampeonatoEstado(campeonato.id!, newEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campeonato"] });
      setOpen(false);
    },
  });

  // Only show to admins
  if (userRole !== "admin") {
    return null;
  }

  const isEnCurso = campeonato.estado === "en_curso";
  const newEstado = isEnCurso ? "finalizado" : "en_curso";

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium">Estado del Campeonato</p>
        <Badge variant={isEnCurso ? "default" : "secondary"} className="mt-1">
          {isEnCurso ? (
            <>
              <PlayCircle className="h-3 w-3 mr-1" />
              En Curso
            </>
          ) : (
            <>
              <StopCircle className="h-3 w-3 mr-1" />
              Finalizado
            </>
          )}
        </Badge>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={isEnCurso ? "destructive" : "default"}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cambiando...
              </>
            ) : isEnCurso ? (
              <>
                <StopCircle className="h-4 w-4 mr-2" />
                Finalizar Campeonato
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Reactivar Campeonato
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEnCurso ? "¿Finalizar Campeonato?" : "¿Reactivar Campeonato?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEnCurso ? (
                <>
                  Al finalizar el campeonato, se mostrará la vista de
                  estadísticas finales con campeones, goleadores y tabla de
                  posiciones. Esta acción se puede revertir.
                </>
              ) : (
                <>
                  Al reactivar el campeonato, se volverá a mostrar la vista de
                  partidos activos. Las estadísticas finales se ocultarán.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutation.mutate(newEstado)}
              className={isEnCurso ? "bg-destructive" : ""}
            >
              {isEnCurso ? "Finalizar" : "Reactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
