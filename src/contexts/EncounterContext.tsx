
import { createContext, useContext, useEffect, useState } from 'react';
import { PatientEncounter, db } from '../lib/db';
import { useNavigate } from 'react-router-dom';

type EncounterContextType = {
  activeEncounter: PatientEncounter | null;
  isLoading: boolean;
  error: Error | null;
  createNewEncounter: (incidentNumber: string, callType: string) => Promise<number>;
  endEncounter: () => Promise<void>;
  deleteEncounter: () => Promise<void>;
  refreshEncounter: () => Promise<void>;
};

const EncounterContext = createContext<EncounterContextType>({
  activeEncounter: null,
  isLoading: true,
  error: null,
  createNewEncounter: async () => { throw new Error('Not implemented'); },
  endEncounter: async () => { throw new Error('Not implemented'); },
  deleteEncounter: async () => { throw new Error('Not implemented'); },
  refreshEncounter: async () => { throw new Error('Not implemented'); }
});

export const EncounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeEncounter, setActiveEncounter] = useState<PatientEncounter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  
  // Load the active encounter on mount
  useEffect(() => {
    loadActiveEncounter();
  }, []);
  
  // Load the active encounter from the database
  const loadActiveEncounter = async () => {
    setIsLoading(true);
    try {
      const encounter = await db.getActiveEncounter();
      setActiveEncounter(encounter || null);
    } catch (err) {
      console.error("Failed to load active encounter:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new encounter
  const createNewEncounter = async (incidentNumber: string, callType: string): Promise<number> => {
    try {
      // End any existing active encounters first
      if (activeEncounter) {
        await endEncounter();
      }
      
      // Create new encounter
      const newEncounterId = await db.encounters.add({
        incidentNumber,
        callType,
        status: 'active',
        startTime: new Date(),
        lastUpdated: new Date()
      });
      
      // Log the event
      await db.logIncident(newEncounterId, 'Encounter Started', `Incident: ${incidentNumber}, Type: ${callType}`);
      
      // Reload the active encounter
      await loadActiveEncounter();
      
      return newEncounterId;
    } catch (err) {
      console.error("Failed to create new encounter:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // End the active encounter
  const endEncounter = async (): Promise<void> => {
    if (!activeEncounter) return;
    
    try {
      await db.encounters.update(activeEncounter.id!, {
        status: 'completed',
        endTime: new Date(),
        lastUpdated: new Date()
      });
      
      await db.logIncident(activeEncounter.id!, 'Encounter Ended');
      
      setActiveEncounter(null);
      navigate('/');
    } catch (err) {
      console.error("Failed to end encounter:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // Delete the active encounter
  const deleteEncounter = async (): Promise<void> => {
    if (!activeEncounter) return;
    
    try {
      // Delete the encounter from the database
      await db.encounters.delete(activeEncounter.id!);
      
      setActiveEncounter(null);
      navigate('/');
    } catch (err) {
      console.error("Failed to delete encounter:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Refresh the active encounter
  const refreshEncounter = async (): Promise<void> => {
    await loadActiveEncounter();
  };
  
  return (
    <EncounterContext.Provider 
      value={{ 
        activeEncounter, 
        isLoading, 
        error, 
        createNewEncounter, 
        endEncounter,
        deleteEncounter,
        refreshEncounter
      }}>
      {children}
    </EncounterContext.Provider>
  );
};

export const useEncounter = () => useContext(EncounterContext);
