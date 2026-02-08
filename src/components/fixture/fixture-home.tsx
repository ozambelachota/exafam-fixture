import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TableFixtureAdmin } from "./table-fixture-admin";
import { Plus } from "lucide-react";

function FixtureHome() {
  return (
    <div className="space-y-6">
      <h4 className="text-2xl font-bold text-center">Fixture</h4>
      <div className="flex justify-center">
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/admin/fixture/create">
            <Plus className="mr-2 h-4 w-4" /> Crear Fixture
          </Link>
        </Button>
      </div>
      <div>
        <TableFixtureAdmin />
      </div>
    </div>
  );
}

export default FixtureHome;
