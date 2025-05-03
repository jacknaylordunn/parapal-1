
import { useState, useEffect } from 'react';
import { useEncounter } from '../../contexts/EncounterContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, FileText, Printer } from 'lucide-react';
import { PatientHistory, VitalSignReading, db } from '@/lib/db';

const HandoverPage = () => {
  const { activeEncounter } = useEncounter();
  const { toast } = useToast();
  const [incidentTimeElapsed, setIncidentTimeElapsed] = useState('');
  const [vitalSigns, setVitalSigns] = useState<VitalSignReading[]>([]);
  const [patientHistory, setPatientHistory] = useState<PatientHistory | null>(null);
  
  // Load vital signs and history
  useEffect(() => {
    if (activeEncounter?.id) {
      const loadData = async () => {
        try {
          // Load vital signs
          const vitals = await db.vitalSigns.where('encounterId').equals(activeEncounter.id!).toArray();
          setVitalSigns(vitals.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
          
          // Load patient history
          const history = await db.patientHistories.where('encounterId').equals(activeEncounter.id!).first();
          setPatientHistory(history || null);
        } catch (error) {
          console.error("Error loading handover data:", error);
        }
      };
      
      loadData();
    }
  }, [activeEncounter]);
  
  useEffect(() => {
    if (activeEncounter?.startTime) {
      const updateElapsedTime = () => {
        const startTime = new Date(activeEncounter.startTime);
        const now = new Date();
        const elapsedMs = now.getTime() - startTime.getTime();
        
        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        
        setIncidentTimeElapsed(`${hours}h ${minutes}m`);
      };
      
      updateElapsedTime();
      const timer = setInterval(updateElapsedTime, 60000); // Update every minute
      
      return () => clearInterval(timer);
    }
  }, [activeEncounter]);
  
  if (!activeEncounter) {
    return <div className="p-4">No active encounter</div>;
  }
  
  const patientDetails = activeEncounter.patientDetails || {};
  const latestVitals = vitalSigns.length > 0 ? vitalSigns[0] : null;
  
  const formatAllergies = () => {
    if (patientHistory?.allergies && patientHistory.allergies.length > 0) {
      return patientHistory.allergies.map(allergy => allergy.allergen).join(', ');
    }
    return 'None recorded';
  };
  
  const formatMedications = () => {
    if (patientHistory?.medications && patientHistory.medications.length > 0) {
      return patientHistory.medications.map(med => med.name).join(', ');
    }
    return 'None recorded';
  };
  
  const handleCopyATMIST = () => {
    if (document.getElementById('atmist-content')) {
      const content = document.getElementById('atmist-content')?.textContent;
      navigator.clipboard.writeText(content || '');
      
      toast({
        title: "Copied to clipboard",
        description: "ATMIST handover has been copied to your clipboard"
      });
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white mb-2">Patient Handover</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Summary and formal handover documentation
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button onClick={handlePrint} variant="outline" className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="atmist" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="atmist">ATMIST Handover</TabsTrigger>
          <TabsTrigger value="sbar">SBAR Handover</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="atmist">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>ATMIST Handover Format</CardTitle>
                <CardDescription>Standard emergency handover format</CardDescription>
              </div>
              <Button onClick={handleCopyATMIST} variant="ghost" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <div 
                id="atmist-content" 
                className="font-sans bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-bold mb-4 text-nhs-blue dark:text-nhs-light-blue">ATMIST HANDOVER - CAD: {activeEncounter.incidentNumber}</h3>
                
                <p className="mb-3"><strong>A - Age: </strong>{patientDetails?.age || 'Not recorded'} years</p>
                
                <p className="mb-3"><strong>T - Time of Onset: </strong>{activeEncounter.startTime ? new Date(activeEncounter.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not recorded'} ({incidentTimeElapsed} ago)</p>
                
                <p className="mb-3"><strong>M - Mechanism/Medical Complaint: </strong>{activeEncounter.callType || 'Not recorded'}{patientHistory?.presentingComplaint ? ` - ${patientHistory.presentingComplaint}` : ''}</p>
                
                <p className="mb-3"><strong>I - Injuries/Information: </strong>
                  {patientHistory?.pastMedicalHistory || 'None recorded'}
                  {patientHistory?.allergies ? `. Allergies: ${formatAllergies()}` : ''}
                </p>
                
                <p className="mb-3"><strong>S - Signs & Symptoms: </strong>
                  {latestVitals ? 
                    `Latest observations - HR: ${latestVitals.heartRate || 'N/R'}, 
                    BP: ${latestVitals.systolicBP || 'N/R'}/${latestVitals.diastolicBP || 'N/R'}, 
                    SpO2: ${latestVitals.oxygenSaturation || 'N/R'}%, 
                    RR: ${latestVitals.respiratoryRate || 'N/R'}, 
                    Temp: ${latestVitals.temperature || 'N/R'}°C` 
                    : 'No observations recorded'}
                </p>
                
                <p className="mb-3"><strong>T - Treatment: </strong>
                  {patientHistory?.medications?.length > 0 ? `Patient medications: ${formatMedications()}. ` : ''}
                  {latestVitals?.isOnOxygen ? 
                    `Oxygen therapy: ${latestVitals.oxygenDeliveryMethod || 'method not recorded'} at ${latestVitals.oxygenFlowRate || 'unspecified'} L/min.` : 
                    'No interventions recorded'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sbar">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>SBAR Handover Format</CardTitle>
                <CardDescription>Situation, Background, Assessment, Recommendation</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="font-sans bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-4 text-nhs-blue dark:text-nhs-light-blue">SBAR HANDOVER - CAD: {activeEncounter.incidentNumber}</h3>
                
                <div className="mb-4">
                  <h4 className="font-bold">Situation</h4>
                  <p>
                    {patientDetails?.sex ? `${patientDetails.sex.charAt(0).toUpperCase() + patientDetails.sex.slice(1)} ` : ''}
                    {patientDetails?.age ? `${patientDetails.age} year old ` : ''}
                    patient with {patientHistory?.presentingComplaint || activeEncounter.callType || 'unknown complaint'}.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold">Background</h4>
                  <p>
                    Patient has history of: {patientHistory?.pastMedicalHistory || 'none recorded'}.
                    {patientHistory?.allergies?.length ? ` Allergic to ${formatAllergies()}.` : ''}
                    {patientHistory?.medications?.length ? ` Current medications: ${formatMedications()}.` : ''}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold">Assessment</h4>
                  <p>
                    {latestVitals ? 
                      `Latest observations - HR: ${latestVitals.heartRate || 'N/R'}, 
                      BP: ${latestVitals.systolicBP || 'N/R'}/${latestVitals.diastolicBP || 'N/R'}, 
                      SpO2: ${latestVitals.oxygenSaturation || 'N/R'}%, 
                      RR: ${latestVitals.respiratoryRate || 'N/R'}, 
                      Temp: ${latestVitals.temperature || 'N/R'}°C` 
                      : 'No observations recorded'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold">Recommendation</h4>
                  <p>
                    {latestVitals?.isOnOxygen ? 
                      `Oxygen therapy: ${latestVitals.oxygenDeliveryMethod || 'method not recorded'} at ${latestVitals.oxygenFlowRate || 'unspecified'} L/min.` : 
                      'No interventions recorded'
                    }
                    {latestVitals?.news2Score !== undefined ? ` NEWS2 score: ${latestVitals.news2Score} (${latestVitals.news2RiskLevel || 'risk not determined'}).` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clinical">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Summary</CardTitle>
              <CardDescription>Complete patient encounter details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Patient Details</h3>
                  <div className="mt-2 space-y-1">
                    <p>Name: {patientDetails?.firstName || 'Not recorded'} {patientDetails?.lastName || ''}</p>
                    <p>Age: {patientDetails?.age || 'Not recorded'} years</p>
                    <p>Sex: {patientDetails?.sex || 'Not recorded'}</p>
                    <p>NHS Number: {patientDetails?.nhsNumber || 'Not recorded'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Incident Details</h3>
                  <div className="mt-2 space-y-1">
                    <p>CAD: {activeEncounter.incidentNumber}</p>
                    <p>Call Type: {activeEncounter.callType}</p>
                    <p>Time: {activeEncounter.startTime ? new Date(activeEncounter.startTime).toLocaleString() : 'Unknown'}</p>
                    <p>Duration: {incidentTimeElapsed}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Medical History</h3>
                <div className="mt-2">
                  <p>Presenting Complaint: {patientHistory?.presentingComplaint || 'Not recorded'}</p>
                  <p>Medical History: {patientHistory?.pastMedicalHistory || 'None recorded'}</p>
                  <p>Medications: {formatMedications()}</p>
                  <p>Allergies: {formatAllergies()}</p>
                </div>
              </div>
              
              {vitalSigns && vitalSigns.length > 0 && (
                <div>
                  <h3 className="font-semibold">Vital Signs</h3>
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">HR</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">BP</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SpO2</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">RR</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Temp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {vitalSigns.map((vital, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}>
                            <td className="px-3 py-2 whitespace-nowrap">{new Date(vital.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{vital.heartRate || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{vital.systolicBP || '-'}/{vital.diastolicBP || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{vital.oxygenSaturation || '-'}%</td>
                            <td className="px-3 py-2 whitespace-nowrap">{vital.respiratoryRate || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{vital.temperature || '-'}°C</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handlePrint}>
                <FileText className="mr-2 h-4 w-4" />
                Export Full Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HandoverPage;
