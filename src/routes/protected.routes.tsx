import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUserStore } from "../store/login.store";
import { clientApi } from "../api/client.api";

const ADMIN_ROLE = "admin";

function ProtectedRouter() {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { rol, username, setRol } = useUserStore();

  useEffect(() => {
    const validateSession = async () => {
      try {
        // Check if user data exists in store
        if (!username || !rol) {
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // Validate session with Supabase
        const {
          data: { session },
          error,
        } = await clientApi.auth.getSession();

        if (error || !session) {
          // Session expired or invalid
          sessionStorage.removeItem("userStore");
          sessionStorage.removeItem("userData");
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // Verify admin role from database
        const { data: userData, error: userError } = await clientApi
          .from("usuario")
          .select("rol")
          .eq("user_id", session.user.id)
          .single();

        if (userError || !userData || userData.rol !== ADMIN_ROLE) {
          // User is not admin
          sessionStorage.removeItem("userStore");
          sessionStorage.removeItem("userData");
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // Update role in store if needed
        if (rol !== userData.rol) {
          setRol(userData.rol);
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session validation error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [username, rol, setRol]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Validando sesión...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated || rol !== ADMIN_ROLE) {
    return <Navigate to="/" replace />;
  }

  // Render protected content
  return <Outlet />;
}

export default ProtectedRouter;
