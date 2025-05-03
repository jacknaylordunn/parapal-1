
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
      <header className="sticky top-0 z-50 bg-nhs-blue dark:bg-nhs-dark-blue text-white p-3 md:p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2 overflow-hidden">
          {showBackButton() && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-1 hover:bg-nhs-dark-blue dark:hover:bg-nhs-blue transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </Button>
          )}
          <h1 
            className="text-lg md:text-2xl font-bold cursor-pointer hover:underline whitespace-nowrap" 
            onClick={() => navigate('/')}
            role="link"
            aria-label="Go to home page"
          >
            ParaPal
          </h1>
          {activeEncounter && activeEncounter.incidentNumber && (
            <span className="bg-white text-nhs-blue dark:bg-nhs-dark-blue dark:text-white rounded-full px-2 py-0.5 text-xs md:text-sm font-bold border dark:border-white truncate max-w-[120px] md:max-w-none">
              {activeEncounter.incidentNumber}
            </span>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="mx-auto px-3 md:container md:px-4 pb-16 pt-4">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-nhs-dark-blue dark:bg-gray-800 text-white p-2 text-center text-xs z-40">
        <p className="truncate">ParaPal Clinical Decision Support (DEVELOPMENT VERSION - NOT FOR CLINICAL USE)</p>
      </footer>
    </div>
  );
};

export default MainLayout;
