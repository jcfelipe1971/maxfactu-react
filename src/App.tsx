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

  const renderContent = () => {
    switch (selectedItem) {
      case 'familias':
        return <Familias />;
      case 'articulos':
      case 'tarifas':
      case 'tipos-calculos':
      case 'nueva-venta':
      case 'historial':
      case 'reportes':
        return <UnderConstruction />;
      default:
        return <UnderConstruction />;
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Sidebar selectedItem={selectedItem} onSelectItem={handleSelectItem} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;