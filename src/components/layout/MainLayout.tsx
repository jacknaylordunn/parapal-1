
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useEncounter } from "../../contexts/EncounterContext";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeEncounter, isLoading } = useEncounter();
  const { theme, toggleTheme } = useTheme();
  
  // Redirect to active encounter or home depending on the path and active encounter
  useEffect(() => {
    if (!isLoading) {
      const isRootPath = location.pathname === '/';
      const isEncounterPath = location.pathname.startsWith('/encounter/');
      
      if (activeEncounter && isRootPath) {
        // If we have an active encounter and we're at the root, redirect to the encounter
        navigate(`/encounter/${activeEncounter.id}/patient`);
      } else if (!activeEncounter && isEncounterPath) {
        // If we don't have an active encounter but we're on an encounter path, redirect home
        navigate('/');
      }
    }
  }, [activeEncounter, isLoading, location.pathname, navigate]);
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-nhs-blue text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">ParaPal</h1>
          {activeEncounter && (
            <span className="bg-white text-nhs-blue rounded-full px-3 py-1 text-sm font-bold">
              {activeEncounter.incidentNumber}
            </span>
          )}
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-nhs-dark-blue transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-nhs-dark-blue text-white p-3 text-center text-sm">
        <p>ParaPal Clinical Decision Support (DEVELOPMENT VERSION - NOT FOR CLINICAL USE)</p>
      </footer>
    </div>
  );
};

export default MainLayout;
