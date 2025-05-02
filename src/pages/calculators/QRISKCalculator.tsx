
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const QRISKCalculator = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnicity, setEthnicity] = useState("white");
  const [smokerStatus, setSmokerStatus] = useState("non");
  const [systolicBP, setSystolicBP] = useState("");
  const [totalCholesterol, setTotalCholesterol] = useState("");
  const [hdlCholesterol, setHDLCholesterol] = useState("");
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [riskResult, setRiskResult] = useState<number | null>(null);
  
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
  
  const handleRiskFactorChange = (value: string) => {
    setRiskFactors(current =>
      current.includes(value)
        ? current.filter(factor => factor !== value)
        : [...current, value]
    );
  };
  
  const calculateRisk = () => {
    // This is a simplified calculation and not the actual QRISK3 algorithm
    // For demonstration purposes only
    const baseRisk = parseInt(age) / 10;
    
    // Add risk for being male (simplified factor)
    let totalRisk = baseRisk;
    if (sex === 'male') totalRisk += 2;
    
    // Add risk for smoking
    if (smokerStatus === 'light') totalRisk += 3;
    if (smokerStatus === 'moderate') totalRisk += 5;
    if (smokerStatus === 'heavy') totalRisk += 8;
    
    // Add risk for high blood pressure
    const sysBP = parseInt(systolicBP);
    if (sysBP > 140) totalRisk += (sysBP - 140) / 10;
    
    // Add risk for cholesterol ratio
    const cholRatio = parseFloat(totalCholesterol) / parseFloat(hdlCholesterol);
    if (cholRatio > 4) totalRisk += (cholRatio - 4) * 2;
    
    // Add risk for comorbidities
    totalRisk += riskFactors.length * 2;
    
    // Cap at 99%
    totalRisk = Math.min(Math.max(totalRisk, 1), 99);
    
    setRiskResult(Math.round(totalRisk));
  };
  
  const getRiskCategory = () => {
    if (!riskResult) return { level: "", color: "" };
    
    if (riskResult < 10) 
      return { level: "Low Risk", color: "text-green-600 dark:text-green-400" };
    if (riskResult < 20) 
      return { level: "Moderate Risk", color: "text-amber-600 dark:text-amber-400" };
    return { level: "High Risk", color: "text-red-600 dark:text-red-400" };
  };
  
  const riskCategory = getRiskCategory();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBackClick} className="mr-2">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-nhs-dark-blue dark:text-white flex items-center">
          <Activity className="mr-2" /> QRISK3 Calculator
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Enter details to calculate cardiovascular risk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="25-84" 
                  min="25"
                  max="84"
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                />
              </div>
              <div>
                <Label>Sex</Label>
                <RadioGroup 
                  value={sex} 
                  onValueChange={setSex}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div>
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Select value={ethnicity} onValueChange={setEthnicity}>
                <SelectTrigger id="ethnicity">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="pakistani">Pakistani</SelectItem>
                  <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                  <SelectItem value="black_caribbean">Black Caribbean</SelectItem>
                  <SelectItem value="black_african">Black African</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="other_asian">Other Asian</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="smoker">Smoking Status</Label>
              <Select value={smokerStatus} onValueChange={setSmokerStatus}>
                <SelectTrigger id="smoker">
                  <SelectValue placeholder="Select smoking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non">Non-smoker</SelectItem>
                  <SelectItem value="ex">Ex-smoker</SelectItem>
                  <SelectItem value="light">Light smoker (≤10/day)</SelectItem>
                  <SelectItem value="moderate">Moderate smoker (11-19/day)</SelectItem>
                  <SelectItem value="heavy">Heavy smoker (≥20/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                <Input 
                  id="systolicBP" 
                  type="number" 
                  placeholder="e.g. 120" 
                  value={systolicBP} 
                  onChange={(e) => setSystolicBP(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="totalChol">Total Cholesterol (mmol/L)</Label>
                <Input 
                  id="totalChol" 
                  type="number" 
                  step="0.1"
                  placeholder="e.g. 5.2" 
                  value={totalCholesterol} 
                  onChange={(e) => setTotalCholesterol(e.target.value)} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="hdlChol">HDL Cholesterol (mmol/L)</Label>
              <Input 
                id="hdlChol" 
                type="number" 
                step="0.1"
                placeholder="e.g. 1.2" 
                value={hdlCholesterol} 
                onChange={(e) => setHDLCholesterol(e.target.value)} 
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Medical Conditions</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "diabetes", label: "Diabetes" },
                  { id: "af", label: "Atrial Fibrillation" },
                  { id: "rheumatoid", label: "Rheumatoid Arthritis" },
                  { id: "ckd", label: "Chronic Kidney Disease" },
                  { id: "hypertension", label: "Treated Hypertension" },
                  { id: "migraines", label: "Migraines" },
                ].map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={item.id} 
                      checked={riskFactors.includes(item.id)}
                      onCheckedChange={() => handleRiskFactorChange(item.id)}
                    />
                    <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={calculateRisk}
              className="w-full mt-2" 
              disabled={!age || !sex || !systolicBP || !totalCholesterol || !hdlCholesterol}
            >
              Calculate QRISK3 Score
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>10-Year CVD Risk</CardTitle>
              <CardDescription>Probability of cardiovascular disease in next 10 years</CardDescription>
            </CardHeader>
            <CardContent>
              {riskResult !== null ? (
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-6xl font-bold mb-2">{riskResult}%</div>
                    <div className={`text-xl font-semibold ${riskCategory.color}`}>
                      {riskCategory.level}
                    </div>
                  </div>
                  
                  <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        riskResult < 10 
                          ? 'bg-green-500' 
                          : riskResult < 20 
                            ? 'bg-amber-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(riskResult, 100)}%` }}
                    />
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-left">
                    <h3 className="font-medium mb-2">Interpretation:</h3>
                    {riskResult < 10 && (
                      <p>Low risk. General lifestyle advice recommended.</p>
                    )}
                    {riskResult >= 10 && riskResult < 20 && (
                      <p>Moderate risk. Consider lifestyle modifications and monitor regularly.</p>
                    )}
                    {riskResult >= 20 && (
                      <p>High risk. Consider intensive lifestyle interventions and preventative medication.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-gray-500 mb-2">Complete the form and click Calculate</p>
                  <p className="text-sm text-gray-400">Risk estimation will appear here</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={riskResult === null}>Save to Patient Record</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">About QRISK3</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                QRISK3 is a prediction algorithm for cardiovascular disease that uses traditional risk factors 
                (age, systolic blood pressure, smoking status and ratio of total serum cholesterol to high density 
                lipoprotein cholesterol) together with measures of social deprivation, ethnicity, and several 
                other clinical variables.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This is a simplified version for demonstration purposes only. The actual QRISK3 algorithm considers 
                additional factors and should be used for clinical decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRISKCalculator;
