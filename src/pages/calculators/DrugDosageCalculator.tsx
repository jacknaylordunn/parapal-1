
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Weight, Pill, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

// Define the drug type interfaces for better type safety
interface BaseDrug {
  id: string;
  name: string;
  routes: string[];
  concentration: string;
  notes: string;
}

interface AdultDrug extends BaseDrug {
  dose: string;
  volume: string;
}

interface PediatricWeightBasedDrug extends BaseDrug {
  weightBased: true;
  dosePerKg: string | Record<string, string>;
  maxDose: string | Record<string, string>;
}

interface PediatricAgeBasedDrug extends BaseDrug {
  weightBased: false;
  doseByAge: Record<string, string>;
}

type DrugType = AdultDrug | PediatricWeightBasedDrug | PediatricAgeBasedDrug;

// Drug dosage database
const drugs: {
  adult: AdultDrug[];
  pediatric: (PediatricWeightBasedDrug | PediatricAgeBasedDrug)[];
} = {
  adult: [
    { 
      id: 'adrenaline',
      name: 'Adrenaline (Cardiac Arrest)',
      routes: ['IV'],
      dose: '1mg',
      concentration: '1:10,000 (1 mg in 10 mL)',
      volume: '10 mL',
      notes: 'Repeat every 3-5 minutes as needed.'
    },
    { 
      id: 'amiodarone',
      name: 'Amiodarone (Cardiac Arrest)',
      routes: ['IV'],
      dose: '300mg initial, 150mg subsequent',
      concentration: '30 mg/mL',
      volume: '10 mL initial, 5 mL subsequent',
      notes: 'After 3 shocks for VF/pVT. Subsequent dose after further 150 mg after 3-5 mins if VF/pVT persists.'
    },
    { 
      id: 'aspirin',
      name: 'Aspirin (ACS)',
      routes: ['PO'],
      dose: '300mg',
      concentration: 'N/A (tablets)',
      volume: 'N/A',
      notes: 'Chewed or dispersed.'
    },
    { 
      id: 'morphine',
      name: 'Morphine (Pain)',
      routes: ['IV', 'IM'],
      dose: '2.5-10 mg IV titrated, 5-15 mg IM',
      concentration: '10 mg/mL',
      volume: '0.25-1 mL IV, 0.5-1.5 mL IM',
      notes: 'Titrate IV dose slowly to response. Consider anti-emetic.'
    },
    { 
      id: 'salbutamol',
      name: 'Salbutamol (Asthma/COPD)',
      routes: ['Nebulised'],
      dose: '5 mg',
      concentration: '5 mg/2.5 mL',
      volume: '2.5 mL',
      notes: 'Can be repeated as needed based on response.'
    }
  ],
  pediatric: [
    { 
      id: 'adrenaline_ped',
      name: 'Adrenaline (Cardiac Arrest)',
      weightBased: true,
      routes: ['IV'],
      dosePerKg: '10 mcg/kg',
      maxDose: '1 mg',
      concentration: '1:10,000 (100 mcg/mL)',
      notes: 'Repeat every 3-5 minutes as needed.'
    },
    { 
      id: 'paracetamol_ped',
      name: 'Paracetamol',
      weightBased: true,
      routes: ['PO', 'IV'],
      dosePerKg: '15 mg/kg',
      maxDose: '1000 mg',
      concentration: '10 mg/mL (oral liquid), 10 mg/mL (IV)',
      notes: 'Max 4 doses in 24 hours.'
    },
    { 
      id: 'salbutamol_ped',
      name: 'Salbutamol (Asthma)',
      weightBased: false,
      routes: ['Nebulised'],
      doseByAge: {
        '<5 years': '2.5 mg',
        '≥5 years': '5 mg'
      },
      concentration: '5 mg/2.5 mL',
      notes: 'Can be repeated as needed based on response.'
    },
    { 
      id: 'diazepam_ped',
      name: 'Diazepam (Seizure)',
      weightBased: true,
      routes: ['IV', 'PR'],
      dosePerKg: {
        'IV': '0.25 mg/kg',
        'PR': '0.5 mg/kg'
      },
      maxDose: {
        'IV': '10 mg',
        'PR': '20 mg'
      },
      concentration: '5 mg/mL',
      notes: 'IV administration should be slow. May repeat once after 5 minutes if seizures persist.'
    }
  ]
};

