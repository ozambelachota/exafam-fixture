import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { fixtureStore } from "../../store/fixture.store";
import { ResultadStoreForm } from "../../store/resultado.store";

function ResultFixtureFormPage() {
  const partido = fixtureStore((state) => state.partido);
  const buscarPartido = fixtureStore((state) => state.buscarPartido);
  const { id } = useParams();
  const navigate = useNavigate();
  const obtenerPromociones = fixtureStore((state) => state.obtenerPromociones);
  const equipos = fixtureStore((state) => state.promocionParticipante);
  const { ganador, setGanador, resultado, setResult, insertResult } =
    ResultadStoreForm();
  useEffect(() => {
    obtenerPromociones();
    buscarPartido(Number(id));
  }, [partido]);

  const equiposFilter = equipos.filter((promocion) => {
    return (
      promocion.grupo_id === partido.grupo_id &&
      promocion.tipo_id == partido.deporte_id
    );
  });

  const handleSaveResult = async () => {
    if (resultado == "") {
      toast.error("Se requiere un resultado");
      return;
    }
    if (partido.id) {
      insertResult({
        fixture_id: partido.id,
        resultado: resultado,
        ganador_id: ganador,
      });
      navigate("/admin/registrar-fixture");
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Resultado del partido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-xl font-bold">vs</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Equipo 1</Label>
                <Input value={partido.promocion} disabled />
              </div>
              <div className="space-y-2">
                <Label>Equipo 2</Label>
                <Input value={partido.vs_promocion} disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Resultado</Label>
                <Input
                  value={resultado}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Resultado"
                />
              </div>
              <div className="space-y-2">
                <Label>Ganador</Label>
                <Select
                  value={ganador?.toString() || "null"}
                  onValueChange={(value) =>
                    setGanador(value === "null" ? null : Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ganador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Empate</SelectItem>
                    {equiposFilter.map((promocion) => (
                      <SelectItem
                        key={promocion.id}
                        value={promocion.id.toString()}
                      >
                        {promocion.nombre_promocion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-4 flex justify-center">
              <Button
                onClick={handleSaveResult}
                disabled={!resultado}
                className="w-full md:w-auto"
              >
                Guardar Resultado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-center" theme="dark" duration={4000} />
    </>
  );
}

export default ResultFixtureFormPage;
