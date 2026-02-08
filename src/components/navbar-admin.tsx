import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/api.service";
import { useUserStore } from "../store/login.store";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Menu,
  Home,
  FileText,
  Users,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.username);
  const setUser = useUserStore((state) => state.setUserData);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      const { username, profilePicture, login, id_user } = JSON.parse(userData);
      setUser(username, profilePicture, login, id_user);
    }
    if (!user && !userData) {
      navigate("/", { replace: true });
    }
  }, [user, setUser, navigate]);

  const handleLogout = async () => {
    const error = await signOut();

    if (error) {
      console.log(error);
      return;
    } else {
      navigate("/", { replace: true });
      setUser("", "", "", "");
      sessionStorage.removeItem("userData");
    }
  };

  const links = [
    { to: "/admin/home", label: "Inicio", icon: <Home className="w-5 h-5" /> },
    {
      to: "/admin/registrar-fixture",
      label: "Registrar Fixture",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      to: "registrar-promociones",
      label: "Participantes",
      icon: <Users className="w-5 h-5" />,
    },
    {
      to: "posicionar-promocion",
      label: "Posiciones",
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      to: "sancion",
      label: "Sanciones",
      icon: <AlertCircle className="w-5 h-5" />,
    },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => {
    return (
      <div className="flex flex-col gap-2 p-4">
        {links.map((link) => {
          const isActive = link.to.startsWith("/")
            ? location.pathname === link.to
            : location.pathname.includes(link.to);

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    );
  };

  const UserProfile = () => (
    <div className="mt-auto p-4 border-t bg-muted/20">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-medium truncate">{user}</p>
          <p className="text-xs text-muted-foreground">Administrador</p>
        </div>
      </div>
      <Button
        variant="destructive"
        className="w-full justify-start"
        size="sm"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b">
          <Link
            to="/admin/home"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <Trophy className="w-6 h-6 text-primary" />
            <span>EXAFAM ADMIN</span>
          </Link>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="py-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">
              Principal
            </p>
            <NavLinks />
          </div>

          <UserProfile />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 justify-between">
        <Link
          to="/admin/home"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <Trophy className="w-5 h-5 text-primary" />
          <span>EXAFAM ADMIN</span>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col w-72">
            <div className="h-16 flex items-center px-6 border-b bg-muted/10">
              <div className="font-bold text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                EXAFAM ADMIN
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <NavLinks onClick={() => setIsOpen(false)} />
              <UserProfile />
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

export default NavbarAdmin;
