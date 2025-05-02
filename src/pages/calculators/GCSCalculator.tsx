
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GCSCalculator = () => {
  const navigate = useNavigate();
  const [patientType, setPatientType] = useState<"adult" | "pediatric">("adult");
  const [eyeScore, setEyeScore] = useState<number>(4);
  const [verbalScore, setVerbalScore] = useState<number>(5);
  const [motorScore, setMotorScore] = useState<number>(6);
  const [totalScore, setTotalScore] = useState<number>(15);
  
  // Update total score whenever individual scores change
  useEffect(() => {
    setTotalScore(eyeScore + verbalScore + motorScore);
  }, [eyeScore, verbalScore, motorScore]);
  
  // Eye opening responses
  const eyeResponses = [
    { score: 4, adult: "Spontaneous", pediatric: "Spontaneous" },
    { score: 3, adult: "To voice", pediatric: "To voice" },
    { score: 2, adult: "To pain", pediatric: "To pain" },
    { score: 1, adult: "None", pediatric: "None" }
  ];
  
  // Verbal responses
  const verbalResponses = [
    { score: 5, adult: "Oriented", pediatric: "Appropriate words/social smile" },
    { score: 4, adult: "Confused", pediatric: "Cries but consolable" },
    { score: 3, adult: "Inappropriate words", pediatric: "Inappropriate crying/screaming" },
    { score: 2, adult: "Incomprehensible sounds", pediatric: "Grunts/moans" },
    { score: 1, adult: "None", pediatric: "None" }
  ];
  
  // Motor responses
  const motorResponses = [
    { score: 6, adult: "Obeys commands", pediatric: "Normal spontaneous movement" },
    { score: 5, adult: "Localizing pain", pediatric: "Withdraws to touch" },
    { score: 4, adult: "Withdrawal from pain", pediatric: "Withdraws to pain" },
    { score: 3, adult: "Abnormal flexion", pediatric: "Abnormal flexion" },
    { score: 2, adult: "Abnormal extension", pediatric: "Abnormal extension" },
    { score: 1, adult: "None", pediatric: "None" }
  ];
  
  // Determine severity based on GCS score
  const getSeverity = () => {
    if (totalScore >= 13) return { level: "Mild", color: "text-green-600 dark:text-green-400" };
    if (totalScore >= 9) return { level: "Moderate", color: "text-amber-600 dark:text-amber-400" };
    return { level: "Severe", color: "text-red-600 dark:text-red-400" };
  };
  
  const severity = getSeverity();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/calculators')} className="mr-2">
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
            <CardDescription>Select the appropriate responses for each parameter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="adult" onValueChange={(value) => setPatientType(value as "adult" | "pediatric")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="adult">Adult</TabsTrigger>
                <TabsTrigger value="pediatric">Pediatric</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Eye Opening Response */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Eye Opening (E)</h3>
              <RadioGroup 
                value={eyeScore.toString()} 
                onValueChange={(value) => setEyeScore(parseInt(value))}
                className="space-y-2"
              >
                {eyeResponses.map((response) => (
                  <div key={`eye-${response.score}`} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <RadioGroupItem value={response.score.toString()} id={`eye-${response.score}`} />
                    <Label htmlFor={`eye-${response.score}`} className="flex items-center justify-between w-full">
                      <span>{patientType === "adult" ? response.adult : response.pediatric}</span>
                      <span className="text-gray-500">{response.score}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Verbal Response */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Verbal Response (V)</h3>
              <RadioGroup 
                value={verbalScore.toString()} 
                onValueChange={(value) => setVerbalScore(parseInt(value))}
                className="space-y-2"
              >
                {verbalResponses.map((response) => (
                  <div key={`verbal-${response.score}`} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <RadioGroupItem value={response.score.toString()} id={`verbal-${response.score}`} />
                    <Label htmlFor={`verbal-${response.score}`} className="flex items-center justify-between w-full">
                      <span>{patientType === "adult" ? response.adult : response.pediatric}</span>
                      <span className="text-gray-500">{response.score}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Motor Response */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Motor Response (M)</h3>
              <RadioGroup 
                value={motorScore.toString()} 
                onValueChange={(value) => setMotorScore(parseInt(value))}
                className="space-y-2"
              >
                {motorResponses.map((response) => (
                  <div key={`motor-${response.score}`} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <RadioGroupItem value={response.score.toString()} id={`motor-${response.score}`} />
                    <Label htmlFor={`motor-${response.score}`} className="flex items-center justify-between w-full">
                      <span>{patientType === "adult" ? response.adult : response.pediatric}</span>
                      <span className="text-gray-500">{response.score}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GCS Score Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-6xl font-bold mb-2">{totalScore}</div>
                <div className={`text-xl font-semibold ${severity.color}`}>
                  {severity.level} Brain Injury
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-xl font-bold">E{eyeScore}</div>
                    <div className="text-xs">Eye</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-xl font-bold">V{verbalScore}</div>
                    <div className="text-xs">Verbal</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-xl font-bold">M{motorScore}</div>
                    <div className="text-xs">Motor</div>
                  </div>
                </div>
                
                {totalScore <= 8 && (
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md text-sm">
                    <p className="font-medium">Critical Warning:</p>
                    <p>Score ≤8 indicates coma. Consider airway protection.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="w-full" onClick={() => {
                  setEyeScore(4);
                  setVerbalScore(5);
                  setMotorScore(6);
                }}>
                  Reset
                </Button>
                <Button className="w-full">Save</Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Severity Classification</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>GCS 13-15:</span>
                <span className="text-green-600 dark:text-green-400">Mild Brain Injury</span>
              </div>
              <div className="flex justify-between">
                <span>GCS 9-12:</span>
                <span className="text-amber-600 dark:text-amber-400">Moderate Brain Injury</span>
              </div>
              <div className="flex justify-between">
                <span>GCS 3-8:</span>
                <span className="text-red-600 dark:text-red-400">Severe Brain Injury</span>
              </div>
              <div className="pt-2">
                <p><span className="font-semibold">Note:</span> Record individual component scores (E+V+M) in addition to the total GCS score.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GCSCalculator;
