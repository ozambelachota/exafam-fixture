import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Convertir las importaciones a React.lazy
const FormEditSaancionComponent = lazy(
  () => import("../components/edit-form-sancion.component"),
);
const FixtureCreate = lazy(
  () => import("../components/fixture/fixture-create"),
);
const ResultFixtureFormPage = lazy(
  () => import("../components/fixture/result-fixture-form"),
);
const FormPromocionParticipante = lazy(
  () => import("../components/form-promocion-participante"),
);
const EditjugadorComponent = lazy(
  () => import("../components/nomina/edit-jugador.component"),
);
const TablaFixture = lazy(() => import("../components/tabla-fixture"));
const GolPage = lazy(() => import("../pages/Gol.page"));
const Admin = lazy(() => import("../pages/admin"));
const FixturePage = lazy(() =>
  import("../pages/fixture").then((module) => ({
    default: module.FixturePage,
  })),
);
const SancionPage = lazy(() => import("../pages/gol-sancion"));
const Home = lazy(() => import("../pages/home"));
const Layout = lazy(() => import("../pages/layout"));
const LayoutAdmin = lazy(() => import("../pages/layout-admin"));
const Login = lazy(() => import("../pages/login"));
const NominaPage = lazy(() => import("../pages/nomina"));
const Promocion = lazy(() => import("../pages/promocion"));
const RegisterPromocion = lazy(() =>
  import("../pages/register-promocion").then((module) => ({
    default: module.RegisterPromocion,
  })),
);
const ResultPage = lazy(() => import("../pages/resultado"));
const Sancion = lazy(() => import("../pages/sancion"));
const TablaPosicionPage = lazy(() => import("../pages/tabla-posicion"));
const GrupoPosicionComponents = lazy(
  () => import("../pages/tabla-posicion/grupo-posicion.component"),
);
const PosicionEditPage = lazy(
  () => import("../pages/tabla-posicion/posicion-edit-promocion"),
);
const TablaEditPosicionPage = lazy(
  () => import("../pages/tabla-posicion/tabla-edit.page"),
);
const VoleyPage = lazy(() => import("../pages/voley"));
const TablaVoleyPage = lazy(() =>
  import("../pages/voley-posicion/voley-tabla.page").then((module) => ({
    default: module.TablaVoleyPage,
  })),
);
const ProtectedRouter = lazy(() => import("./protected.routes"));
const EditedPartido = lazy(() =>
  import("../pages/partido/edit-partido.page").then((module) => ({
    default: module.EditedPartido,
  })),
);
const RoutePublic = () => {
  return (
    <Suspense
      fallback={
        <div className="h-dvh w-dvw flex justify-center items-center bg-fuchsia-950">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      }
    >
      <Layout>
        <Routes>
          <Route path="/resultado" element={<ResultPage />} />
          <Route path="/posicion" element={<TablaPosicionPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/voley" element={<VoleyPage />} />
          <Route path="/sancion" element={<SancionPage />} />
          <Route path="/goles" element={<GolPage />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </Layout>
    </Suspense>
  );
};

const RouterPrivate = () => {
  return (
    <Suspense
      fallback={
        <div className="w-dvw h-dvh flex justify-center items-center bg-fuchsia-950">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        </div>
      }
    >
      <LayoutAdmin>
        <Routes>
          <Route element={<ProtectedRouter />}>
            <Route path="home" element={<Admin />} />
            <Route path="registrar-fixture" element={<FixturePage />} />
            <Route path="registrar-promociones" element={<Promocion />} />
            <Route
              path="registrar-promociones/create/:id"
              element={<RegisterPromocion />}
            />
            <Route path="partido/:id" element={<EditedPartido />} />
            <Route path="fixture/create" element={<FixtureCreate />} />
            <Route
              path="promocion/create"
              element={<FormPromocionParticipante />}
            />
            <Route path="nomina/:id" element={<NominaPage />} />
            <Route path="nomina/edit/:id" element={<EditjugadorComponent />} />
            <Route
              path="result-fixture/:id"
              element={<ResultFixtureFormPage />}
            />
            <Route path="sancion/create" element={<Sancion />} />
            <Route path="sancion" element={<Sancion />} />
            <Route
              path="sancion/edit/:id"
              element={<FormEditSaancionComponent />}
            />
            <Route
              path="posicionar-promocion"
              element={<TablaEditPosicionPage />}
            />
            <Route
              path="ver-posicion/promocion/grupo/:id"
              element={<GrupoPosicionComponents />}
            />
            <Route path="voley/:deporte" element={<TablaVoleyPage />} />
            <Route
              path="posicion/edit/grupo/:id"
              element={<PosicionEditPage />}
            />
            <Route path="home" element={<TablaFixture />} />
          </Route>
        </Routes>
      </LayoutAdmin>
    </Suspense>
  );
};

const FixtureRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <Routes>
        <Route path="*" element={<RoutePublic />} />
        <Route path="admin/*" element={<RouterPrivate />} />
      </Routes>
    </Suspense>
  );
};

export default FixtureRoutes;
