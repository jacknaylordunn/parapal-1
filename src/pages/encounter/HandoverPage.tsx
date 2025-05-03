
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../lib/db';
import { 
  Printer, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  User,
  Clock,
  Activity,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const HandoverPage = () => {
  const { id } = useParams<{ id: string }>();
  const encounterId = parseInt(id || '0');
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  const [handoverTime, setHandoverTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const loadPatientData = async () => {
      if (!encounterId) return;
      
      try {
        const encounter = await db.encounters.get(encounterId);
        if (encounter) {
          setPatientData(encounter);
        }
      } catch (error) {
        console.error('Error loading patient data for handover:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatientData();
  }, [encounterId]);
  
  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };
  
  // Function to copy ATMIST to clipboard
  const handleCopyToClipboard = () => {
    if (!patientData) return;
    
    const handoverText = formatATMISTForCopy();
    navigator.clipboard.writeText(handoverText)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Handover information has been copied to clipboard",
        });
        
        // Reset the copied status after 3 seconds
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive"
        });
      });
  };
  
  // Format ATMIST for clipboard
  const formatATMISTForCopy = () => {
    if (!patientData) return '';
    
    const { patientDetails, vitals } = patientData;
    
    let age = '';
    if (patientDetails?.age) {
      age = patientDetails.age + ' years';
    } else if (patientDetails?.dateOfBirth) {
      const dob = new Date(patientDetails.dateOfBirth);
      const ageInYears = Math.floor((new Date().getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      age = ageInYears + ' years';
    }
    
    return `ATMIST HANDOVER:
A - Age/Gender: ${age} ${patientDetails?.sex || 'Unknown'}
T - Time of incident: ${patientData.startTime ? new Date(patientData.startTime).toLocaleString() : 'Unknown'}
M - Mechanism/History: ${patientData.patientHistory?.presentingComplaint || 'Not recorded'}
I - Injuries/Information: ${patientData.patientAssessment?.primaryAssessment || 'Not recorded'}
S - Signs & Symptoms: ${vitals?.length ? `HR: ${vitals[0].heartRate || '?'}, BP: ${vitals[0].systolic || '?'}/${vitals[0].diastolic || '?'}, SpO2: ${vitals[0].spo2 || '?'}%` : 'No vitals recorded'}
T - Treatment given: ${patientData.interventions?.map(i => i.name).join(', ') || 'None recorded'}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nhs-blue"></div>
      </div>
    );
  }
  
  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle size={48} className="text-amber-500 mb-4" />
        <h2 className="text-xl font-bold">No patient data available</h2>
        <p className="text-gray-500 dark:text-gray-400">Unable to generate handover information.</p>
      </div>
    );
  }
  
  const { patientDetails, vitals } = patientData;
  const latestVitals = vitals && vitals.length > 0 ? vitals[0] : null;
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-nhs-blue dark:text-nhs-light-blue">Patient Handover</h2>
          <p className="text-gray-600 dark:text-gray-400">ATMIST Format</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCopyToClipboard} className="flex items-center">
            {copied ? <CheckCircle className="mr-1" size={16} /> : <Copy className="mr-1" size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button onClick={handlePrint} className="flex items-center bg-nhs-blue hover:bg-nhs-dark-blue text-white">
            <Printer className="mr-1" size={16} />
            Print
          </Button>
        </div>
      </div>
      
      {/* ATMIST Handover Card */}
      <Card className="border border-gray-200 dark:border-gray-700 print:shadow-none">
        <CardHeader className="bg-nhs-pale-blue dark:bg-nhs-blue/20 print:bg-white">
          <CardTitle className="text-nhs-blue dark:text-nhs-light-blue flex items-center">
            ATMIST Handover Summary
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Patient Identifier */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">
                  {patientDetails?.firstName && patientDetails?.lastName 
                    ? `${patientDetails.firstName} ${patientDetails.lastName}`
                    : 'Unknown Patient'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  NHS: {patientDetails?.nhsNumber || 'Unknown'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Incident: {patientData.incidentNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(handoverTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* ATMIST Format */}
          <div className="font-sans">
            {/* A - Age/Gender */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 bg-nhs-blue text-white flex items-center justify-center font-bold text-xl">A</div>
              <div className="flex-1 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-1">
                  <User size={16} className="mr-2 text-nhs-blue" />
                  <span className="font-medium">Age/Gender:</span>
                </div>
                <p>
                  {patientDetails?.age ? `${patientDetails.age} years` : 'Unknown age'} • 
                  {patientDetails?.sex ? ` ${patientDetails.sex}` : ' Unknown gender'}
                </p>
              </div>
            </div>
            
            {/* T - Time of incident */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 bg-nhs-blue text-white flex items-center justify-center font-bold text-xl">T</div>
              <div className="flex-1 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-1">
                  <Clock size={16} className="mr-2 text-nhs-blue" />
                  <span className="font-medium">Time of incident:</span>
                </div>
                <p>
                  {patientData.startTime 
                    ? new Date(patientData.startTime).toLocaleString() 
                    : 'Time not recorded'}
                </p>
              </div>
            </div>
            
            {/* M - Mechanism/Medical history */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 bg-nhs-blue text-white flex items-center justify-center font-bold text-xl">M</div>
              <div className="flex-1 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-1">
                  <FileText size={16} className="mr-2 text-nhs-blue" />
                  <span className="font-medium">Mechanism/History:</span>
                </div>
                <p className="whitespace-pre-line">
                  {patientData.patientHistory?.presentingComplaint || 'Not recorded'}
                </p>
              </div>
            </div>
            
            {/* I - Injuries/Information */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 bg-nhs-blue text-white flex items-center justify-center font-bold text-xl">I</div>
              <div className="flex-1 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-1">
                  <AlertTriangle size={16} className="mr-2 text-nhs-blue" />
                  <span className="font-medium">Injuries/Information:</span>
                </div>
                <p className="whitespace-pre-line">
                  {patientData.patientAssessment?.primaryAssessment || 'Not recorded'}
                </p>
              </div>
            </div>
            
            {/* S - Signs & Symptoms */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 bg-nhs-blue text-white flex items-center justify-center font-bold text-xl">S</div>
              <div className="flex-1 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-1">
                  <Activity size={16} className="mr-2 text-nhs-blue" />
                  <span className="font-medium">Signs & Symptoms:</span>
                </div>
                {latestVitals ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400 text-sm">Heart Rate</span>
                      <span className="block font-medium">{latestVitals.heartRate || '--'} bpm</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400 text-sm">Blood Pressure</span>
                      <span className="block font-medium">
                        {latestVitals.systolic || '--'}/{latestVitals.diastolic || '--'} mmHg
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400 text-sm">SpO2</span>
                      <span className="block font-medium">{latestVitals.spo2 || '--'}%</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400 text-sm">Respiratory Rate</span>
                      <span className="block font-medium">{latestVitals.respiratoryRate || '--'} rpm</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400 text-sm">Temperature</span>
                      <span className="block font-medium">{latestVitals.temperature || '--'}°C</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400 text-sm">AVPU</span>
                      <span className="block font-medium">{latestVitals.avpu || '--'}</span>
                    </div>
                  </div>
                ) : (
                  <p>No vitals recorded</p>
                )}
              </div>
            </div>
            
            {/* T - Treatment given */}
            <div className="flex">
              <div className="w-10 bg-nhs-blue text-white flex items-center justify-center font-bold text-xl">T</div>
              <div className="flex-1 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-1">
                  <FileText size={16} className="mr-2 text-nhs-blue" />
                  <span className="font-medium">Treatment given:</span>
                </div>
                <p className="whitespace-pre-line">
                  {patientData.interventions?.length 
                    ? patientData.interventions.map(i => i.name).join(', ')
                    : 'No treatments recorded'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional notes section */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            {patientData.patientHistory?.additionalNotes || 'No additional notes recorded.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandoverPage;
