
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const QRISKCalculator = () => {
  const navigate = useNavigate();
  
  // Patient details
  const [age, setAge] = useState<number>(55);
  const [sex, setSex] = useState<string>("male");
  const [ethnicity, setEthnicity] = useState<string>("white");
  
  // Risk factors
  const [smoker, setSmoker] = useState<string>("non");
  const [systolicBP, setSystolicBP] = useState<number>(130);
  const [totalCholesterol, setTotalCholesterol] = useState<number>(5.0);
  const [hdlCholesterol, setHDLCholesterol] = useState<number>(1.2);
  
  // Medical history
  const [diabetes, setDiabetes] = useState<boolean>(false);
  const [familyHistory, setFamilyHistory] = useState<boolean>(false);
  const [chronicKidneyDisease, setChronicKidneyDisease] = useState<boolean>(false);
  const [atrialFibrillation, setAtrialFibrillation] = useState<boolean>(false);
  const [onBloodPressureTreatment, setOnBloodPressureTreatment] = useState<boolean>(false);
  const [rheumatoidArthritis, setRheumatoidArthritis] = useState<boolean>(false);
  
  // Simple mock calculation for demonstration
  // In a real app, this would use the actual QRISK3 algorithm
  const calculateRisk = () => {
    // This is a very simplified approximation for demonstration only
    let baseRisk = (age - 40) * 0.5; // Age-based baseline
    
    if (baseRisk < 0) baseRisk = 0;
    
    // Add risk factors
    if (sex === "male") baseRisk += 3;
    if (smoker === "current") baseRisk += 5;
    else if (smoker === "ex") baseRisk += 2;
    
    // Blood pressure risk
    const bpRisk = (systolicBP - 120) * 0.05;
    if (bpRisk > 0) baseRisk += bpRisk;
    
    // Cholesterol ratio
    const cholesterolRatio = totalCholesterol / hdlCholesterol;
    if (cholesterolRatio > 4) {
      baseRisk += (cholesterolRatio - 4) * 2;
    }
    
    // Medical conditions
    if (diabetes) baseRisk += 4;
    if (familyHistory) baseRisk += 3;
    if (chronicKidneyDisease) baseRisk += 3;
    if (atrialFibrillation) baseRisk += 5;
    if (onBloodPressureTreatment) baseRisk += 2;
    if (rheumatoidArthritis) baseRisk += 1.5;
    
    // Ethnicity adjustments (simplified)
    if (ethnicity === "southAsian") baseRisk *= 1.4;
    else if (ethnicity === "black") baseRisk *= 0.85;
    
    // Cap at 99%
    return Math.min(Math.round(baseRisk), 99);
  };
  
  const riskScore = calculateRisk();
  
  // Get risk category and color
  const getRiskCategory = (score: number) => {
    if (score < 10) return { category: "Low", color: "text-green-600 dark:text-green-400" };
    if (score < 20) return { category: "Moderate", color: "text-amber-600 dark:text-amber-400" };
    return { category: "High", color: "text-red-600 dark:text-red-400" };
  };
  
  const riskCategory = getRiskCategory(riskScore);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/calculators')} className="mr-2">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-nhs-dark-blue dark:text-white flex items-center">
          <Activity className="mr-2" /> QRISK3 Calculator
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>Basic patient information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    min="25"
                    max="84"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valid for ages 25-84</p>
                </div>
                
                <div>
                  <Label>Sex</Label>
                  <RadioGroup
                    value={sex}
                    onValueChange={setSex}
                    className="flex space-x-4 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="sex-male" />
                      <Label htmlFor="sex-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="sex-female" />
                      <Label htmlFor="sex-female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div>
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <select 
                  id="ethnicity"
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1 dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="white">White</option>
                  <option value="southAsian">South Asian</option>
                  <option value="black">Black</option>
                  <option value="chinese">Chinese</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
              <CardDescription>Clinical measurements and lifestyle factors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Smoking Status</Label>
                <RadioGroup
                  value={smoker}
                  onValueChange={setSmoker}
                  className="mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non" id="smoke-non" />
                    <Label htmlFor="smoke-non">Non-smoker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ex" id="smoke-ex" />
                    <Label htmlFor="smoke-ex">Ex-smoker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current" id="smoke-current" />
                    <Label htmlFor="smoke-current">Current smoker</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="systolic-bp">Systolic Blood Pressure (mmHg)</Label>
                  <span className="font-bold">{systolicBP}</span>
                </div>
                <Slider
                  id="systolic-bp"
                  defaultValue={[130]}
                  min={90}
                  max={200}
                  step={1}
                  onValueChange={(values) => setSystolicBP(values[0])}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total-cholesterol">Total Cholesterol (mmol/L)</Label>
                  <Input
                    id="total-cholesterol"
                    type="number"
                    value={totalCholesterol}
                    onChange={(e) => setTotalCholesterol(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="2"
                    max="15"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="hdl-cholesterol">HDL Cholesterol (mmol/L)</Label>
                  <Input
                    id="hdl-cholesterol"
                    type="number"
                    value={hdlCholesterol}
                    onChange={(e) => setHDLCholesterol(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="0.5"
                    max="5"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Pre-existing conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="diabetes" 
                    checked={diabetes} 
                    onCheckedChange={(checked) => setDiabetes(checked === true)}
                  />
                  <Label htmlFor="diabetes">Type 1 or Type 2 Diabetes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="family-history" 
                    checked={familyHistory} 
                    onCheckedChange={(checked) => setFamilyHistory(checked === true)}
                  />
                  <Label htmlFor="family-history">Family history of coronary heart disease</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ckd" 
                    checked={chronicKidneyDisease} 
                    onCheckedChange={(checked) => setChronicKidneyDisease(checked === true)}
                  />
                  <Label htmlFor="ckd">Chronic kidney disease (stage 3, 4, or 5)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="afib" 
                    checked={atrialFibrillation} 
                    onCheckedChange={(checked) => setAtrialFibrillation(checked === true)}
                  />
                  <Label htmlFor="afib">Atrial fibrillation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bp-treatment" 
                    checked={onBloodPressureTreatment} 
                    onCheckedChange={(checked) => setOnBloodPressureTreatment(checked === true)}
                  />
                  <Label htmlFor="bp-treatment">On blood pressure treatment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rheumatoid" 
                    checked={rheumatoidArthritis} 
                    onCheckedChange={(checked) => setRheumatoidArthritis(checked === true)}
                  />
                  <Label htmlFor="rheumatoid">Rheumatoid arthritis</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QRISK3 Results</CardTitle>
              <CardDescription>10-year risk of heart attack or stroke</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="inline-flex justify-center items-center h-36 w-36 rounded-full bg-gray-50 dark:bg-gray-800">
                  <div className={`text-4xl font-bold ${riskCategory.color}`}>{riskScore}%</div>
                </div>
                <div className={`mt-3 text-xl font-semibold ${riskCategory.color}`}>
                  {riskCategory.category} Risk
                </div>
              </div>
              
              <div className="space-y-4">
                {riskScore >= 10 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                    <p className="font-medium">Recommendation:</p>
                    <p className="text-sm">Consider statin therapy for primary prevention.</p>
                  </div>
                )}
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                  <p><span className="font-medium">Note:</span> This is a simplified calculation for educational purposes only. For clinical use, please refer to the official QRISK3 calculator.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Assessment</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Risk Categories</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Less than 10%:</span>
                <span className="text-green-600 dark:text-green-400">Low Risk</span>
              </div>
              <div className="flex justify-between">
                <span>10% to 19%:</span>
                <span className="text-amber-600 dark:text-amber-400">Moderate Risk</span>
              </div>
              <div className="flex justify-between">
                <span>20% or higher:</span>
                <span className="text-red-600 dark:text-red-400">High Risk</span>
              </div>
              <div className="pt-2">
                <p>NICE recommends offering statins for primary prevention to people with a QRISK3 score of 10% or higher.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRISKCalculator;
