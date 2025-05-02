
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEncounter } from '../contexts/EncounterContext';
import { Clock, User, Activity, FileText, BookOpen, Share2, Plus, AlertCircle } from 'lucide-react';
import { db, initializeDevData } from '../lib/db';
import { useTheme } from '../contexts/ThemeContext';

const Index = () => {
  const { activeEncounter, isLoading } = useEncounter();
  const { theme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Initialize dev data
  useEffect(() => {
    const loadDevData = async () => {
      setIsInitializing(true);
      try {
        await initializeDevData();
      } catch (error) {
        console.error("Failed to initialize development data:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    loadDevData();
  }, []);
  
  // If we have an active encounter, redirect
  if (!isLoading && activeEncounter) {
    return <Navigate to={`/encounter/${activeEncounter.id}/patient`} replace />;
  }
  
  return (
    <div className="flex flex-col items-center">
      {/* Online/Offline status */}
      {!isOnline && (
        <div className="w-full mb-4 p-3 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-md flex items-center">
          <AlertCircle className="mr-2" />
          <span>You're currently offline. ParaPal will continue to function with limited capabilities.</span>
        </div>
      )}
      
      {/* App logo and title */}
      <div className="text-center mb-8 mt-8">
        <div className="bg-nhs-blue text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
          <span>P<span className="text-nhs-pale-grey">P</span></span>
        </div>
        <h1 className="text-4xl font-bold text-nhs-blue">ParaPal</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Paramedic Clinical Decision Support
        </p>
      </div>
      
      {/* Start New Encounter Button */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/new-encounter')}
          disabled={isLoading || isInitializing}
          className="bg-nhs-blue hover:bg-nhs-dark-blue text-white font-bold py-4 px-8 rounded-lg shadow-md text-xl flex items-center justify-center touch-target"
        >
          <Plus className="mr-3" size={24} />
          Start New Encounter
        </button>
      </div>
      
      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <FeatureCard 
          title="Patient Assessment"
          icon={<User size={32} className="text-nhs-blue" />}
          description="Record patient demographics and clinical observations"
          resolvedTheme={resolvedTheme}
        />
        <FeatureCard 
          title="Vital Signs"
          icon={<Activity size={32} className="text-nhs-blue" />}
          description="Track patient vitals and calculate NEWS2 scores"
          resolvedTheme={resolvedTheme}
        />
        <FeatureCard 
          title="Patient History"
          icon={<FileText size={32} className="text-nhs-blue" />}
          description="Document medical history, medications, and allergies"
          resolvedTheme={resolvedTheme}
        />
        <FeatureCard 
          title="Clinical Guidance"
          icon={<BookOpen size={32} className="text-nhs-blue" />}
          description="Access JRCALC guidelines and clinical tools"
          resolvedTheme={resolvedTheme}
        />
        <FeatureCard 
          title="Handover"
          icon={<Share2 size={32} className="text-nhs-blue" />}
          description="Generate ATMIST handover reports"
          resolvedTheme={resolvedTheme}
        />
        <FeatureCard 
          title="Time Tracking"
          icon={<Clock size={32} className="text-nhs-blue" />}
          description="Automatically log timestamps for documentation"
          resolvedTheme={resolvedTheme}
        />
      </div>
      
      {/* Loading indicator */}
      {(isLoading || isInitializing) && (
        <div className="mt-4 text-gray-600">Loading...</div>
      )}
      
      {/* Development notice */}
      <div className="mt-12 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto">
        <h3 className="font-bold">Development Version</h3>
        <p>This application is a prototype and not intended for clinical use.</p>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  title, 
  icon, 
  description, 
  resolvedTheme 
}: { 
  title: string, 
  icon: React.ReactNode, 
  description: string,
  resolvedTheme: 'dark' | 'light'
}) => {
  return (
    <div className="clinical-card flex flex-col items-center p-6 text-center">
      <div className="mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default Index;
