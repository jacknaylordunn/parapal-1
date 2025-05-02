
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useEncounter } from "../../contexts/EncounterContext";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeEncounter, isLoading } = useEncounter();
  
  // Check if we're on a subpage that needs a back button
  const showBackButton = () => {
    // Don't show back button on main pages
    if (location.pathname === '/' || 
        location.pathname === '/guidelines' || 
        location.pathname === '/calculators' ||
        location.pathname === '/profile' ||
        location.pathname === '/settings' ||
        location.pathname === '/new-encounter') {
      return false;
    }
    return true;
  };
  
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
    <div className="min-h-screen dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="bg-nhs-blue dark:bg-nhs-dark-blue text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {showBackButton() && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2 hover:bg-nhs-dark-blue dark:hover:bg-nhs-blue transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </Button>
          )}
          <h1 
            className="text-2xl font-bold cursor-pointer hover:underline" 
            onClick={() => navigate('/')}
            role="link"
            aria-label="Go to home page"
          >
            ParaPal
          </h1>
          {activeEncounter && (
            <span className="bg-white text-nhs-blue dark:bg-nhs-dark-blue dark:text-white rounded-full px-3 py-1 text-sm font-bold border dark:border-white">
              {activeEncounter.incidentNumber}
            </span>
          )}
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
