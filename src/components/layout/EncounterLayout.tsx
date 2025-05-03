import { Outlet, NavLink, useParams, Link, useNavigate } from "react-router-dom";
import { User, Activity, FileText, BookOpen, Share2, Home, X, Clock, ChevronLeft, Menu, Settings, Save, Trash2 } from "lucide-react";
import { useEncounter } from "../../contexts/EncounterContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
const EncounterLayout = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    activeEncounter,
    endEncounter,
    deleteEncounter,
    refreshEncounter
  } = useEncounter();
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showEndEncounterDialog, setShowEndEncounterDialog] = useState(false);
  const [showDeleteEncounterDialog, setShowDeleteEncounterDialog] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  // Refresh encounter data periodically to get latest patient info
  useEffect(() => {
    const updateInterval = setInterval(() => {
      refreshEncounter();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(updateInterval);
  }, [refreshEncounter]);

  // Calculate elapsed time since encounter started
  useEffect(() => {
    if (!activeEncounter?.startTime) return;
    const startTime = new Date(activeEncounter.startTime).getTime();
    const updateElapsedTime = () => {
      const now = new Date().getTime();
      const elapsed = now - startTime;

      // Format as HH:MM:SS
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor(elapsed % 3600000 / 60000).toString().padStart(2, '0');
      const seconds = Math.floor(elapsed % 60000 / 1000).toString().padStart(2, '0');
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    };
    updateElapsedTime();
    const timerId = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(timerId);
  }, [activeEncounter?.startTime]);

  // Navigation items for the encounter
  const navItems = [{
    to: `/encounter/${id}/patient`,
    icon: <User size={20} />,
    label: "Patient"
  }, {
    to: `/encounter/${id}/vitals`,
    icon: <Activity size={20} />,
    label: "Vitals"
  }, {
    to: `/encounter/${id}/history`,
    icon: <FileText size={20} />,
    label: "History"
  }, {
    to: `/encounter/${id}/guidance`,
    icon: <BookOpen size={20} />,
    label: "Guidance"
  }, {
    to: `/encounter/${id}/handover`,
    icon: <Share2 size={20} />,
    label: "Handover"
  }];

  // Function to get patient name from encounter
  const getPatientName = () => {
    if (!activeEncounter || !activeEncounter.patientDetails) {
      return "Unknown Patient";
    }
    const {
      firstName,
      lastName
    } = activeEncounter.patientDetails;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (activeEncounter.isUnknownPatient) {
      return "Unknown Patient";
    } else {
      return "New Patient";
    }
  };

  // Handle return to dashboard with encounter kept active
  const handleReturnToDashboard = () => {
    navigate('/');
    toast({
      title: "Encounter Saved",
      description: "Your encounter is still active and can be resumed at any time."
    });
  };

  // Handle end encounter with confirmation dialog
  const handleEndEncounterClick = () => {
    setShowEndEncounterDialog(true);
  };

  // Handle delete encounter with confirmation dialog
  const handleDeleteEncounterClick = () => {
    setShowDeleteEncounterDialog(true);
  };
  const confirmEndEncounter = async () => {
    try {
      await endEncounter();
      toast({
        title: "Encounter Closed",
        description: "The patient encounter has been successfully saved and closed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close the encounter. Please try again.",
        variant: "destructive"
      });
    }
  };
  const confirmDeleteEncounter = async () => {
    try {
      await deleteEncounter();
      toast({
        title: "Encounter Deleted",
        description: "The patient encounter has been deleted."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the encounter. Please try again.",
        variant: "destructive"
      });
    }
  };
  const SidebarContent = () => <div className="flex flex-col h-full">
      {/* Timer display */}
      <div className="text-center mb-4 font-mono p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex justify-center items-center">
        <Clock size={18} className="mr-2 text-nhs-blue dark:text-nhs-light-blue" />
        <span className="font-semibold">{elapsedTime}</span>
      </div>
      
      {/* Patient info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Patient</h3>
        <p className="font-semibold text-lg truncate">{getPatientName()}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Incident: {activeEncounter?.incidentNumber || 'Not Assigned'}
        </p>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-1 flex-1 mb-4">
        <Link to="/" onClick={handleReturnToDashboard} className="flex items-center p-2 rounded-md text-nhs-blue dark:text-nhs-light-blue hover:bg-gray-100 dark:hover:bg-gray-700">
          <Home size={20} className="mr-3" /> Return to Dashboard
        </Link>
        
        <hr className="my-2 border-gray-200 dark:border-gray-700" />
        
        {navItems.map(item => <NavLink key={item.to} to={item.to} onClick={() => setIsMobileSidebarOpen(false)} className={({
        isActive
      }) => `flex items-center p-2 rounded-md ${isActive ? 'bg-nhs-blue dark:bg-nhs-dark-blue text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <span className="w-7">{item.icon}</span>
            <span className="ml-2">{item.label}</span>
          </NavLink>)}
      </nav>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <Button onClick={handleEndEncounterClick} variant="outline" className="w-full flex items-center justify-center">
          <Save size={18} className="mr-2" /> Save & Close Encounter
        </Button>
        
        <Button onClick={handleDeleteEncounterClick} variant="destructive" className="w-full flex items-center justify-center">
          <Trash2 size={18} className="mr-2" /> Delete Encounter
        </Button>
      </div>
    </div>;
  return <div className="container mx-auto px-4 py-4">
      {/* Top navigation bar - visible on all devices */}
      <div className="flex justify-between items-center mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[270px] sm:w-[300px] p-4">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Back to dashboard button - visible on all devices */}
        <Link to="/" onClick={handleReturnToDashboard} className="flex items-center text-nhs-blue">
          
          
          <span className="sm:hidden">Dashboard</span>
        </Link>

        {/* Current section indicator */}
        <div className="flex items-center">
          <span className="font-medium">Patient Encounter</span>
          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            Active
          </span>
        </div>

        {/* Timer - visible on mobile */}
        <div className="flex md:hidden items-center font-mono text-sm">
          <Clock size={16} className="mr-1 text-nhs-blue" />
          <span>{elapsedTime.substring(0, 5)}</span>
        </div>
      </div>

      {/* Main content area with sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
          <SidebarContent />
        </aside>
        
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <Outlet />
        </div>
      </div>

      {/* End Encounter Dialog */}
      <AlertDialog open={showEndEncounterDialog} onOpenChange={setShowEndEncounterDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Patient Encounter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save and close this patient encounter? 
              This will complete the documentation and make it available in the records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndEncounter} className="bg-nhs-blue hover:bg-nhs-dark-blue">
              Save & Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Encounter Dialog */}
      <AlertDialog open={showDeleteEncounterDialog} onOpenChange={setShowDeleteEncounterDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient Encounter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this patient encounter? 
              This action cannot be undone and all data will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEncounter} className="bg-destructive hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default EncounterLayout;