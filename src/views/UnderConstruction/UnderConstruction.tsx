import { LayoutGrid } from "lucide-react";
import "./UnderConstruction.css";

interface UnderConstructionProps {
  moduleName?: string;
}

function UnderConstruction({
  moduleName = "esta sección",
}: UnderConstructionProps) {
  return (
    <div className="construction-view">
      <div className="construction-icon">
        <LayoutGrid size={48} />
      </div>
      <h2>Vista en construcción</h2>
      <p>
        La pantalla de <strong>{moduleName}</strong> estará disponible
        próximamente en esta migración.
      </p>
    </div>
  );
}

export default UnderConstruction;
