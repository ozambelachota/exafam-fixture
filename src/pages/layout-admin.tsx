import NavbarAdmin from "../components/navbar-admin";

type props = {
  children?: React.ReactNode;
};

const LayoutAdmin = ({ children }: props) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col md:flex-row">
      <NavbarAdmin />
      <main className="flex-1 w-full bg-slate-900">
        <div className="container mx-auto p-4 md:p-8 pt-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutAdmin;
