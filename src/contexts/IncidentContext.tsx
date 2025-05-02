
import { createContext, useContext, useEffect, useState } from 'react';
import { PatientEncounter, db } from '../lib/db';
import { useNavigate } from 'react-router-dom';

type IncidentContextType = {
  activeIncident: PatientEncounter | null;
  isLoading: boolean;
  error: Error | null;
  createNewIncident: (incidentNumber: string, callType: string) => Promise<number>;
  endIncident: () => Promise<void>;
  deleteIncident: () => Promise<void>;
  refreshIncident: () => Promise<void>;
};

const IncidentContext = createContext<IncidentContextType>({
  activeIncident: null,
  isLoading: true,
  error: null,
  createNewIncident: async () => { throw new Error('Not implemented'); },
  endIncident: async () => { throw new Error('Not implemented'); },
  deleteIncident: async () => { throw new Error('Not implemented'); },
  refreshIncident: async () => { throw new Error('Not implemented'); }
});

export const IncidentProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeIncident, setActiveIncident] = useState<PatientEncounter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  
  // Load the active incident on mount
  useEffect(() => {
    loadActiveIncident();
  }, []);
  
  // Load the active incident from the database
  const loadActiveIncident = async () => {
    setIsLoading(true);
    try {
      const incident = await db.getActiveEncounter();
      setActiveIncident(incident || null);
    } catch (err) {
      console.error("Failed to load active incident:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new incident
  const createNewIncident = async (incidentNumber: string, callType: string): Promise<number> => {
    try {
      // End any existing active incidents first
      if (activeIncident) {
        await endIncident();
      }
      
      // Create new incident
      const newIncidentId = await db.encounters.add({
        incidentNumber,
        callType,
        status: 'active',
        startTime: new Date(),
        lastUpdated: new Date()
      });
      
      // Log the event
      await db.logIncident(newIncidentId, 'Incident Started', `Incident: ${incidentNumber}, Type: ${callType}`);
      
      // Reload the active incident
      await loadActiveIncident();
      
      return newIncidentId;
    } catch (err) {
      console.error("Failed to create new incident:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // End the active incident
  const endIncident = async (): Promise<void> => {
    if (!activeIncident) return;
    
    try {
      await db.encounters.update(activeIncident.id!, {
        status: 'completed',
        endTime: new Date(),
        lastUpdated: new Date()
      });
      
      await db.logIncident(activeIncident.id!, 'Incident Ended');
      
      setActiveIncident(null);
      navigate('/');
    } catch (err) {
      console.error("Failed to end incident:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // Delete the active incident
  const deleteIncident = async (): Promise<void> => {
    if (!activeIncident) return;
    
    try {
      // Delete the incident from the database
      await db.encounters.delete(activeIncident.id!);
      
      setActiveIncident(null);
      navigate('/');
    } catch (err) {
      console.error("Failed to delete incident:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Refresh the active incident
  const refreshIncident = async (): Promise<void> => {
    await loadActiveIncident();
  };
  
  return (
    <IncidentContext.Provider 
      value={{ 
        activeIncident, 
        isLoading, 
        error, 
        createNewIncident, 
        endIncident,
        deleteIncident,
        refreshIncident
      }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => useContext(IncidentContext);
