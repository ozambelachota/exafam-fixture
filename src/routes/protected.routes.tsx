import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/login.store";

const ROL = "admin";
function ProtectedRouter() {
  const { rol, username } = useUserStore();

  useEffect(() => {
    const { admin } = JSON.parse(sessionStorage.getItem("userData") || "{}");
    if (!rol || !admin) {
      sessionStorage.removeItem("userStore");
    }
  }, [username]);

  if (username && rol === ROL) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
}

export default ProtectedRouter;
  