const DrugDosageCalculator = () => {
  const { toast } = useToast();
  
  // State variables
  const [patientCategory, setPatientCategory] = useState<'adult' | 'pediatric'>('adult');
  const [selectedDrug, setSelectedDrug] = useState<string>('');
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [calculationResults, setCalculationResults] = useState<any>(null);
  
  // Get current drug list based on patient category
  const currentDrugList = drugs[patientCategory];
  
  // Get the selected drug object
  const drugObject = currentDrugList.find(drug => drug.id === selectedDrug);
  
  // Handle drug selection
  const handleDrugSelect = (drugId: string) => {
    setSelectedDrug(drugId);
    // Reset route if the selected drug changes
    setSelectedRoute('');
    setCalculationResults(null);
  };
  
  // Handle route selection
  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route);
  };
  
  // Calculate dosage
  const calculateDosage = () => {
    if (!selectedDrug) {
      toast({
        title: "No Drug Selected",
        description: "Please select a drug to calculate the dosage.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected drug
    const drug = currentDrugList.find(d => d.id === selectedDrug);
    
    if (!drug) {
      toast({
        title: "Error",
        description: "Could not find the selected drug information.",
        variant: "destructive"
      });
      return;
    }
    
    // For pediatric weight-based drugs
    if (patientCategory === 'pediatric' && 'weightBased' in drug && drug.weightBased) {
      if (!weight) {
        toast({
          title: "Weight Required",
          description: "Please enter the patient's weight.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate results
      const results = calculatePediatricDose(drug as PediatricWeightBasedDrug, weight, selectedRoute);
      setCalculationResults(results);
      
      toast({
        title: "Dosage Calculated",
        description: `${drug.name} dosage calculated for ${weight}kg patient.`,
      });
      
      return;
    }
    
    // For pediatric age-based drugs
    if (patientCategory === 'pediatric' && 'weightBased' in drug && !drug.weightBased) {
      if (!age) {
        toast({
          title: "Age Required",
          description: "Please enter the patient's age.",
          variant: "destructive"
        });
        return;
      }
      
      // Determine age category
      let ageCategory;
      if (age < 5) {
        ageCategory = '<5 years';
      } else {
        ageCategory = '≥5 years';
      }
      
      const ageBasedDrug = drug as PediatricAgeBasedDrug;
      
      // Set results
      setCalculationResults({
        dose: ageBasedDrug.doseByAge[ageCategory],
        volume: calculateVolumeFromDose(ageBasedDrug.doseByAge[ageCategory], ageBasedDrug.concentration),
        concentration: ageBasedDrug.concentration,
        notes: ageBasedDrug.notes
      });
      
      toast({
        title: "Dosage Calculated",
        description: `${drug.name} dosage calculated for ${age} year old patient.`,
      });
      
      return;
    }
    
    // For adult drugs
    const adultDrug = drug as AdultDrug;
    setCalculationResults({
      dose: adultDrug.dose,
      volume: adultDrug.volume,
      concentration: adultDrug.concentration,
      notes: adultDrug.notes
    });
    
    toast({
      title: "Dosage Calculated",
      description: `Standard adult dosage for ${drug.name}.`,
    });
  };
  
  // Calculate pediatric dose based on weight
  const calculatePediatricDose = (drug: PediatricWeightBasedDrug, weight: number, route?: string) => {
    // For drugs with different dosages by route
    if (route && typeof drug.dosePerKg !== 'string') {
      const dosePerKg = drug.dosePerKg[route];
      const maxDose = typeof drug.maxDose !== 'string' ? drug.maxDose[route] : drug.maxDose;
      
      // Extract numerical value from dosePerKg string (e.g., "10 mcg/kg" -> 10)
      const doseValueMatch = dosePerKg.match(/^([\d.]+)/);
      const doseValue = doseValueMatch ? parseFloat(doseValueMatch[1]) : 0;
      
      // Calculate dose
      let calculatedDose = doseValue * weight;
      const doseUnit = dosePerKg.replace(/^[\d.]+ /, '');
      
      // Check if over max dose
      if (maxDose) {
        // Extract numerical value from maxDose
        const maxDoseValueMatch = maxDose.toString().match(/^([\d.]+)/);
        const maxDoseValue = maxDoseValueMatch ? parseFloat(maxDoseValueMatch[1]) : Infinity;
        
        if (calculatedDose > maxDoseValue) {
          calculatedDose = maxDoseValue;
        }
      }
      
      return {
        dose: `${calculatedDose} ${doseUnit}`,
        volume: drug.concentration ? calculateVolumeFromDose(`${calculatedDose} ${doseUnit}`, drug.concentration) : 'Varies',
        concentration: drug.concentration || 'Varies',
        notes: `${drug.notes || ''} ${maxDose ? `Maximum dose: ${maxDose}.` : ''}`
      };
    }
    
    // For drugs with simple weight-based dosing
    if (typeof drug.dosePerKg === 'string') {
      // Extract numerical value from dosePerKg string (e.g., "10 mcg/kg" -> 10)
      const doseValueMatch = drug.dosePerKg.match(/^([\d.]+)/);
      const doseValue = doseValueMatch ? parseFloat(doseValueMatch[1]) : 0;
      
      // Calculate dose
      let calculatedDose = doseValue * weight;
      const doseUnit = drug.dosePerKg.replace(/^[\d.]+ /, '');
      
      // Check if over max dose
      if (drug.maxDose) {
        // Extract numerical value from maxDose
        const maxDoseValueMatch = drug.maxDose.toString().match(/^([\d.]+)/);
        const maxDoseValue = maxDoseValueMatch ? parseFloat(maxDoseValueMatch[1]) : Infinity;
        
        if (calculatedDose > maxDoseValue) {
          calculatedDose = maxDoseValue;
        }
      }
      
      return {
        dose: `${calculatedDose} ${doseUnit}`,
        volume: drug.concentration ? calculateVolumeFromDose(`${calculatedDose} ${doseUnit}`, drug.concentration) : 'Varies',
        concentration: drug.concentration || 'Varies',
        notes: `${drug.notes || ''} ${drug.maxDose ? `Maximum dose: ${drug.maxDose}.` : ''}`
      };
    }
    
    return {
      dose: 'Calculation not available',
      volume: 'Calculation not available',
      concentration: drug.concentration || 'Varies',
      notes: drug.notes || 'See JRCALC guidelines.'
    };
  };
  
  // Calculate volume from dose and concentration (simple estimation)
  const calculateVolumeFromDose = (dose: string, concentration: string) => {
    // This is a simplified calculation and would need more complex logic for real applications
    // Extract dose value
    const doseMatch = dose.match(/^([\d.]+) (mg|mcg)/);
    if (!doseMatch) return 'Calculation not available';
    
    const doseValue = parseFloat(doseMatch[1]);
    const doseUnit = doseMatch[2];
    
    // Extract concentration value
    const concentrationMatch = concentration.match(/([\d.]+) (mg|mcg)\/(ml|mL)/);
    if (!concentrationMatch) {
      if (concentration.includes('mg/mL')) {
        // Try another pattern
        const altMatch = concentration.match(/([\d.]+) (mg) in ([\d.]+) (mL)/);
        if (altMatch) {
          const concValue = parseFloat(altMatch[1]);
          const concVolume = parseFloat(altMatch[3]);
          const actualConcentration = concValue / concVolume;
          
          // If units match, calculate volume
          if (doseUnit === altMatch[2]) {
            return `${(doseValue / actualConcentration).toFixed(1)} mL`;
          }
        }
      }
      
      return 'See reference';
    }
    
    const concentrationValue = parseFloat(concentrationMatch[1]);
    const concentrationUnit = concentrationMatch[2];
    
    // If units match, calculate volume
    if (doseUnit === concentrationUnit) {
      return `${(doseValue / concentrationValue).toFixed(1)} mL`;
    }
    
    // If units don't match (e.g., dose in mg, concentration in mcg/mL)
    if (doseUnit === 'mg' && concentrationUnit === 'mcg') {
      // Convert mg to mcg
      return `${((doseValue * 1000) / concentrationValue).toFixed(1)} mL`;
    } else if (doseUnit === 'mcg' && concentrationUnit === 'mg') {
      // Convert mcg to mg
      return `${(doseValue / (concentrationValue * 1000)).toFixed(1)} mL`;
    }
    
    return 'Calculation not available';
  };
  
  // Reset form
  const resetForm = () => {
    setSelectedDrug('');
    setWeight(undefined);
    setAge(undefined);
    setSelectedRoute('');
    setCalculationResults(null);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Weight size={32} className="text-nhs-green mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">Drug Dosage Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400">Weight-based medication calculator</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Medication Dose Calculator</CardTitle>
              <CardDescription>Calculate medication dosages based on patient parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Category Selector */}
              <div className="space-y-3">
                <Label className="text-base">Patient Category</Label>
                <div className="flex w-full mb-4">
                  <Tabs defaultValue="adult" value={patientCategory} onValueChange={(v) => setPatientCategory(v as 'adult' | 'pediatric')} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="adult" className="flex-1">Adult</TabsTrigger>
                      <TabsTrigger value="pediatric" className="flex-1">Pediatric</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              {/* Patient Parameters */}
              {patientCategory === 'pediatric' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Patient Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight in kg"
                      value={weight ?? ''}
                      onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Patient Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age in years"
                      value={age ?? ''}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              )}
              
              {/* Drug Selection */}
              <div className="space-y-2">
                <Label htmlFor="drug-select">Select Medication</Label>
                <Select value={selectedDrug} onValueChange={handleDrugSelect}>
                  <SelectTrigger id="drug-select">
                    <SelectValue placeholder="Select a medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentDrugList.map((drug) => (
                      <SelectItem key={drug.id} value={drug.id}>
                        {drug.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Route Selection - Only show if the drug is selected and has multiple routes */}
              {selectedDrug && drugObject && drugObject.routes.length > 1 && (
                <div className="space-y-2">
                  <Label htmlFor="route-select">Administration Route</Label>
                  <Select value={selectedRoute} onValueChange={handleRouteSelect}>
                    <SelectTrigger id="route-select">
                      <SelectValue placeholder="Select administration route" />
                    </SelectTrigger>
                    <SelectContent>
                      {drugObject.routes.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Notice */}
              <Alert className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  Always double-check all dosage calculations. This calculator is a guide only and should not replace clinical judgment.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button onClick={calculateDosage}>Calculate Dosage</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          {/* Results Card */}
          <Card className={calculationResults ? "border-2 border-nhs-blue" : ""}>
            <CardHeader>
              <CardTitle>Dosage Results</CardTitle>
              <CardDescription>
                {drugObject ? drugObject.name : "Select a medication"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {calculationResults ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="text-green-600 mr-2" size={20} />
                    <span className="text-lg font-medium">Calculation Complete</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dose</p>
                      <p className="text-lg font-medium">{calculationResults.dose}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                      <p className="text-lg font-medium">{calculationResults.volume}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Concentration</p>
                      <p className="text-base">{calculationResults.concentration}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                      <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-sm">
                          {calculationResults.notes}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Pill className="mb-2 text-gray-400" size={32} />
                  <p>Select a medication and enter patient parameters to calculate dosage.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">About Drug Dosages</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>This calculator provides guidance on medication dosing based on current JRCALC and UK Ambulance Service Clinical Practice Guidelines.</p>
              <p className="mt-2">Always refer to your local protocols and guidelines for specific medication administration instructions.</p>
              <Alert className="mt-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-sm">Clinical Use</AlertTitle>
                <AlertDescription className="text-xs">
                  This is a demonstration tool and should not be used in clinical practice without verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DrugDosageCalculator;
