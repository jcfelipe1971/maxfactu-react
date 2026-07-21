import Sidebar from "../components/Sidebar";
import AppContent from "../components/AppContent";

export default function DefaultLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f6fa" }}>
        <AppContent />
      </div>
    </div>
  );
}
