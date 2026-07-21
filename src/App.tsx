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

 // ✅ Renderizar la vista según el item seleccionado
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