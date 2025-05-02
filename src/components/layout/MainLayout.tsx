
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useEncounter } from "../../contexts/EncounterContext";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeEncounter, isLoading } = useEncounter();
  const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();
  
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
  
  // Get the icon based on current theme setting
  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={24} />;
      case 'dark': return <Moon size={24} />;
      case 'system': return <Laptop size={24} />;
    }
  };
  
  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="bg-nhs-blue dark:bg-nhs-dark-blue text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">ParaPal</h1>
          {activeEncounter && (
            <span className="bg-white text-nhs-blue dark:bg-nhs-dark-blue dark:text-white rounded-full px-3 py-1 text-sm font-bold border dark:border-white">
              {activeEncounter.incidentNumber}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* Theme dropdown */}
          <div className="relative group">
            <button 
              className="p-2 rounded-full hover:bg-nhs-dark-blue dark:hover:bg-nhs-blue transition-colors"
              aria-label="Theme settings"
            >
              {getThemeIcon()}
            </button>
            
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => setTheme('light')}
                  className={`${theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''} flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left`}
                >
                  <Sun size={16} className="mr-2" /> Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''} flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left`}
                >
                  <Moon size={16} className="mr-2" /> Dark
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`${theme === 'system' ? 'bg-gray-100 dark:bg-gray-700' : ''} flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left`}
                >
                  <Laptop size={16} className="mr-2" /> System
                </button>
              </div>
            </div>
          </div>
          
          {/* Simple toggle button */}
          <button 
            onClick={toggleTheme} 
            className="ml-2 p-2 rounded-full hover:bg-nhs-dark-blue dark:hover:bg-nhs-blue transition-colors"
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolvedTheme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-nhs-dark-blue dark:bg-gray-800 text-white p-3 text-center text-sm">
        <p>ParaPal Clinical Decision Support (DEVELOPMENT VERSION - NOT FOR CLINICAL USE)</p>
      </footer>
    </div>
  );
};

export default MainLayout;
