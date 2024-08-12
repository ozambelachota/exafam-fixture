import { ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import es from "date-fns/locale/es";
import { useEffect } from "react";
import FixtureRoutes from "./routes/fixture.routes";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {}, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <ThemeProvider theme={darkTheme}>
            <FixtureRoutes />
          </ThemeProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
