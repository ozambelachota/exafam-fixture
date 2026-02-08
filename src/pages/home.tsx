import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { clientApi } from "../api/client.api";
import { userAdmin, getCampeonatoById } from "../services/api.service";
import { useUserStore } from "../store/login.store";
import { PublicFixtureView } from "@/components/public-fixture-view";
import { ChampionshipStats } from "@/components/championship-stats";
import { ChampionshipStatusToggle } from "@/components/championship-status-toggle";
import { Loader2 } from "lucide-react";

export default function Home() {
  const setUser = useUserStore((state) => state.setUserData);
  const navigate = useNavigate();
  const rol = useUserStore((state) => state.rol);

  // Fetch championship data
  const { data: campeonato, isLoading } = useQuery({
    queryKey: ["campeonato", 1],
    queryFn: () => getCampeonatoById(1),
  });

  useEffect(() => {
    clientApi.auth.getSession().then(({ data }) => {
      if (data.session) {
        userAdmin(data.session.user.id).then((rol) => {
          if (rol)
            setUser(
              data.session.user.user_metadata.full_name ?? "",
              data.session.user.user_metadata.picture ?? "",
              rol,
              data.session.user.id ?? "",
            );
        });
        if (rol === "admin") navigate("/admin/home", { replace: true });
      }
    });
  }, [navigate, rol, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Cargando campeonato...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 container mx-auto space-y-8">
      {/* Admin Controls */}
      {rol === "admin" && campeonato && (
        <ChampionshipStatusToggle campeonato={campeonato} />
      )}

      {/* Conditional Rendering based on Championship Status */}
      {campeonato?.estado === "en_curso" ? (
        <PublicFixtureView />
      ) : (
        <ChampionshipStats campeonatoId={1} />
      )}
    </div>
  );
}
