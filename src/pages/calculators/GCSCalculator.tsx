
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, InfoIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { calculateGCS, mapGCSToAVPU } from '@/lib/clinical-calculations';

const GCSCalculator = () => {
  const { toast } = useToast();
  
  // GCS parameters
  const [eyeResponse, setEyeResponse] = useState<number | undefined>(undefined);
  const [verbalResponse, setVerbalResponse] = useState<number | undefined>(undefined);
  const [motorResponse, setMotorResponse] = useState<number | undefined>(undefined);
  
  // Results
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [avpuScale, setAvpuScale] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  
  // Calculate the GCS score
  const calculateScore = () => {
    // Check if all inputs are provided
    if (eyeResponse === undefined || verbalResponse === undefined || motorResponse === undefined) {
      toast({
        title: "Incomplete Form",
        description: "Please select a value for each GCS component.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate GCS score
    const gcsScore = eyeResponse + verbalResponse + motorResponse;
    setTotalScore(gcsScore);
    
    // Determine AVPU equivalent
    const avpu = mapGCSToAVPU(gcsScore);
    setAvpuScale(avpu);
    
    // Set severity
    if (gcsScore >= 13) {
      setSeverity('Mild');
    } else if (gcsScore >= 9) {
      setSeverity('Moderate');
    } else {
      setSeverity('Severe');
    }
    
    // Show results
    setResultsVisible(true);
    
    toast({
      title: "GCS Score Calculated",
      description: `Total GCS Score: ${gcsScore} (${gcsScore >= 13 ? 'Mild' : gcsScore >= 9 ? 'Moderate' : 'Severe'})`,
    });
  };
  
  // Reset all fields
  const resetForm = () => {
    setEyeResponse(undefined);
    setVerbalResponse(undefined);
    setMotorResponse(undefined);
    setTotalScore(null);
    setAvpuScale(null);
    setSeverity(null);
    setResultsVisible(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Brain size={32} className="text-nhs-purple mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">GCS Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400">Glasgow Coma Scale Assessment</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>GCS Assessment</CardTitle>
              <CardDescription>Evaluate the patient's best responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Eye Opening Response */}
              <div className="space-y-3">
                <Label className="text-lg font-medium">Eye Opening (E)</Label>
                <RadioGroup value={eyeResponse?.toString()} onValueChange={(value) => setEyeResponse(parseInt(value))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="4" id="eye-4" />
                      <Label htmlFor="eye-4" className="flex-1 cursor-pointer">Spontaneous</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="3" id="eye-3" />
                      <Label htmlFor="eye-3" className="flex-1 cursor-pointer">To sound</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="2" id="eye-2" />
                      <Label htmlFor="eye-2" className="flex-1 cursor-pointer">To pressure</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="1" id="eye-1" />
                      <Label htmlFor="eye-1" className="flex-1 cursor-pointer">None</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Verbal Response */}
              <div className="space-y-3">
                <Label className="text-lg font-medium">Verbal Response (V)</Label>
                <RadioGroup value={verbalResponse?.toString()} onValueChange={(value) => setVerbalResponse(parseInt(value))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="5" id="verbal-5" />
                      <Label htmlFor="verbal-5" className="flex-1 cursor-pointer">Oriented</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="4" id="verbal-4" />
                      <Label htmlFor="verbal-4" className="flex-1 cursor-pointer">Confused</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="3" id="verbal-3" />
                      <Label htmlFor="verbal-3" className="flex-1 cursor-pointer">Words</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="2" id="verbal-2" />
                      <Label htmlFor="verbal-2" className="flex-1 cursor-pointer">Sounds</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="1" id="verbal-1" />
                      <Label htmlFor="verbal-1" className="flex-1 cursor-pointer">None</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Motor Response */}
              <div className="space-y-3">
                <Label className="text-lg font-medium">Motor Response (M)</Label>
                <RadioGroup value={motorResponse?.toString()} onValueChange={(value) => setMotorResponse(parseInt(value))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="6" id="motor-6" />
                      <Label htmlFor="motor-6" className="flex-1 cursor-pointer">Obeys commands</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="5" id="motor-5" />
                      <Label htmlFor="motor-5" className="flex-1 cursor-pointer">Localizing</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="4" id="motor-4" />
                      <Label htmlFor="motor-4" className="flex-1 cursor-pointer">Normal flexion</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="3" id="motor-3" />
                      <Label htmlFor="motor-3" className="flex-1 cursor-pointer">Abnormal flexion</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="2" id="motor-2" />
                      <Label htmlFor="motor-2" className="flex-1 cursor-pointer">Extension</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="1" id="motor-1" />
                      <Label htmlFor="motor-1" className="flex-1 cursor-pointer">None</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button onClick={calculateScore}>Calculate GCS Score</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Results Area */}
        <div className="lg:col-span-1">
          {/* Results Card */}
          <Card className={resultsVisible ? "border-2 border-nhs-blue" : ""}>
            <CardHeader>
              <CardTitle>GCS Score Results</CardTitle>
              <CardDescription>Consciousness assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {resultsVisible ? (
                <>
                  <div className="text-center py-4">
                    <div className="text-6xl font-bold mb-2 text-nhs-blue">{totalScore}</div>
                    <div className="text-xl font-medium">
                      <span className={`
                        ${severity === 'Mild' ? 'text-green-600 dark:text-green-400' : ''}
                        ${severity === 'Moderate' ? 'text-amber-600 dark:text-amber-400' : ''}
                        ${severity === 'Severe' ? 'text-red-600 dark:text-red-400' : ''}
                      `}>
                        {severity} Brain Injury
                      </span>
                    </div>
                    <div className="flex justify-center items-center gap-3 mt-3">
                      <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        <span className="font-semibold">E: </span>{eyeResponse}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        <span className="font-semibold">V: </span>{verbalResponse}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        <span className="font-semibold">M: </span>{motorResponse}
                      </div>
                    </div>
                  </div>
                  
                  <Alert className={`
                    ${severity === 'Mild' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}
                    ${severity === 'Moderate' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' : ''}
                    ${severity === 'Severe' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' : ''}
                  `}>
                    <AlertCircle className={`
                      h-4 w-4
                      ${severity === 'Mild' ? 'text-green-600 dark:text-green-400' : ''}
                      ${severity === 'Moderate' ? 'text-amber-600 dark:text-amber-400' : ''}
                      ${severity === 'Severe' ? 'text-red-600 dark:text-red-400' : ''}
                    `} />
                    <AlertTitle>AVPU Equivalent: {avpuScale}</AlertTitle>
                    <AlertDescription>
                      {severity === 'Mild' && "Observe for changes. Assess regularly."}
                      {severity === 'Moderate' && "Requires close monitoring for potential deterioration."}
                      {severity === 'Severe' && "Requires immediate medical intervention."}
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Complete the assessment to see results.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">About GCS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>The Glasgow Coma Scale (GCS) is a neurological scale that aims to give a reliable and objective way of recording the state of a person's consciousness for initial as well as subsequent assessment.</p>
              <p className="mt-2">Total score: 3-15</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><span className="text-green-600 dark:text-green-400 font-medium">Mild:</span> 13-15</li>
                <li><span className="text-amber-600 dark:text-amber-400 font-medium">Moderate:</span> 9-12</li>
                <li><span className="text-red-600 dark:text-red-400 font-medium">Severe:</span> 3-8</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GCSCalculator;
