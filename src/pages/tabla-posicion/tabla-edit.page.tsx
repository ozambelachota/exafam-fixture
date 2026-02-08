import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GrupoStore } from "../../store/grupoSotre.store";
import DeporteStore from "../../store/deporte.store";

function TablaEditPosicionPage() {
  const grupos = GrupoStore((state) => state.grupos);

  const obtenerGrupos = GrupoStore((state) => state.obtenerGrupo);
  const deportes = DeporteStore((state) => state.deportes);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerGrupos();
  }, [obtenerGrupos]);

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-3xl font-bold text-center">Ver por grupos</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {grupos.map((grupo) => (
          <div key={grupo.id} className="flex items-center">
            <Button
              className="py-6 text-lg"
              onClick={() =>
                navigate(`/admin/ver-posicion/promocion/grupo/${grupo.id}`)
              }
            >
              {grupo.nombre_grupo} - Ver posiciones
            </Button>
          </div>
        ))}
        {deportes.map((deporte, index) => (
          <div key={deporte.id} className="flex items-center">
            <Button
              disabled={index === 0}
              variant={index === 0 ? "ghost" : "default"}
              className="py-6 text-lg"
              onClick={() => navigate(`/admin/voley/${deporte.id}`)}
            >
              {deporte.nombre_tipo}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TablaEditPosicionPage;
