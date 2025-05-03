
import { useState, useEffect } from 'react';
import { useEncounter } from '../../contexts/EncounterContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, FileText, Printer } from 'lucide-react';

const HandoverPage = () => {
  const { activeEncounter } = useEncounter();
  const { toast } = useToast();
  const [incidentTimeElapsed, setIncidentTimeElapsed] = useState('');
  
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
  
  const { 
    patientDetails,
    observations,
    medicalHistory
  } = activeEncounter;
  
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
                
                <p className="mb-3"><strong>A - Age: </strong>{patientDetails?.age || 'Not recorded'} {patientDetails?.ageUnit || ''}</p>
                
                <p className="mb-3"><strong>T - Time of Onset: </strong>{activeEncounter.startTime ? new Date(activeEncounter.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not recorded'} ({incidentTimeElapsed} ago)</p>
                
                <p className="mb-3"><strong>M - Mechanism/Medical Complaint: </strong>{activeEncounter.callType || 'Not recorded'}{medicalHistory?.presentingComplaint ? ` - ${medicalHistory.presentingComplaint}` : ''}</p>
                
                <p className="mb-3"><strong>I - Injuries/Information: </strong>
                  {medicalHistory?.medicalConditions ? medicalHistory.medicalConditions.join(', ') : 'None recorded'}
                  {medicalHistory?.allergies ? `. Allergies: ${medicalHistory.allergies.join(', ')}` : ''}
                </p>
                
                <p className="mb-3"><strong>S - Signs & Symptoms: </strong>
                  {observations?.length > 0 ? 
                    `Latest observations - HR: ${observations[observations.length-1]?.hr || 'N/R'}, 
                    BP: ${observations[observations.length-1]?.sbp || 'N/R'}/${observations[observations.length-1]?.dbp || 'N/R'}, 
                    SpO2: ${observations[observations.length-1]?.spo2 || 'N/R'}%, 
                    RR: ${observations[observations.length-1]?.rr || 'N/R'}, 
                    Temp: ${observations[observations.length-1]?.temperature || 'N/R'}°C` 
                    : 'No observations recorded'}
                </p>
                
                <p className="mb-3"><strong>T - Treatment: </strong>
                  {medicalHistory?.medications?.length > 0 ? `Patient medications: ${medicalHistory.medications.join(', ')}. ` : ''}
                  {observations?.length > 0 && observations[observations.length-1]?.interventions ? 
                    `Interventions: ${observations[observations.length-1].interventions}` : 
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
                    {patientDetails?.gender ? `${patientDetails.gender.charAt(0).toUpperCase() + patientDetails.gender.slice(1)} ` : ''}
                    {patientDetails?.age ? `${patientDetails.age} year old ` : ''}
                    patient with {medicalHistory?.presentingComplaint || activeEncounter.callType || 'unknown complaint'}.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold">Background</h4>
                  <p>
                    Patient has history of: {medicalHistory?.medicalConditions?.join(', ') || 'none recorded'}.
                    {medicalHistory?.allergies?.length ? ` Allergic to ${medicalHistory.allergies.join(', ')}.` : ''}
                    {medicalHistory?.medications?.length ? ` Current medications: ${medicalHistory.medications.join(', ')}.` : ''}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold">Assessment</h4>
                  <p>
                    {observations?.length > 0 ? 
                      `Latest observations - HR: ${observations[observations.length-1]?.hr || 'N/R'}, 
                      BP: ${observations[observations.length-1]?.sbp || 'N/R'}/${observations[observations.length-1]?.dbp || 'N/R'}, 
                      SpO2: ${observations[observations.length-1]?.spo2 || 'N/R'}%, 
                      RR: ${observations[observations.length-1]?.rr || 'N/R'}, 
                      Temp: ${observations[observations.length-1]?.temperature || 'N/R'}°C` 
                      : 'No observations recorded'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold">Recommendation</h4>
                  <p>
                    {observations?.length > 0 && observations[observations.length-1]?.interventions ? 
                      `Interventions provided: ${observations[observations.length-1].interventions}` : 
                      'No interventions recorded'
                    }
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
                    <p>Age: {patientDetails?.age || 'Not recorded'} {patientDetails?.ageUnit || ''}</p>
                    <p>Gender: {patientDetails?.gender || 'Not recorded'}</p>
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
                  <p>Presenting Complaint: {medicalHistory?.presentingComplaint || 'Not recorded'}</p>
                  <p>Medical Conditions: {medicalHistory?.medicalConditions?.join(', ') || 'None recorded'}</p>
                  <p>Medications: {medicalHistory?.medications?.join(', ') || 'None recorded'}</p>
                  <p>Allergies: {medicalHistory?.allergies?.join(', ') || 'None recorded'}</p>
                </div>
              </div>
              
              {observations && observations.length > 0 && (
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
                        {observations.map((obs, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}>
                            <td className="px-3 py-2 whitespace-nowrap">{new Date(obs.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{obs.hr || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{obs.sbp || '-'}/{obs.dbp || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{obs.spo2 || '-'}%</td>
                            <td className="px-3 py-2 whitespace-nowrap">{obs.rr || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{obs.temperature || '-'}°C</td>
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
