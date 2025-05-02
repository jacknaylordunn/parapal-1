
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const GCSCalculator = () => {
  const navigate = useNavigate();
  const [eyeResponse, setEyeResponse] = useState<number>(4);
  const [verbalResponse, setVerbalResponse] = useState<number>(5);
  const [motorResponse, setMotorResponse] = useState<number>(6);

  // Check if we're in the encounter context
  const isInEncounter = window.location.pathname.includes('/encounter/');
  const handleBackClick = () => {
    if (isInEncounter) {
      // If we're in an encounter, get the encounter ID from the URL
      const pathParts = window.location.pathname.split('/');
      const encounterIndex = pathParts.findIndex(part => part === 'encounter');
      if (encounterIndex !== -1 && pathParts.length > encounterIndex + 1) {
        const encounterId = pathParts[encounterIndex + 1];
        navigate(`/encounter/${encounterId}/guidance`);
      } else {
        navigate(-1); // Fallback
      }
    } else {
      navigate('/calculators');
    }
  };

  // Calculate total GCS score
  const totalScore = eyeResponse + verbalResponse + motorResponse;
  
  // Determine severity based on score
  const determineSeverity = () => {
    if (totalScore >= 13) return { level: "Mild", color: "text-green-600" };
    if (totalScore >= 9) return { level: "Moderate", color: "text-amber-600" };
    return { level: "Severe", color: "text-red-600" };
  };

  const severity = determineSeverity();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBackClick} className="mr-2">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-nhs-dark-blue dark:text-white flex items-center">
          <Brain className="mr-2" /> Glasgow Coma Scale
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GCS Assessment</CardTitle>
            <CardDescription>Select the appropriate response for each category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Eye Opening Response */}
            <div>
              <h3 className="text-lg font-medium mb-3">Eye Opening Response</h3>
              <RadioGroup 
                value={eyeResponse.toString()} 
                onValueChange={(value) => setEyeResponse(parseInt(value))}
                className="space-y-2"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="4" id="eye-4" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="eye-4">Spontaneously (4)</Label>
                    <p className="text-sm text-gray-500">Eyes open spontaneously</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="3" id="eye-3" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="eye-3">To verbal command (3)</Label>
                    <p className="text-sm text-gray-500">Eyes open to verbal stimulus</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="2" id="eye-2" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="eye-2">To pain (2)</Label>
                    <p className="text-sm text-gray-500">Eyes open to painful stimulus</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="1" id="eye-1" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="eye-1">No response (1)</Label>
                    <p className="text-sm text-gray-500">No eye opening</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* Verbal Response */}
            <div>
              <h3 className="text-lg font-medium mb-3">Verbal Response</h3>
              <RadioGroup 
                value={verbalResponse.toString()} 
                onValueChange={(value) => setVerbalResponse(parseInt(value))}
                className="space-y-2"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="5" id="verbal-5" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="verbal-5">Oriented (5)</Label>
                    <p className="text-sm text-gray-500">Fully oriented</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="4" id="verbal-4" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="verbal-4">Confused conversation (4)</Label>
                    <p className="text-sm text-gray-500">Disoriented but communicates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="3" id="verbal-3" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="verbal-3">Inappropriate words (3)</Label>
                    <p className="text-sm text-gray-500">Random or exclamatory words</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="2" id="verbal-2" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="verbal-2">Incomprehensible sounds (2)</Label>
                    <p className="text-sm text-gray-500">Moans/groans, no words</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="1" id="verbal-1" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="verbal-1">No response (1)</Label>
                    <p className="text-sm text-gray-500">No verbal response</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* Motor Response */}
            <div>
              <h3 className="text-lg font-medium mb-3">Motor Response</h3>
              <RadioGroup 
                value={motorResponse.toString()} 
                onValueChange={(value) => setMotorResponse(parseInt(value))}
                className="space-y-2"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="6" id="motor-6" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="motor-6">Obeys commands (6)</Label>
                    <p className="text-sm text-gray-500">Follows simple commands</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="5" id="motor-5" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="motor-5">Localizes to pain (5)</Label>
                    <p className="text-sm text-gray-500">Moves toward painful stimulus</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="4" id="motor-4" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="motor-4">Withdraws from pain (4)</Label>
                    <p className="text-sm text-gray-500">Pulls away from painful stimulus</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="3" id="motor-3" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="motor-3">Abnormal flexion (3)</Label>
                    <p className="text-sm text-gray-500">Decorticate posturing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="2" id="motor-2" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="motor-2">Extension (2)</Label>
                    <p className="text-sm text-gray-500">Decerebrate posturing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="1" id="motor-1" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="motor-1">No response (1)</Label>
                    <p className="text-sm text-gray-500">No motor response</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GCS Results</CardTitle>
              <CardDescription>Assessment of consciousness level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">{totalScore}</div>
                <div className={`text-xl font-semibold ${severity.color}`}>
                  {severity.level} TBI
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span>Eye Response:</span>
                  <span className="font-semibold">{eyeResponse}/4</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span>Verbal Response:</span>
                  <span className="font-semibold">{verbalResponse}/5</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span>Motor Response:</span>
                  <span className="font-semibold">{motorResponse}/6</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="w-full">
                <Button className="w-full">Save Results</Button>
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md w-full text-sm">
                <p className="font-medium mb-1">Interpretation:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>13-15: Mild brain injury</li>
                  <li>9-12: Moderate brain injury</li>
                  <li>≤8: Severe brain injury</li>
                  <li>3: Deepest coma</li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GCSCalculator;
