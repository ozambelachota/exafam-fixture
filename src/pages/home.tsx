import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientApi } from "../api/client.api";
import TablaFixture from "../components/tabla-fixture";
import { userAdmin } from "../services/api.service";
import { useUserStore } from "../store/login.store";

export default function Home() {
  const setUser = useUserStore((state) => state.setUserData);
  const navigate = useNavigate();
  const rol = useUserStore((state) => state.rol);
  const user = useUserStore((state) => state.username);

  useEffect(() => {
    clientApi.auth.getSession().then(({ data }) => {
      if (data.session) {
        userAdmin(data.session.user.id).then((rol) => {
          if (rol)
            setUser(
              data.session.user.user_metadata.full_name ?? "",
              data.session.user.user_metadata.picture ?? "",
              rol,
              data.session.user.id ?? ""
            );
        });
        if (rol === "admin") navigate("/admin/home", { replace: true });
      }
    });
  }, [user]);
  return (
    <div>
      <TablaFixture />
    </div>
  );
}
