import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientApi } from "../api/client.api";
import { userAdmin } from "../services/api.service";
import { useUserStore } from "../store/login.store";
import { Button } from "@/components/ui/button";

const LoginWithGoogle = () => {
  const setUser = useUserStore((state) => state.setUserData);
  const navigate = useNavigate();
  const setRol = useUserStore((state) => state.setRol);
  const username = useUserStore((state) => state.username);
  const rol = useUserStore((state) => state.rol);

  const handleLogin = async () => {
    try {
      const { error } = await clientApi.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        throw new Error("Ocurrió un error durante el inicio de sesión");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const auth = clientApi.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(
          session.user.user_metadata.full_name,
          session.user.user_metadata.picture,
          event,
          session.user.id,
        );

        const admin = await userAdmin(session.user.id);
        console.log(admin);
        if (admin && admin === "admin") {
          setRol(admin);
          sessionStorage.setItem(
            "userData",
            JSON.stringify({
              username: session.user.user_metadata.full_name,
              profilePicture: session.user.user_metadata.picture,
              login: event,
              id_user: session.user.id,
              admin: admin,
            }),
          );
        } else {
          sessionStorage.removeItem("userData");
          setRol("");
        }

        if (event === "INITIAL_SESSION") {
          navigate("/admin/home", { replace: true });
        }
      }
    });

    return () => {
      auth.data.subscription.unsubscribe();
    };
  }, [username, rol, setUser, navigate, setRol]);

  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      Iniciar sesión con Google
    </Button>
  );
};

export default LoginWithGoogle;
