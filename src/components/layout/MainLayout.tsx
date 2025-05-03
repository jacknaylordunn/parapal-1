
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useEncounter } from "../../contexts/EncounterContext";
import { ChevronLeft, User, LogOut, Menu } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeEncounter, isLoading } = useEncounter();
  const { user, signOut } = useAuth();
  
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
            <div className="ml-2">
              <span className="bg-white text-nhs-blue dark:bg-nhs-dark-blue dark:text-white rounded-full px-3 py-1 text-xs md:text-sm font-bold border dark:border-white truncate max-w-[120px] md:max-w-none">
                {activeEncounter.incidentNumber}
              </span>
            </div>
          )}
        </div>
        
        {/* User menu */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-nhs-dark-blue dark:hover:bg-nhs-blue">
                <User size={20} className="text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-gray-500 truncate">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate('/auth/signin')}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign in</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
