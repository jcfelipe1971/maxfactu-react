import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import UnderConstruction from './views/UnderConstruction/UnderConstruction';
import Familias from './views/Familias/Familias';
import './App.css';

function App() {
  const [selectedItem, setSelectedItem] = useState('familias');

  const handleSelectItem = (id: string) => {
    setSelectedItem(id);
  };

  // Renderizar la vista según el item seleccionado
  const renderContent = () => {
    switch (selectedItem) {
      case 'familias':
        return <Familias />;
      case 'articulos':
        return <UnderConstruction moduleName="Artículos (Almacenes)" />;
      case 'tarifas':
        return <UnderConstruction moduleName="Tarifas" />;
      case 'tipos-calculos':
        return <UnderConstruction moduleName="Tipos de cálculos" />;
      case 'nueva-venta':
        return <UnderConstruction moduleName="Nueva venta" />;
      case 'historial':
        return <UnderConstruction moduleName="Historial de ventas" />;
      case 'reportes':
        return <UnderConstruction moduleName="Reportes" />;
      default:
        return <UnderConstruction moduleName={selectedItem} />;
    }
  };

  return (
    <div className="app-layout">
      <Header />
      <Sidebar selectedItem={selectedItem} onSelectItem={handleSelectItem} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;