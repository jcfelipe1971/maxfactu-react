import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import UnderConstruction from './views/UnderConstruction/UnderConstruction';
import Familias from './views/Familias/Familias';
import './App.css';

function App() {
  const [selectedItem, setSelectedItem] = useState('familias');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 👈 Nuevo estado para controlar el menú

  const handleSelectItem = (id: string) => {
    setSelectedItem(id);
  };

  const handleToggleSidebar = () => { // 👈 Función para alternar visibilidad
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'familias':
        return <Familias />;
      case 'articulos':
        return <UnderConstruction />;
      case 'tarifas':
        return <UnderConstruction />;
      case 'tipos-calculos':
        return <UnderConstruction />;
      case 'nueva-venta':
        return <UnderConstruction />;
      case 'historial':
        return <UnderConstruction />;
      case 'reportes':
        return <UnderConstruction />;
      default:
        return <UnderConstruction />;
    }
  };

  return (
    <div className="app">
      {/* 👈 Pasamos la función al Header */}
      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div className="app-content">
        {/* 👈 Pasamos el estado isOpen al Sidebar */}
        <Sidebar 
          selectedItem={selectedItem} 
          onSelectItem={handleSelectItem} 
          isOpen={isSidebarOpen} 
        />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;