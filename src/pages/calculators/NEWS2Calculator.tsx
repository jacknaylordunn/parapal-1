
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { calculateNEWS2Score } from "../../lib/clinical-calculations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

// Define the vital sign parameters with their scoring options
const vitalSigns = [
  {
    name: "respiratoryRate",
    label: "Respiratory Rate",
    options: [
      { value: 0, label: "12-20" },
      { value: 1, label: "9-11" },
      { value: 2, label: "21-24" },
      { value: 3, label: "≤8 or ≥25" }
    ]
  },
  {
    name: "oxygenSaturation",
    label: "Oxygen Saturation",
    options: [
      { value: 0, label: "≥96%" },
      { value: 1, label: "94-95%" },
      { value: 2, label: "92-93%" },
      { value: 3, label: "<92%" }
    ]
  },
  {
    name: "supplementalOxygen",
    label: "Supplemental Oxygen",
    options: [
      { value: 0, label: "No" },
      { value: 2, label: "Yes" }
    ]
  },
  {
    name: "systolicBP",
    label: "Systolic Blood Pressure",
    options: [
      { value: 0, label: "111-219" },
      { value: 1, label: "101-110" },
      { value: 2, label: "91-100" },
      { value: 3, label: "≤90 or ≥220" }
    ]
  },
  {
    name: "heartRate",
    label: "Heart Rate",
    options: [
      { value: 0, label: "51-90" },
      { value: 1, label: "41-50 or 91-110" },
      { value: 2, label: "111-130" },
      { value: 3, label: "≤40 or ≥131" }
    ]
  },
  {
    name: "consciousness",
    label: "Consciousness",
    options: [
      { value: 0, label: "Alert" },
      { value: 3, label: "Confused/Agitated/Pain/Unresponsive" }
    ]
  },
  {
    name: "temperature",
    label: "Temperature",
    options: [
      { value: 0, label: "36.1-38.0" },
      { value: 1, label: "35.1-36.0 or 38.1-39.0" },
      { value: 2, label: "≥39.1" },
      { value: 3, label: "≤35.0" }
    ]
  }
];

const NEWS2Calculator = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    respiratoryRate: 0,
    oxygenSaturation: 0,
    supplementalOxygen: 0,
    systolicBP: 0,
    heartRate: 0,
    consciousness: 0,
    temperature: 0
  });
  
  // Update score for a specific vital sign
  const handleScoreChange = (vitalSign: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [vitalSign]: value
    }));
  };
  
  // Calculate the total NEWS2 score
  const calculateTotalScore = () => {
    return Object.values(scores).reduce((total, score) => total + score, 0);
  };
  
  // Determine clinical risk based on NEWS2 score
  const determineRiskLevel = (totalScore: number) => {
    if (totalScore === 0) return { level: "Low", color: "text-green-600 dark:text-green-400", action: "Routine monitoring" };
    if (totalScore <= 4) return { level: "Low", color: "text-green-600 dark:text-green-400", action: "Routine monitoring" };
    if (totalScore <= 6) return { level: "Medium", color: "text-amber-600 dark:text-amber-400", action: "Urgent assessment required" };
    return { level: "High", color: "text-red-600 dark:text-red-400", action: "Emergency assessment required" };
  };
  
  const totalScore = calculateTotalScore();
  const riskLevel = determineRiskLevel(totalScore);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/calculators')} className="mr-2">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-nhs-dark-blue dark:text-white flex items-center">
          <Heart className="mr-2" /> NEWS2 Score Calculator
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vital Signs Assessment</CardTitle>
            <CardDescription>Select the appropriate value for each parameter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vitalSigns.map((vitalSign) => (
              <div key={vitalSign.name} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{vitalSign.label}</h3>
                <RadioGroup 
                  value={scores[vitalSign.name as keyof typeof scores].toString()}
                  onValueChange={(value) => handleScoreChange(vitalSign.name, parseInt(value))}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
                >
                  {vitalSign.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.value.toString()} 
                        id={`${vitalSign.name}-${option.value}`}
                      />
                      <Label 
                        htmlFor={`${vitalSign.name}-${option.value}`}
                        className="cursor-pointer flex items-center"
                      >
                        <span className="mr-2">{option.label}</span>
                        <span className="text-gray-500 text-xs">[{option.value}]</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NEWS2 Score Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-6xl font-bold mb-2">{totalScore}</div>
                <div className={`text-xl font-semibold ${riskLevel.color}`}>
                  {riskLevel.level} Risk
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Clinical Response:</h3>
                <p className={`p-2 rounded-md bg-gray-50 dark:bg-gray-800`}>
                  {riskLevel.action}
                </p>
                
                {totalScore >= 5 && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
                    <p className="font-medium">Warning:</p>
                    <p className="text-sm">Score ≥5 requires urgent clinical assessment</p>
                  </div>
                )}
                
                {scores.consciousness === 3 && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-md">
                    <p className="text-sm">Any score of 3 in a single parameter requires urgent clinical assessment</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="w-full" onClick={() => setScores({
                  respiratoryRate: 0,
                  oxygenSaturation: 0,
                  supplementalOxygen: 0,
                  systolicBP: 0,
                  heartRate: 0,
                  consciousness: 0,
                  temperature: 0
                })}>
                  Reset
                </Button>
                <Button className="w-full">Save</Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">NEWS2 Risk Levels</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Score 0:</span>
                <span className="text-green-600 dark:text-green-400">Low Risk</span>
              </div>
              <div className="flex justify-between">
                <span>Score 1-4:</span>
                <span className="text-green-600 dark:text-green-400">Low Risk</span>
              </div>
              <div className="flex justify-between">
                <span>Score 5-6:</span>
                <span className="text-amber-600 dark:text-amber-400">Medium Risk</span>
              </div>
              <div className="flex justify-between">
                <span>Score 7+:</span>
                <span className="text-red-600 dark:text-red-400">High Risk</span>
              </div>
              <div className="flex justify-between">
                <span>Score 3 in any parameter:</span>
                <span className="text-amber-600 dark:text-amber-400">Medium Risk</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NEWS2Calculator;
