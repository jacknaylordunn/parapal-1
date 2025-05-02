
import { Outlet, NavLink, useParams } from "react-router-dom";
import { 
  User,
  Activity,
  FileText,
  BookOpen,
  Share2,
  Home,
  X,
  Clock
} from "lucide-react";
import { useEncounter } from "../../contexts/EncounterContext";
import { useState, useEffect } from "react";

const EncounterLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { activeEncounter, endEncounter } = useEncounter();
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  
  // Calculate elapsed time since encounter started
  useEffect(() => {
    if (!activeEncounter?.startTime) return;
    
    const startTime = new Date(activeEncounter.startTime).getTime();
    
    const updateElapsedTime = () => {
      const now = new Date().getTime();
      const elapsed = now - startTime;
      
      // Format as HH:MM:SS
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateElapsedTime();
    const timerId = setInterval(updateElapsedTime, 1000);
    
    return () => clearInterval(timerId);
  }, [activeEncounter?.startTime]);
  
  // Handle end encounter (with confirmation)
  const handleEndEncounter = () => {
    const confirmed = window.confirm('Are you sure you want to end this encounter?');
    if (confirmed) {
      endEncounter();
    }
  };
  
  // Navigation items for the encounter
  const navItems = [
    { to: `/encounter/${id}/patient`, icon: <User size={24} />, label: "Patient" },
    { to: `/encounter/${id}/vitals`, icon: <Activity size={24} />, label: "Vitals" },
    { to: `/encounter/${id}/history`, icon: <FileText size={24} />, label: "History" },
    { to: `/encounter/${id}/guidance`, icon: <BookOpen size={24} />, label: "Guidance" },
    { to: `/encounter/${id}/handover`, icon: <Share2 size={24} />, label: "Handover" }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
      {/* Sidebar/Bottom Navigation */}
      <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
        {/* Timer display */}
        <div className="text-center mb-4 font-mono p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex justify-center items-center">
          <Clock size={18} className="mr-2 text-nhs-blue" />
          <span className="font-semibold">{elapsedTime}</span>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2 mb-4">
          <NavLink 
            to="/" 
            className="encounter-nav-item text-nhs-blue hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Home size={24} className="mr-2" /> Dashboard
          </NavLink>
          
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `encounter-nav-item ${isActive ? 'active' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
              }
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleEndEncounter}
            className="w-full flex items-center justify-center px-4 py-2 bg-nhs-red hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
          >
            <X size={18} className="mr-2" /> End Encounter
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default EncounterLayout;
