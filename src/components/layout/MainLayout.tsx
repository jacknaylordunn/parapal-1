
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Home, UserRound, BookText, Calculator, Settings as SettingsIcon, Sun, Moon, Stethoscope, ChevronsUpDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useEncounter } from '@/contexts/EncounterContext';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const { activeEncounter } = useEncounter();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    if (menuOpen) setMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // NavLink component with active state
  const NavLink = ({ 
    to, 
    label, 
    icon
  }: { 
    to: string, 
    label: string, 
    icon: React.ReactNode 
  }) => {
    const active = isActive(to);
    
    return (
      <Link
        to={to}
        className={`
          flex items-center px-4 py-3 rounded-md transition-colors
          ${active 
            ? 'bg-nhs-blue text-white' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        onClick={closeMenu}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-40 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={toggleMenu} aria-label="Toggle menu" className="p-2 rounded-md">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="ml-2 flex items-center">
            <Stethoscope size={24} className="text-nhs-blue mr-2" />
            <span className="font-bold text-xl">ParaPal</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <div 
        className={`
          fixed md:static top-16 left-0 h-[calc(100vh-64px)] md:h-screen w-64 bg-white dark:bg-gray-800
          transform transition-transform duration-300 z-30 overflow-y-auto
          md:transform-none shadow-lg md:shadow-none
          ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <Stethoscope size={24} className="text-nhs-blue mr-2" />
            <span className="font-bold text-xl">ParaPal</span>
          </Link>
        </div>
        
        <div className="p-4 space-y-1">
          <NavLink to="/" label="Home" icon={<Home size={20} />} />
          <NavLink to="/guidelines" label="Guidelines" icon={<BookText size={20} />} />
          <NavLink to="/calculators" label="Calculators" icon={<Calculator size={20} />} />
          <NavLink to="/profile" label="Profile" icon={<UserRound size={20} />} />
          <NavLink to="/settings" label="Settings" icon={<SettingsIcon size={20} />} />
        </div>

        {activeEncounter && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Current Encounter</h3>
            <Link 
              to={`/encounter/${activeEncounter.id}/patient`}
              className="flex items-center justify-between p-3 bg-nhs-blue bg-opacity-10 text-nhs-blue rounded-md hover:bg-opacity-20 transition-colors"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Stethoscope size={18} className="mr-2" />
                <div className="text-sm">
                  <span className="block font-medium">Return to Active Encounter</span>
                  <span className="block text-xs opacity-80">
                    {activeEncounter.patientDetails?.firstName || 'Unknown'} {activeEncounter.patientDetails?.lastName || 'Patient'}
                  </span>
                </div>
              </div>
              <ChevronsUpDown size={16} />
            </Link>
          </div>
        )}
        
        {isMobile && (
          <div className="p-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {resolvedTheme === 'dark' ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
              {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-0">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white dark:bg-gray-800 shadow-sm items-center justify-end px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </header>
        
        {/* Content */}
        <main className="pt-20 md:pt-4 px-4 md:px-6 pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
