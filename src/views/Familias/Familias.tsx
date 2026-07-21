import { useState } from "react";
import "./Familias.css";

// Interfaces
interface Familia {
  id: string;
  descripcion: string;
  tipoIva: string;
  permiteNegativo: boolean;
}

// Datos de ejemplo (en el futuro vendrán de una API)
const initialData: Familia[] = [
  {
    id: "1",
    descripcion: "PERFILES",
    tipoIva: "Exento",
    permiteNegativo: false,
  },
  {
    id: "2",
    descripcion: "PERFILES",
    tipoIva: "Exento",
    permiteNegativo: false,
  },
  {
    id: "3",
    descripcion: "PERFILES",
    tipoIva: "Exento",
    permiteNegativo: false,
  },
  {
    id: "4",
    descripcion: "PERFILES",
    tipoIva: "Exento",
    permiteNegativo: false,
  },
  {
    id: "5",
    descripcion: "PERFILES",
    tipoIva: "Exento",
    permiteNegativo: false,
  },
  {
    id: "6",
    descripcion: "PERFILES",
    tipoIva: "Exento",
    permiteNegativo: false,
  },
];

const tipoIvaOptions = [
  "Exento",
  "Normal",
  "Normal con Recargo",
  "Intracomunitario",
  "Intracomunitario con Recargo",
  "Extranjero",
  "Aduanas",
];

function Familias() {
  const [activeTab, setActiveTab] = useState<"tabla" | "ficha">("tabla");
  const [familias, setFamilias] = useState<Familia[]>(initialData);
  const [filtro, setFiltro] = useState<string>("Todas las familias");

  const handleTipoIvaChange = (id: string, nuevoValor: string) => {
    setFamilias((prev) =>
      prev.map((fam) =>
        fam.id === id ? { ...fam, tipoIva: nuevoValor } : fam,
      ),
    );
  };

  const handlePermiteNegativoChange = (id: string, valor: boolean) => {
    setFamilias((prev) =>
      prev.map((fam) =>
        fam.id === id ? { ...fam, permiteNegativo: valor } : fam,
      ),
    );
  };

  return (
    <div className="familias-container">
      {/* Toolbar */}
      <div className="familias-toolbar">
        <div className="toolbar-left">
          <button className="btn-toolbar">
            <span className="btn-icon">+</span>
            NUEVA
          </button>
          <button className="btn-toolbar btn-danger">
            <span className="btn-icon">🗑</span>
            ELIMINAR
          </button>
          <button className="btn-toolbar btn-success">
            <span className="btn-icon">💾</span>
            GUARDAR
          </button>
        </div>
        <div className="toolbar-right">
          <span className="filter-label">FILTRAR:</span>
          <select
            className="filter-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option>Todas las familias</option>
            <option>PERFILES</option>
            <option>OTRAS</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="familias-tabs">
        <button
          className={`tab-button ${activeTab === "tabla" ? "active" : ""}`}
          onClick={() => setActiveTab("tabla")}
        >
          VISTA DE TABLA
        </button>
        <button
          className={`tab-button ${activeTab === "ficha" ? "active" : ""}`}
          onClick={() => setActiveTab("ficha")}
        >
          FICHA DE FAMILIA
        </button>
      </div>

      {/* Content */}
      <div className="familias-content">
        {activeTab === "tabla" ? (
          <div className="table-container">
            <table className="familias-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-descripcion">DESCRIPCIÓN DE FAMILIA</th>
                  <th className="col-iva">TIPO IVA</th>
                  <th className="col-negativo">PERMITE NEGATIVO</th>
                </tr>
              </thead>
              <tbody>
                {familias.map((familia) => (
                  <tr key={familia.id}>
                    <td>{familia.id}</td>
                    <td>{familia.descripcion}</td>
                    <td>
                      <select
                        className="iva-select"
                        value={familia.tipoIva}
                        onChange={(e) =>
                          handleTipoIvaChange(familia.id, e.target.value)
                        }
                      >
                        {tipoIvaOptions.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={familia.permiteNegativo}
                          onChange={(e) =>
                            handlePermiteNegativoChange(
                              familia.id,
                              e.target.checked,
                            )
                          }
                        />
                        <span
                          className={`checkbox-label ${familia.permiteNegativo ? "si" : "no"}`}
                        >
                          {familia.permiteNegativo ? "SÍ" : "NO"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ficha-container">
            <p>Vista de ficha - En desarrollo</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Familias;
