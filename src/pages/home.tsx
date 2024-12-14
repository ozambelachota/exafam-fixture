import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { clientApi } from "../api/client.api";
import { userAdmin } from "../services/api.service";
import { useUserStore } from "../store/login.store";
const grupos = [
  {
    grupo: 1,
    campeon: "PROMOCION 69",
    subcampeon: "PROMOCION 65",
    tercerPuesto: "PROMOCION 66",
    goleador: "Vejar Ruiz Justo Pastor PROMOCION 65",
    mejorArquero: "Gabriel Palmeira Jaba 69",
  },
  {
    grupo: 2,
    campeon: "PROMOCION 74",
    subcampeon: "PROMOCION 72",
    tercerPuesto: "PROMOCION 71",
    goleador: "Armando Sandoval Soria PROMOCION 74",
    mejorArquero: "Luis Brunner Perez 71",
  },
  {
    grupo: 3,
    campeon: "PROMOCION 81",
    subcampeon: "PROMOCION 79",
    tercerPuesto: "PROMOCION 78",
    goleador: "Villacorta Saldaña Linder PROMOCION 81",
    mejorArquero: "Alejandro Rivera Montalvo",
  },
  {
    grupo: 4,
    campeon: "PROMOCION 85",
    subcampeon: "PROMOCION 86",
    tercerPuesto: "PROMOCION 87",
    goleador: "Hugo Atencio Sotomayor PROMOCION 85",
    mejorArquero: "Felix Alvarez Segarra",
  },
  {
    grupo: 5,
    campeon: "PROMOCION 93",
    subcampeon: "PROMOCION 89",
    tercerPuesto: " PROMOCION 90",
    goleador: "Lewis Vasquez Rodriguez PROMOCION 89",
    mejorArquero: "James Gonzales Vela PROMOCION 93",
  },
  {
    grupo: 6,
    campeon: " PROMOCION 98",
    subcampeon: "PROMOCION 97",
    tercerPuesto: "PROMOCION 99",
    goleador: "Jose Diaz Ihuaraqui PROMOCION 98",
    mejorArquero: "Robert Torrejon Vasquez PROKMOCION 98",
  },
  {
    grupo: 7,
    campeon: "PROMOCION 2004",
    subcampeon: "PROMOCION 2005",
    tercerPuesto: "PROMOCION 2000",
    goleador: "Hugo Hidalgo Delgado PROMOCION 2005",
    mejorArquero: "Francis Perez Reategui PROMOCION 2005",
  },
  {
    grupo: 8,
    campeon: "PROMOCION 2010",
    subcampeon: "PROMOCION 2013",
    tercerPuesto: "PROMOCION 2008",
    goleador: "Francisco Torres Vasquez PROMOCION 2010",
    mejorArquero: "Jeffrey Huatangari PROMOCION 2010",
  },
];

const voley = {
  campeon: " PROMOCION 95",
  subcampeon: "PROMOCION 2004",
  tercerPuesto: "PROMOCION 92",
  cuartoPuesto: "PROMOCION 90",
  mejorJugadora: "Susanet Saavedra Pacheco, Brenda Vela Cava",
};

const voleyMixto = {
  campeon: "PROMOCION 92",
  subcampeon: "PROMOCION 2010",
  tercerPuesto: "PROMOCION 91",
  cuartoPuesto: "PROMOCION 96",
  mejorJugador:
    "William Shupingahua Echevarria PROMOCION 2010, Jose Muñoz Rodriguez PROMOCION 1992",
};
export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // Inicializar tamaño
    window.addEventListener("resize", handleResize); // Escuchar cambios de tamaño
    return () => window.removeEventListener("resize", handleResize); // Limpieza
  }, []);
  const setUser = useUserStore((state) => state.setUserData);
  const navigate = useNavigate();
  const rol = useUserStore((state) => state.rol);

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
  }, [navigate, rol, setUser]);

  const groupColors = [
    "#FFCDD2",
    "#F8BBD0",
    "#E1BEE7",
    "#D1C4E9",
    "#C5CAE9",
    "#BBDEFB",
    "#B2EBF2",
    "#C8E6C9",
  ];

  const tableColors = "#F5F5F5"; // Fondo para las tablas

  return (
    <Box sx={{ padding: 2 }}>
      {/* Confetti ajustado para seguir el scroll */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <Confetti width={dimensions.width} height={dimensions.height} />
      </Box>

      <Typography variant="h4" align="center" gutterBottom>
        Campeones de Futbol, Voley y Voley Mixto
      </Typography>

      {grupos.map((grupo, index) => (
        <Box
          key={grupo.grupo}
          sx={{
            marginBottom: 4,
            padding: 2,
            color: "black",
            backgroundColor: groupColors[index % groupColors.length],
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Grupo {grupo.grupo}
          </Typography>
          <TableContainer component={Paper}>
            <Table
              sx={{
                backgroundColor: tableColors,
                "& .MuiTableCell-root": { color: "#424242" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Posición</TableCell>
                  <TableCell>Jugadores</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Campeón</TableCell>
                  <TableCell>{grupo.campeon}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Subcampeón</TableCell>
                  <TableCell>{grupo.subcampeon}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tercer Puesto</TableCell>
                  <TableCell>{grupo.tercerPuesto}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Goleador</TableCell>
                  <TableCell>{grupo.goleador}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mejor Arquero</TableCell>
                  <TableCell>{grupo.mejorArquero}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* Tabla de Voley */}
      <Typography variant="h5" gutterBottom>
        Resultados de Voley
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table
          sx={{
            backgroundColor: tableColors,
            "& .MuiTableCell-root": { color: "#424242" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Posición</TableCell>
              <TableCell>Equipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Campeón</TableCell>
              <TableCell>{voley.campeon}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subcampeón</TableCell>
              <TableCell>{voley.subcampeon}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tercer Puesto</TableCell>
              <TableCell>{voley.tercerPuesto}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cuarto Puesto</TableCell>
              <TableCell>{voley.cuartoPuesto}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mejor Jugadora</TableCell>
              <TableCell>{voley.mejorJugadora}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tabla de Voley Mixto */}
      <Typography variant="h5" gutterBottom>
        Resultados de Voley Mixto
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{
            backgroundColor: tableColors,
            "& .MuiTableCell-root": { color: "#424242" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Posición</TableCell>
              <TableCell>Equipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Campeón</TableCell>
              <TableCell>{voleyMixto.campeon}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subcampeón</TableCell>
              <TableCell>{voleyMixto.subcampeon}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tercer Puesto</TableCell>
              <TableCell>{voleyMixto.tercerPuesto}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cuarto Puesto</TableCell>
              <TableCell>{voleyMixto.cuartoPuesto}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mejor Jugador</TableCell>
              <TableCell>{voleyMixto.mejorJugador}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
