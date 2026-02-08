import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { useFixturePage } from "../hooks/useFixture.hook";

function FormFixture() {
  const {
    emparejamiento,
    deporteSelect,
    deportes,
    numeroFechaJugados,
    selectGrupo,
    campoSelect,
    fecha,
    setFecha,
    grupos,
    campos,
    handleChangeEmparejamiento,
    selectDeporte,
    handleChangeSelectGrupo,
    handleChangeSelectCampo,
    setNumeroFechaJugados,
    handleGeneratePartido,
    handleSavePartido,
    handleChangeEquipo1,
    handleChangeEquipo2,
    equipo1,
    equipo2,
    promocionesFiltradas,
  } = useFixturePage();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setFecha(new Date(value));
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="text-3xl font-bold text-center mb-6">Generar partidos</h4>
      <div className="max-w-2xl mx-auto border bg-[#002200] text-white p-6 rounded-lg space-y-6">
        {/* Primera fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <RadioGroup
            defaultValue="automatico"
            value={emparejamiento}
            onValueChange={(value: string) =>
              handleChangeEmparejamiento({
                target: { value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="automatico"
                id="automatico"
                className="bg-white border-white text-[#002200]"
              />
              <Label htmlFor="automatico" className="text-white">
                Automático
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="manual"
                id="manual"
                className="bg-white border-white text-[#002200]"
              />
              <Label htmlFor="manual" className="text-white">
                Manual
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label className="text-white">Deporte</Label>
            <Select
              value={deporteSelect ? deporteSelect.toString() : "0"}
              onValueChange={(value) => selectDeporte(Number(value))}
            >
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Seleccione deporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>
                  Seleccione deporte
                </SelectItem>
                {deportes.map(({ id, nombre_tipo }) => (
                  <SelectItem
                    key={id ?? Math.random()}
                    value={id?.toString() ?? "0"}
                  >
                    {nombre_tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Grupo</Label>
            <Select
              value={selectGrupo ? selectGrupo.toString() : "0"}
              onValueChange={(value) =>
                handleChangeSelectGrupo({
                  target: { value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Seleccionar Grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>
                  Seleccionar Grupo
                </SelectItem>
                {grupos.map(({ id, nombre_grupo }) => (
                  <SelectItem key={id} value={id.toString()}>
                    {nombre_grupo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Campo</Label>
            <Select
              value={campoSelect ? campoSelect.toString() : "0"}
              onValueChange={(value) =>
                handleChangeSelectCampo({
                  target: { value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Seleccionar Campo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>
                  Seleccionar Campo
                </SelectItem>
                {campos.map(({ id_campo, nombre_campo }) => (
                  <SelectItem key={id_campo} value={id_campo.toString()}>
                    {nombre_campo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">
              Fecha y Hora del primer partido
            </Label>
            <Input
              type="datetime-local"
              value={fecha ? format(fecha, "yyyy-MM-dd'T'HH:mm") : ""}
              onChange={handleDateChange}
              className="bg-white text-black"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Número de Fechas Jugadas</Label>
            <Input
              type="number"
              value={numeroFechaJugados}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  setNumeroFechaJugados(value);
                }
              }}
              className="bg-white text-black"
            />
          </div>
        </div>

        {/* Nuevo: Selects para emparejamiento manual */}
        {emparejamiento === "manual" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Equipo 1</Label>
              <Select
                value={equipo1 || ""}
                onValueChange={(value) =>
                  handleChangeEquipo1({
                    target: { value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              >
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Seleccionar Equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" disabled>
                    Seleccionar Equipo
                  </SelectItem>
                  {promocionesFiltradas.map(({ id, nombre_promocion }) => (
                    <SelectItem key={id} value={nombre_promocion}>
                      {nombre_promocion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Equipo 2</Label>
              <Select
                value={equipo2 || ""}
                onValueChange={(value) =>
                  handleChangeEquipo2({
                    target: { value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              >
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Seleccionar Equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" disabled>
                    Seleccionar Equipo
                  </SelectItem>
                  {promocionesFiltradas.map(({ id, nombre_promocion }) => (
                    <SelectItem key={id} value={nombre_promocion}>
                      {nombre_promocion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={() => handleGeneratePartido()}
            disabled={!selectGrupo}
            variant="secondary"
          >
            Generar partido
          </Button>
          <Button
            onClick={handleSavePartido}
            disabled={!selectGrupo}
            variant="secondary"
          >
            Guardar fixture
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormFixture;
