
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const QRISKCalculator = () => {
  const { toast } = useToast();
  
  // Patient details
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>('');
  const [ethnicity, setEthnicity] = useState<string>('');
  const [smoker, setSmoker] = useState<string>('');
  const [diabetic, setDiabetic] = useState<boolean>(false);
  const [hasAtrialFibrillation, setHasAtrialFibrillation] = useState<boolean>(false);
  const [hasRenalDisease, setHasRenalDisease] = useState<boolean>(false);
  const [hasTreatedHypertension, setHasTreatedHypertension] = useState<boolean>(false);
  const [hasMigraines, setHasMigraines] = useState<boolean>(false);
  const [hasRheumatoidArthritis, setHasRheumatoidArthritis] = useState<boolean>(false);
  const [hasSystemicLupus, setHasSystemicLupus] = useState<boolean>(false);
  const [hasSevereMentalIllness, setHasSevereMentalIllness] = useState<boolean>(false);
  const [onBloodPressureTreatment, setOnBloodPressureTreatment] = useState<boolean>(false);
  
  // Clinical values
  const [systolicBP, setSystolicBP] = useState<number | undefined>(undefined);
  const [totalCholesterol, setTotalCholesterol] = useState<number | undefined>(undefined);
  const [hdlCholesterol, setHdlCholesterol] = useState<number | undefined>(undefined);
  const [bmi, setBmi] = useState<number | undefined>(undefined);
  
  // Results
  const [qriskScore, setQriskScore] = useState<number | null>(null);
  const [riskCategory, setRiskCategory] = useState<string | null>(null);
  const [heartAge, setHeartAge] = useState<number | null>(null);
  const [resultsVisible, setResultsVisible] = useState<boolean>(false);
  
  // Calculate QRISK score
  const calculateQRISK = () => {
    // Validate required fields
    if (!age || !gender || !systolicBP || !bmi) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields (age, gender, systolic BP, BMI).",
        variant: "destructive"
      });
      return;
    }
    
    // This is a simplified calculation for demonstration purposes only
    // In a real implementation, this would use the actual QRISK algorithm
    
    // Base risk based on age
    let baseRisk = age * 0.15;
    
    // Gender factor
    const genderFactor = gender === 'female' ? 0.7 : 1.0;
    
    // Risk factors
    const smokingFactor = smoker === 'never' ? 1.0 : smoker === 'ex' ? 1.3 : smoker === 'light' ? 1.5 : 2.0;
    const diabetesFactor = diabetic ? 1.8 : 1.0;
    const afFactor = hasAtrialFibrillation ? 1.5 : 1.0;
    const renalFactor = hasRenalDisease ? 1.7 : 1.0;
    const hyperFactor = hasTreatedHypertension ? 1.4 : 1.0;
    
    // BP factor
    const bpFactor = systolicBP > 160 ? 1.5 : systolicBP > 140 ? 1.2 : 1.0;
    
    // BMI factor
    const bmiFactor = bmi > 35 ? 1.6 : bmi > 30 ? 1.4 : bmi > 25 ? 1.2 : 1.0;
    
    // Calculate risk score (simplified)
    let risk = baseRisk * genderFactor * smokingFactor * diabetesFactor * afFactor * renalFactor * hyperFactor * bpFactor * bmiFactor;
    
    // Cap the risk at 99%
    risk = Math.min(risk, 99);
    risk = Math.max(risk, 0);
    
    // Calculate heart age (simplified)
    const heartAgeValue = Math.min(age + ((risk - (age * 0.15 * genderFactor)) / (0.15 * genderFactor)), 95);
    
    // Set risk category
    let category;
    if (risk < 10) {
      category = 'Low';
    } else if (risk < 20) {
      category = 'Moderate';
    } else {
      category = 'High';
    }
    
    // Set results
    setQriskScore(Math.round(risk * 10) / 10);
    setRiskCategory(category);
    setHeartAge(Math.round(heartAgeValue));
    setResultsVisible(true);
    
    toast({
      title: "QRISK Score Calculated",
      description: `Estimated 10-year risk: ${Math.round(risk * 10) / 10}% (${category} risk)`,
    });
  };
  
  // Reset form
  const resetForm = () => {
    setAge(undefined);
    setGender('');
    setEthnicity('');
    setSmoker('');
    setDiabetic(false);
    setHasAtrialFibrillation(false);
    setHasRenalDisease(false);
    setHasTreatedHypertension(false);
    setHasMigraines(false);
    setHasRheumatoidArthritis(false);
    setHasSystemicLupus(false);
    setHasSevereMentalIllness(false);
    setOnBloodPressureTreatment(false);
    setSystolicBP(undefined);
    setTotalCholesterol(undefined);
    setHdlCholesterol(undefined);
    setBmi(undefined);
    setQriskScore(null);
    setRiskCategory(null);
    setHeartAge(null);
    setResultsVisible(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Activity size={32} className="text-nhs-blue mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">QRISK3 Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400">Cardiovascular disease risk assessment</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About QRISK3</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            QRISK3 is a prediction algorithm for cardiovascular disease that uses traditional risk factors 
            (age, systolic blood pressure, smoking status and cholesterol) together with measures of social deprivation, 
            ethnicity, rheumatoid arthritis, chronic kidney disease, atrial fibrillation, diabetes, and antihypertensive treatment.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This is a simplified demonstration calculator and should not be used for actual clinical decision making.
              For accurate QRISK3 calculations, please use the <a href="https://qrisk.org" target="_blank" rel="noopener noreferrer" className="underline">official QRISK website</a>.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Enter patient details for QRISK3 calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (25-84 years) <span className="text-red-500">*</span></Label>
                  <Input
                    id="age"
                    type="number"
                    min="25"
                    max="84"
                    placeholder="e.g. 55"
                    value={age ?? ''}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
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
                      <SelectItem value="other_asian">Other Asian</SelectItem>
                      <SelectItem value="black_caribbean">Black Caribbean</SelectItem>
                      <SelectItem value="black_african">Black African</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smoker">Smoking Status</Label>
                  <Select value={smoker} onValueChange={setSmoker}>
                    <SelectTrigger id="smoker">
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Non-smoker</SelectItem>
                      <SelectItem value="ex">Ex-smoker</SelectItem>
                      <SelectItem value="light">Light smoker</SelectItem>
                      <SelectItem value="heavy">Heavy smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Clinical Measurements */}
              <div className="pt-2 border-t">
                <h3 className="font-medium mb-3">Clinical Measurements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic-bp">Systolic Blood Pressure (mmHg) <span className="text-red-500">*</span></Label>
                    <Input
                      id="systolic-bp"
                      type="number"
                      placeholder="e.g. 130"
                      value={systolicBP ?? ''}
                      onChange={(e) => setSystolicBP(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI (kg/m²) <span className="text-red-500">*</span></Label>
                    <Input
                      id="bmi"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 24.5"
                      value={bmi ?? ''}
                      onChange={(e) => setBmi(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="total-cholesterol">Total Cholesterol (mmol/L)</Label>
                    <Input
                      id="total-cholesterol"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 5.2"
                      value={totalCholesterol ?? ''}
                      onChange={(e) => setTotalCholesterol(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hdl-cholesterol">HDL Cholesterol (mmol/L)</Label>
                    <Input
                      id="hdl-cholesterol"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 1.2"
                      value={hdlCholesterol ?? ''}
                      onChange={(e) => setHdlCholesterol(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Medical Conditions */}
              <div className="pt-2 border-t">
                <h3 className="font-medium mb-3">Medical Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="diabetes" className="flex-1">Type 1 or Type 2 Diabetes</Label>
                    <Switch
                      id="diabetes"
                      checked={diabetic}
                      onCheckedChange={setDiabetic}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="atrial-fibrillation" className="flex-1">Atrial Fibrillation</Label>
                    <Switch
                      id="atrial-fibrillation"
                      checked={hasAtrialFibrillation}
                      onCheckedChange={setHasAtrialFibrillation}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="renal-disease" className="flex-1">Chronic Kidney Disease (stage 3-5)</Label>
                    <Switch
                      id="renal-disease"
                      checked={hasRenalDisease}
                      onCheckedChange={setHasRenalDisease}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="migraines" className="flex-1">Migraines</Label>
                    <Switch
                      id="migraines"
                      checked={hasMigraines}
                      onCheckedChange={setHasMigraines}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="rheumatoid-arthritis" className="flex-1">Rheumatoid Arthritis</Label>
                    <Switch
                      id="rheumatoid-arthritis"
                      checked={hasRheumatoidArthritis}
                      onCheckedChange={setHasRheumatoidArthritis}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="systemic-lupus" className="flex-1">Systemic Lupus Erythematosus (SLE)</Label>
                    <Switch
                      id="systemic-lupus"
                      checked={hasSystemicLupus}
                      onCheckedChange={setHasSystemicLupus}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="hypertension" className="flex-1">Treated Hypertension</Label>
                    <Switch
                      id="hypertension"
                      checked={hasTreatedHypertension}
                      onCheckedChange={setHasTreatedHypertension}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="mental-illness" className="flex-1">Severe Mental Illness</Label>
                    <Switch
                      id="mental-illness"
                      checked={hasSevereMentalIllness}
                      onCheckedChange={setHasSevereMentalIllness}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button onClick={calculateQRISK}>Calculate QRISK3</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Results Area */}
        <div className="lg:col-span-1">
          <Card className={resultsVisible ? "border-2 border-nhs-blue" : ""}>
            <CardHeader>
              <CardTitle>QRISK3 Results</CardTitle>
              <CardDescription>10-year cardiovascular risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {resultsVisible ? (
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <div className="text-6xl font-bold mb-2 text-nhs-blue">{qriskScore}%</div>
                    <div className="text-xl font-medium">
                      <span className={`
                        ${riskCategory === 'Low' ? 'text-green-600 dark:text-green-400' : ''}
                        ${riskCategory === 'Moderate' ? 'text-amber-600 dark:text-amber-400' : ''}
                        ${riskCategory === 'High' ? 'text-red-600 dark:text-red-400' : ''}
                      `}>
                        {riskCategory} Risk
                      </span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Estimated Heart Age</p>
                      <p className="text-2xl font-medium">{heartAge} years</p>
                    </div>
                  </div>
                  
                  <Alert className={`
                    ${riskCategory === 'Low' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}
                    ${riskCategory === 'Moderate' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' : ''}
                    ${riskCategory === 'High' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' : ''}
                  `}>
                    <AlertCircle className={`
                      h-4 w-4
                      ${riskCategory === 'Low' ? 'text-green-600 dark:text-green-400' : ''}
                      ${riskCategory === 'Moderate' ? 'text-amber-600 dark:text-amber-400' : ''}
                      ${riskCategory === 'High' ? 'text-red-600 dark:text-red-400' : ''}
                    `} />
                    <AlertTitle>Clinical Interpretation</AlertTitle>
                    <AlertDescription>
                      {riskCategory === 'Low' && "Low risk: Below 10% risk of cardiovascular disease in the next 10 years."}
                      {riskCategory === 'Moderate' && "Moderate risk: 10-20% risk of cardiovascular disease in the next 10 years. Consider further assessment."}
                      {riskCategory === 'High' && "High risk: Above 20% risk of cardiovascular disease in the next 10 years. Consider intervention."}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Activity className="mb-2" size={32} />
                  <p>Enter patient information and click Calculate to assess cardiovascular risk.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Understanding QRISK3</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p>
                QRISK3 is a cardiovascular disease risk calculator that estimates the risk of having a heart attack 
                or stroke within the next 10 years.
              </p>
              <p>
                <strong>Risk Interpretation:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><span className="text-green-600 dark:text-green-400 font-medium">Low:</span> &lt;10% 10-year risk</li>
                <li><span className="text-amber-600 dark:text-amber-400 font-medium">Moderate:</span> 10-20% 10-year risk</li>
                <li><span className="text-red-600 dark:text-red-400 font-medium">High:</span> &gt;20% 10-year risk</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRISKCalculator;
