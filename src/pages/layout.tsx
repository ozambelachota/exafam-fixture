import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/navbar.component";
import { nombreCampeonato } from "../services/api.service";

type props = {
  children: React.ReactNode;
};

const Layout = ({ children }: props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["campeonaato", 1],
    queryFn: () => nombreCampeonato(1),
  });

  return (
    <div className="min-h-screen bg-indigo-950 text-white font-sans selection:bg-pink-500 selection:text-white">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-4">
        <div className="flex flex-col justify-center items-center">
          <img
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg animate-in fade-in zoom-in duration-700"
            src="LOGO-EXAFAM.webp"
            alt="logo exafam"
          />
          {/* <img src="trofeo.png" className="w-16 h-16 mt-[-20px] z-10" alt="trophy" /> */}
        </div>

        <div className="flex flex-col items-center justify-center text-center max-w-2xl px-4">
          {isLoading && (
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-slate-700 rounded w-48"></div>
            </div>
          )}
          {isError && (
            <div className="text-red-500 font-bold">
              Error al cargar el campeonato
            </div>
          )}
          {data && (
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transform rotate-x-12 rotate-y-6 perspective-1000">
              {data}
            </h1>
          )}
        </div>

        <div className="flex flex-col justify-center items-center">
          <img
            src="trofeo.png"
            className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl animate-bounce"
            alt="trophy"
          />
        </div>
      </div>

      {/* Decorative divider - assuming it was a bottom divider or similar */}
      <div className="w-full overflow-hidden leading-[0] rotate-180">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-indigo-950"
          ></path>
        </svg>
      </div>

      <main className="container mx-auto px-4 py-8 pb-20">{children}</main>
    </div>
  );
};

export default Layout;
