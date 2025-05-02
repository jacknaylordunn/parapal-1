
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Heart, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { calculateNEWS2 } from '@/lib/clinical-utils';

const NEWS2Calculator = () => {
  const { toast } = useToast();
  
  // State for vital signs
  const [respiratoryRate, setRespiratoryRate] = useState<number | undefined>(undefined);
  const [oxygenSaturation, setOxygenSaturation] = useState<number | undefined>(undefined);
  const [isOnOxygen, setIsOnOxygen] = useState<boolean>(false);
  const [systolicBP, setSystolicBP] = useState<number | undefined>(undefined);
  const [heartRate, setHeartRate] = useState<number | undefined>(undefined);
  const [consciousness, setConsciousness] = useState<string>('A');
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  
  // State for results
  const [newsScore, setNewsScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [scoresVisible, setScoresVisible] = useState<boolean>(false);
  
  // Calculate the NEWS2 score
  const calculateScore = () => {
    // Validate inputs first
    if (respiratoryRate === undefined || 
        oxygenSaturation === undefined ||
        systolicBP === undefined ||
        heartRate === undefined ||
        temperature === undefined ||
        consciousness === undefined) {
          
      toast({
        title: "Missing Values",
        description: "Please complete all fields to calculate the NEWS2 score.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate the score
    const result = calculateNEWS2(
      respiratoryRate,
      oxygenSaturation,
      isOnOxygen,
      systolicBP,
      heartRate,
      consciousness,
      temperature
    );
    
    setNewsScore(result.score);
    setRiskLevel(result.riskLevel);
    setScoresVisible(true);
    
    toast({
      title: "NEWS2 Score Calculated",
      description: `The patient's NEWS2 score is ${result.score} (${result.riskLevel} risk).`,
      variant: "default"
    });
  };
  
  // Reset all values
  const resetForm = () => {
    setRespiratoryRate(undefined);
    setOxygenSaturation(undefined);
    setIsOnOxygen(false);
    setSystolicBP(undefined);
    setHeartRate(undefined);
    setConsciousness('A');
    setTemperature(undefined);
    setNewsScore(null);
    setRiskLevel(null);
    setScoresVisible(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Heart size={32} className="text-nhs-red mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">NEWS2 Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400">National Early Warning Score 2</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Observations</CardTitle>
              <CardDescription>Enter the patient's vital signs below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Respiratory Rate */}
                <div className="space-y-2">
                  <Label htmlFor="respiratory-rate">Respiratory Rate (breaths/min)</Label>
                  <Input
                    id="respiratory-rate"
                    type="number"
                    placeholder="e.g. 18"
                    value={respiratoryRate ?? ''}
                    onChange={(e) => setRespiratoryRate(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <div className="text-xs text-gray-500">Normal range: 12-20</div>
                </div>
                
                {/* Oxygen Saturation */}
                <div className="space-y-2">
                  <Label htmlFor="oxygen-saturation">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygen-saturation"
                    type="number"
                    placeholder="e.g. 98"
                    value={oxygenSaturation ?? ''}
                    onChange={(e) => setOxygenSaturation(e.target.value ? Number(e.target.value) : undefined)}
                    max="100"
                  />
                  <div className="text-xs text-gray-500">Normal range: 94-98%</div>
                </div>
                
                {/* Supplemental Oxygen */}
                <div className="space-y-2">
                  <Label htmlFor="is-on-oxygen">On Supplemental Oxygen?</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="is-on-oxygen"
                      checked={isOnOxygen}
                      onCheckedChange={setIsOnOxygen}
                    />
                    <Label htmlFor="is-on-oxygen" className="cursor-pointer">
                      {isOnOxygen ? 'Yes' : 'No'}
                    </Label>
                  </div>
                </div>
                
                {/* Systolic BP */}
                <div className="space-y-2">
                  <Label htmlFor="systolic-bp">Systolic Blood Pressure (mmHg)</Label>
                  <Input
                    id="systolic-bp"
                    type="number"
                    placeholder="e.g. 120"
                    value={systolicBP ?? ''}
                    onChange={(e) => setSystolicBP(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <div className="text-xs text-gray-500">Normal range: 111-219</div>
                </div>
                
                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label htmlFor="heart-rate">Heart Rate (beats/min)</Label>
                  <Input
                    id="heart-rate"
                    type="number"
                    placeholder="e.g. 78"
                    value={heartRate ?? ''}
                    onChange={(e) => setHeartRate(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <div className="text-xs text-gray-500">Normal range: 51-90</div>
                </div>
                
                {/* Consciousness */}
                <div className="space-y-2">
                  <Label htmlFor="consciousness">Level of Consciousness (AVPU)</Label>
                  <RadioGroup 
                    id="consciousness" 
                    value={consciousness} 
                    onValueChange={setConsciousness}
                    className="flex space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="A" id="consciousness-a" />
                      <Label htmlFor="consciousness-a">Alert</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="V" id="consciousness-v" />
                      <Label htmlFor="consciousness-v">Voice</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="P" id="consciousness-p" />
                      <Label htmlFor="consciousness-p">Pain</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="U" id="consciousness-u" />
                      <Label htmlFor="consciousness-u">Unresponsive</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 37.0"
                    value={temperature ?? ''}
                    onChange={(e) => setTemperature(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <div className="text-xs text-gray-500">Normal range: 36.1-38.0</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button onClick={calculateScore}>Calculate NEWS2 Score</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          {/* Results Card */}
          <Card className={scoresVisible ? 'border-2 border-nhs-blue' : ''}>
            <CardHeader>
              <CardTitle>NEWS2 Score Results</CardTitle>
              <CardDescription>Clinical risk assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {scoresVisible ? (
                <>
                  <div className="text-center py-4">
                    <div className="text-6xl font-bold mb-2 text-nhs-blue">{newsScore}</div>
                    <div className="text-xl font-medium">
                      {riskLevel === 'Low' && <span className="text-green-600 dark:text-green-400">Low Risk</span>}
                      {riskLevel === 'Medium' && <span className="text-amber-600 dark:text-amber-400">Medium Risk</span>}
                      {riskLevel === 'High' && <span className="text-red-600 dark:text-red-400">High Risk</span>}
                    </div>
                  </div>
                  
                  <Alert className={`
                    ${riskLevel === 'Low' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}
                    ${riskLevel === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' : ''}
                    ${riskLevel === 'High' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' : ''}
                  `}>
                    <AlertCircle className={`
                      h-4 w-4
                      ${riskLevel === 'Low' ? 'text-green-600 dark:text-green-400' : ''}
                      ${riskLevel === 'Medium' ? 'text-amber-600 dark:text-amber-400' : ''}
                      ${riskLevel === 'High' ? 'text-red-600 dark:text-red-400' : ''}
                    `} />
                    <AlertTitle>Clinical Response</AlertTitle>
                    <AlertDescription>
                      {riskLevel === 'Low' && "Routine monitoring. Continue usual observation frequency."}
                      {riskLevel === 'Medium' && "Urgent clinical review needed. Increase observation frequency."}
                      {riskLevel === 'High' && "Emergency assessment required. Consider transfer to higher level of care."}
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Enter patient observations and click Calculate to see results.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">About NEWS2</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>The National Early Warning Score 2 (NEWS2) is the latest version of the National Early Warning Score (NEWS), first produced in 2012 and updated in 2017. It is a tool developed by the Royal College of Physicians to improve the detection and response to clinical deterioration in patients with acute illness.</p>
              <div className="mt-4">
                <a 
                  href="https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nhs-blue hover:underline flex items-center"
                >
                  RCP NEWS2 Guidelines <Check size={16} className="ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NEWS2Calculator;
