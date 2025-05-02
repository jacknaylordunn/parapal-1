import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, PatientEncounter, VitalSignReading, PatientHistory } from '../../lib/db';
import { Copy, Download, Check, AlertCircle, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const HandoverPage = () => {
  const { id } = useParams<{ id: string }>();
  const encounterId = parseInt(id || '0');
  const { toast } = useToast();
  
  const [encounter, setEncounter] = useState<PatientEncounter | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSignReading[]>([]);
  const [patientHistory, setPatientHistory] = useState<PatientHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [atmistCopied, setAtmistCopied] = useState(false);
  const [preAlertType, setPreAlertType] = useState<string | null>(null);
  const [showPreAlertDialog, setShowPreAlertDialog] = useState(false);
  
  // Load encounter data
  useEffect(() => {
    const loadEncounterData = async () => {
      if (!encounterId) return;
      
      try {
        // Load encounter
        const encounterData = await db.encounters.get(encounterId);
        setEncounter(encounterData || null);
        
        // Load vital signs
        const vitals = await db.vitalSigns
          .where('encounterId')
          .equals(encounterId)
          .reverse()
          .sortBy('timestamp');
        
        setVitalSigns(vitals);
        
        // Load patient history
        const history = await db.patientHistories
          .where('encounterId')
          .equals(encounterId)
          .first();
          
        if (history) {
          // Also load allergies and medications
          const allergies = await db.allergies.toArray();
          const medications = await db.medications.toArray();
          
          setPatientHistory({
            ...history,
            allergies: allergies || [],
            medications: medications || []
          });
        }
      } catch (error) {
        console.error('Error loading encounter data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEncounterData();
  }, [encounterId]);
  
  // Generate ATMIST handover text
  const generateATMIST = (): string => {
    if (!encounter || vitalSigns.length === 0) {
      return 'Insufficient data for ATMIST handover';
    }
    
    const latestVitals = vitalSigns[0]; // Most recent vitals
    const patientDetails = encounter.patientDetails;
    const patientAge = patientDetails?.age || 'Unknown';
    const patientSex = patientDetails?.sex || 'Unknown';
    
    // Format time since incident
    let timeElapsed = 'Unknown';
    if (encounter.startTime) {
      const minutes = Math.floor((new Date().getTime() - new Date(encounter.startTime).getTime()) / 60000);
      timeElapsed = `${minutes} minutes`;
    }
    
    return `ATMIST HANDOVER:
    
A - AGE/SEX: ${patientAge} year old ${patientSex}

T - TIME: Incident occurred approximately ${timeElapsed} ago

M - MECHANISM: ${patientHistory?.presentingComplaint || 'Not documented'}

I - INJURIES: ${patientHistory?.historyPresentingComplaint || 'None documented'}

S - SIGNS & SYMPTOMS:
- HR: ${latestVitals.heartRate || 'Not recorded'} bpm
- RR: ${latestVitals.respiratoryRate || 'Not recorded'} bpm
- BP: ${latestVitals.systolicBP || '?'}/${latestVitals.diastolicBP || '?'} mmHg
- SpO2: ${latestVitals.oxygenSaturation || 'Not recorded'}% ${latestVitals.isOnOxygen ? 'on oxygen' : 'on air'}
- GCS: ${latestVitals.gcsTotalScore || 'Not recorded'}/15
- Temp: ${latestVitals.temperature || 'Not recorded'}°C
- BM: ${latestVitals.bloodGlucose || 'Not recorded'} mmol/L
${latestVitals.news2Score !== undefined ? `- NEWS2 Score: ${latestVitals.news2Score} (${latestVitals.news2RiskLevel} Risk)` : ''}

T - TREATMENT: 
- ${encounter.callType} callout
${patientHistory?.allergies && patientHistory.allergies.length > 0 
  ? `- Allergies: ${patientHistory.allergies.map(a => a.allergen).join(', ')}` 
  : '- No known allergies'}
${patientHistory?.medications && patientHistory.medications.length > 0 
  ? `- Current medications: ${patientHistory.medications.map(m => m.name).join(', ')}` 
  : '- No regular medications'}

Incident Number: ${encounter.incidentNumber}
Handover Time: ${new Date().toLocaleString()}`;
  };
  
  // Copy ATMIST to clipboard
  const copyATMISTToClipboard = async () => {
    const atmistText = generateATMIST();
    
    try {
      await navigator.clipboard.writeText(atmistText);
      setAtmistCopied(true);
      
      // Reset "copied" status after 2 seconds
      setTimeout(() => {
        setAtmistCopied(false);
      }, 2000);
      
      // Log the event
      await db.logIncident(encounterId, 'ATMIST Copied to Clipboard');
    } catch (error) {
      console.error('Failed to copy ATMIST:', error);
    }
  };
  
  // Generate PDF (placeholder)
  const generatePDF = () => {
    console.log('PDF generation is a placeholder feature');
    alert('PDF generation would be implemented in the full version');
    
    // Log the attempted action
    db.logIncident(encounterId, 'Attempted to Generate PDF (Placeholder)');
  };
  
  // Handle pre-alert selection
  const handlePreAlertClick = (type: string) => {
    setPreAlertType(type);
    setShowPreAlertDialog(true);
    // Log the pre-alert action
    db.logIncident(encounterId, `${type} Pre-alert Initiated`);
  };
  
  // Submit pre-alert (simulated)
  const submitPreAlert = () => {
    // This would connect to an actual service in production
    toast({
      title: "Pre-alert Sent Successfully",
      description: `${preAlertType} team has been notified and is preparing for patient arrival.`,
      variant: "default",
    });
    
    setShowPreAlertDialog(false);
    
    // Log the action
    db.logIncident(encounterId, `${preAlertType} Pre-alert Sent`);
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading handover information...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Handover</h1>
      
      <div className="clinical-card">
        <h2 className="text-xl font-semibold mb-4">ATMIST Handover</h2>
        
        {encounter ? (
          <>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-line font-mono text-sm">
              {generateATMIST()}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={copyATMISTToClipboard}
                className="px-4 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md flex items-center"
              >
                {atmistCopied ? (
                  <>
                    <Check size={18} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} className="mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </button>
              
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-nhs-dark-blue hover:bg-blue-800 text-white rounded-md flex items-center"
              >
                <Download size={18} className="mr-2" />
                Generate PDF
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600 dark:text-gray-400">
              No encounter data available for handover
            </p>
          </div>
        )}
      </div>
      
      <div className="clinical-card">
        <h2 className="text-xl font-semibold mb-4">ePCR Generation</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <p className="text-center">
            ePCR preview and finalization will be implemented in a future version.
          </p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md flex items-center cursor-not-allowed"
          >
            Preview ePCR
          </button>
          
          <button
            disabled
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md flex items-center cursor-not-allowed"
          >
            Mark as Finalised
          </button>
        </div>
      </div>
      
      <div className="clinical-card">
        <h2 className="text-xl font-semibold mb-4">Pre-alert</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handlePreAlertClick('STEMI')}
            className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 p-4 rounded-md border border-red-300 dark:border-red-800 text-center transition-colors"
          >
            <h3 className="text-red-800 dark:text-red-300 font-semibold mb-1">STEMI Pre-alert</h3>
            <p className="text-sm text-red-700 dark:text-red-400">Cardiac catheterization lab</p>
          </button>
          
          <button
            onClick={() => handlePreAlertClick('Stroke')}
            className="bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 p-4 rounded-md border border-purple-300 dark:border-purple-800 text-center transition-colors"
          >
            <h3 className="text-purple-800 dark:text-purple-300 font-semibold mb-1">Stroke Pre-alert</h3>
            <p className="text-sm text-purple-700 dark:text-purple-400">Stroke team activation</p>
          </button>
          
          <button
            onClick={() => handlePreAlertClick('Trauma')}
            className="bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 p-4 rounded-md border border-amber-300 dark:border-amber-800 text-center transition-colors"
          >
            <h3 className="text-amber-800 dark:text-amber-300 font-semibold mb-1">Trauma Pre-alert</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">Major trauma team activation</p>
          </button>
        </div>
        
        <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md">
          <p className="text-amber-800 dark:text-amber-300 text-center">
            PLACEHOLDER: Pre-alert functionality will be implemented in future versions.
          </p>
        </div>
      </div>
      
      <div className="clinical-card">
        <h2 className="text-xl font-semibold mb-4">Incident Log</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <p className="text-center">
            Incident log display will be implemented in a future version.
          </p>
        </div>
      </div>

      {/* Pre-alert Dialog */}
      <Dialog open={showPreAlertDialog} onOpenChange={setShowPreAlertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="mr-2 text-red-500" /> 
              {preAlertType} Pre-alert
            </DialogTitle>
            <DialogDescription>
              {preAlertType === 'STEMI' && (
                <>
                  You are about to notify the cardiac catheterization lab of an incoming STEMI patient.
                  This will trigger an immediate response from the cardiac team.
                </>
              )}
              {preAlertType === 'Stroke' && (
                <>
                  You are about to notify the stroke team of an incoming patient with suspected stroke.
                  This will activate the stroke protocol at the receiving facility.
                </>
              )}
              {preAlertType === 'Trauma' && (
                <>
                  You are about to notify the trauma team of an incoming major trauma patient.
                  This will trigger trauma team activation at the receiving facility.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                {preAlertType === 'STEMI' && <Heart className="mr-2 text-red-500" />}
                {preAlertType === 'Stroke' && <AlertCircle className="mr-2 text-purple-500" />}
                {preAlertType === 'Trauma' && <AlertCircle className="mr-2 text-amber-500" />}
                Patient Details
              </h4>
              <p className="text-sm mb-2">
                <strong>Name:</strong> {encounter?.patientDetails?.firstName} {encounter?.patientDetails?.lastName}
              </p>
              <p className="text-sm mb-2">
                <strong>Age:</strong> {encounter?.patientDetails?.age} years
              </p>
              <p className="text-sm">
                <strong>Estimated arrival:</strong> {new Date(Date.now() + 15 * 60000).toLocaleTimeString()} (15 minutes)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreAlertDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={submitPreAlert}
            >
              Send Pre-alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HandoverPage;
