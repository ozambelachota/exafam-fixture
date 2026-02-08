import {
  CalendarDays,
  BarChart4,
  Trophy,
  User,
  ShieldAlert,
  Medal,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  {
    text: "Resultados",
    to: "/resultado",
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    text: "Posiciones",
    to: "/posicion",
    icon: <BarChart4 className="w-5 h-5" />,
  },
  {
    text: "Futbol",
    to: "/",
    icon: <Trophy className="w-5 h-5 text-green-500" />,
  },
  {
    text: "Voley",
    to: "/voley",
    icon: <Medal className="w-5 h-5 text-blue-400" />,
  },
  {
    text: "Goleadores",
    to: "/goles",
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
  },
  {
    text: "Sanciones",
    to: "/sancion",
    icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
  },
  { text: "Login", to: "/login", icon: <User className="w-5 h-5" /> },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = ({
    className,
    onClick,
  }: {
    className?: string;
    onClick?: () => void;
  }) => (
    <>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.text}
            to={item.to}
            onClick={onClick}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary/10 text-primary" // Active state
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              className,
            )}
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Desktop Layout */}
        <div className="mr-4 hidden md:flex md:w-full md:justify-center">
          <div className="hidden md:flex items-center gap-1">
            <NavLinks />
          </div>
        </div>

        {/* Mobile Header (Logo + Menu) */}
        <div className="flex flex-1 items-center justify-between md:hidden">
          <Link to="/" className="font-bold text-lg">
            EXAFAM FIXTURE
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <div className="font-bold text-lg px-2">Menu</div>
                <div className="flex flex-col gap-1">
                  <NavLinks onClick={() => setIsOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
