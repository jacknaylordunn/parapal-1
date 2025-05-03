
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEncounter } from '../contexts/EncounterContext';
import { 
  Clock, 
  User, 
  Activity, 
  FileText, 
  BookOpen, 
  Share2, 
  Plus, 
  AlertCircle,
  Settings,
  Calculator,
  Heart,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { db, initializeDevData } from '../lib/db';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { guidelineCategories } from './Guidelines';

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
    <div className="flex flex-col">
      {/* Online/Offline status */}
      {!isOnline && (
        <div className="w-full mb-4 p-3 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-md flex items-center">
          <AlertCircle className="mr-2" />
          <span>You're currently offline. ParaPal will continue to function with limited capabilities.</span>
        </div>
      )}
      
      {/* Hero section */}
      <section className="bg-gradient-to-br from-nhs-blue to-nhs-dark-blue py-12 px-4 rounded-lg mb-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ParaPal
              </h1>
              <p className="text-xl text-nhs-pale-grey mb-6">
                Clinical decision support for paramedics at the point of care
              </p>
              <Button 
                onClick={() => navigate('/new-encounter')}
                disabled={isLoading || isInitializing}
                size="lg"
                className="bg-white hover:bg-nhs-pale-grey text-nhs-dark-blue font-bold py-3 px-6 rounded-lg shadow-lg text-lg flex items-center justify-center touch-target"
              >
                <Plus className="mr-2" size={24} />
                Start New Encounter
              </Button>
            </div>
            <div className="bg-white p-6 rounded-full shadow-lg h-40 w-40 flex items-center justify-center">
              <Stethoscope size={80} className="text-nhs-blue" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-nhs-dark-blue dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard 
            title="Clinical Guidelines" 
            icon={<BookOpen size={24} />} 
            onClick={() => navigate('/guidelines')}
            color="bg-nhs-blue"
          />
          <QuickActionCard 
            title="Calculators" 
            icon={<Calculator size={24} />} 
            onClick={() => navigate('/calculators')}
            color="bg-nhs-aqua-blue"
          />
          <QuickActionCard 
            title="My Profile" 
            icon={<User size={24} />} 
            onClick={() => navigate('/profile')}
            color="bg-nhs-purple"
          />
          <QuickActionCard 
            title="Settings" 
            icon={<Settings size={24} />} 
            onClick={() => navigate('/settings')}
            color="bg-nhs-dark-grey"
          />
        </div>
      </section>
      
      {/* Clinical Resources */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-nhs-dark-blue dark:text-white">Clinical Resources</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>JRCALC Guidelines</CardTitle>
            <CardDescription>Quick access to clinical guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {guidelineCategories.slice(0, 3).map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 -mx-4 rounded">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {category.guidelines.slice(0, 3).map((guideline) => (
                      <GuidelineLink 
                        key={guideline.id} 
                        title={guideline.title} 
                        onClick={() => navigate(`/guidelines/${category.id}/${guideline.id}`)}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/guidelines')}>
              View All Guidelines
            </Button>
          </CardFooter>
        </Card>
      </section>
      
      {/* Clinical Calculators */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-nhs-dark-blue dark:text-white">Clinical Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 text-nhs-red" />
                NEWS2 Score
              </CardTitle>
              <CardDescription>National Early Warning Score 2</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calculate deterioration risk based on vital signs.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full flex justify-between items-center" onClick={() => navigate('/calculators/news2')}>
                <span>Open Calculator</span>
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 text-nhs-blue" />
                GCS Calculator
              </CardTitle>
              <CardDescription>Glasgow Coma Scale</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Assess level of consciousness in a standardized way.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full flex justify-between items-center" onClick={() => navigate('/calculators/gcs')}>
                <span>Open Calculator</span>
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={() => navigate('/calculators')}>
            View All Calculators
          </Button>
        </div>
      </section>
      
      {/* Feature cards */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-nhs-dark-blue dark:text-white">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </section>
      
      {/* Loading indicator */}
      {(isLoading || isInitializing) && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nhs-blue"></div>
        </div>
      )}
      
      {/* Development notice */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto">
        <h3 className="font-bold">Development Version</h3>
        <p>This application is a prototype and not intended for clinical use.</p>
      </div>
    </div>
  );
};

// Quick Action Card component
const QuickActionCard = ({ title, icon, onClick, color = "bg-nhs-blue" }) => {
  return (
    <button 
      onClick={onClick} 
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4 flex flex-col items-center justify-center h-32 border border-gray-100 dark:border-gray-700"
    >
      <div className={`${color} text-white p-3 rounded-full mb-3`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</span>
    </button>
  );
};

// Guideline Link component 
const GuidelineLink = ({ title, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
    >
      <span>{title}</span>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
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
    <Card className="hover:shadow-md transition-shadow duration-200 h-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-full">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
