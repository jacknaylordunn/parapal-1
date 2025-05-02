
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, Droplet, AlertTriangle, Info } from 'lucide-react'; // Changed DropletHalf to Droplet
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

// SVG image components for the body diagrams
const BodyDiagramAdult = () => (
  <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="max-h-96 w-full">
    {/* Front of body */}
    <g>
      {/* Head - 9% */}
      <circle cx="200" cy="50" r="40" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="head" data-value="9" />
      
      {/* Torso - 18% (front half = 9%) */}
      <rect x="160" y="100" width="80" height="150" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="torso-front" data-value="9" />
      
      {/* Left arm - 9% (front half = 4.5%) */}
      <rect x="110" y="100" width="40" height="150" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="left-arm-front" data-value="4.5" />
      
      {/* Right arm - 9% (front half = 4.5%) */}
      <rect x="250" y="100" width="40" height="150" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="right-arm-front" data-value="4.5" />
      
      {/* Left leg - 18% (front half = 9%) */}
      <rect x="160" y="260" width="35" height="180" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="left-leg-front" data-value="9" />
      
      {/* Right leg - 18% (front half = 9%) */}
      <rect x="205" y="260" width="35" height="180" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="right-leg-front" data-value="9" />
      
      {/* Genitals - 1% */}
      <rect x="180" y="250" width="40" height="10" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="genitals" data-value="1" />
    </g>
    
    <text x="200" y="470" textAnchor="middle" className="text-xs font-bold">Front View</text>
  </svg>
);

const BodyDiagramChild = () => (
  <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="max-h-96 w-full">
    {/* Similar to adult but with different proportions */}
    {/* Head - 18% (larger proportion for children) */}
    <circle cx="200" cy="50" r="45" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="head" data-value="18" />
    
    {/* Torso - 18% (front half = 9%) */}
    <rect x="160" y="100" width="80" height="120" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="torso-front" data-value="9" />
    
    {/* Left arm - 9% (front half = 4.5%) */}
    <rect x="120" y="100" width="30" height="120" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="left-arm-front" data-value="4.5" />
    
    {/* Right arm - 9% (front half = 4.5%) */}
    <rect x="250" y="100" width="30" height="120" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="right-arm-front" data-value="4.5" />
    
    {/* Left leg - 14% (front half = 7%) */}
    <rect x="160" y="230" width="35" height="150" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="left-leg-front" data-value="7" />
    
    {/* Right leg - 14% (front half = 7%) */}
    <rect x="205" y="230" width="35" height="150" className="stroke-gray-700 stroke-2 fill-white hover:fill-gray-200 cursor-pointer" data-region="right-leg-front" data-value="7" />
    
    <text x="200" y="430" textAnchor="middle" className="text-xs font-bold">Child View</text>
  </svg>
);

const BurnsCalculator = () => {
  const { toast } = useToast();
  
  // State for patient information
  const [ageGroup, setAgeGroup] = useState<'adult' | 'child' | 'infant'>('adult');
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [burnPercentage, setBurnPercentage] = useState<number>(0);
  const [fluidRequirement, setFluidRequirement] = useState<number | null>(null);
  const [resultsVisible, setResultsVisible] = useState<boolean>(false);
  
  // Burn areas for manual input
  const burnAreas = {
    adult: [
      { id: 'head', name: 'Head and Neck', value: 9 },
      { id: 'torso-front', name: 'Torso (Front)', value: 9 },
      { id: 'torso-back', name: 'Torso (Back)', value: 9 },
      { id: 'right-arm-front', name: 'Right Arm (Front)', value: 4.5 },
      { id: 'right-arm-back', name: 'Right Arm (Back)', value: 4.5 },
      { id: 'left-arm-front', name: 'Left Arm (Front)', value: 4.5 },
      { id: 'left-arm-back', name: 'Left Arm (Back)', value: 4.5 },
      { id: 'right-leg-front', name: 'Right Leg (Front)', value: 9 },
      { id: 'right-leg-back', name: 'Right Leg (Back)', value: 9 },
      { id: 'left-leg-front', name: 'Left Leg (Front)', value: 9 },
      { id: 'left-leg-back', name: 'Left Leg (Back)', value: 9 },
      { id: 'genitals', name: 'Perineum', value: 1 }
    ],
    child: [
      { id: 'head', name: 'Head and Neck', value: 18 },
      { id: 'torso-front', name: 'Torso (Front)', value: 9 },
      { id: 'torso-back', name: 'Torso (Back)', value: 9 },
      { id: 'right-arm-front', name: 'Right Arm (Front)', value: 4.5 },
      { id: 'right-arm-back', name: 'Right Arm (Back)', value: 4.5 },
      { id: 'left-arm-front', name: 'Left Arm (Front)', value: 4.5 },
      { id: 'left-arm-back', name: 'Left Arm (Back)', value: 4.5 },
      { id: 'right-leg-front', name: 'Right Leg (Front)', value: 7 },
      { id: 'right-leg-back', name: 'Right Leg (Back)', value: 7 },
      { id: 'left-leg-front', name: 'Left Leg (Front)', value: 7 },
      { id: 'left-leg-back', name: 'Left Leg (Back)', value: 7 },
      { id: 'genitals', name: 'Perineum', value: 1 }
    ],
    infant: [
      { id: 'head', name: 'Head and Neck', value: 21 },
      { id: 'torso-front', name: 'Torso (Front)', value: 8 },
      { id: 'torso-back', name: 'Torso (Back)', value: 8 },
      { id: 'right-arm-front', name: 'Right Arm (Front)', value: 4 },
      { id: 'right-arm-back', name: 'Right Arm (Back)', value: 4 },
      { id: 'left-arm-front', name: 'Left Arm (Front)', value: 4 },
      { id: 'left-arm-back', name: 'Left Arm (Back)', value: 4 },
      { id: 'right-leg-front', name: 'Right Leg (Front)', value: 6 },
      { id: 'right-leg-back', name: 'Right Leg (Back)', value: 6 },
      { id: 'left-leg-front', name: 'Left Leg (Front)', value: 6 },
      { id: 'left-leg-back', name: 'Left Leg (Back)', value: 6 },
      { id: 'genitals', name: 'Perineum', value: 1 }
    ]
  };
  
  // Toggle selection of a burn area
  const toggleRegion = (regionId: string) => {
    if (selectedRegions.includes(regionId)) {
      setSelectedRegions(selectedRegions.filter(id => id !== regionId));
    } else {
      setSelectedRegions([...selectedRegions, regionId]);
    }
  };
  
  // Calculate total burn percentage
  const calculateBurnPercentage = () => {
    if (selectedRegions.length === 0) {
      toast({
        title: "No Burn Areas Selected",
        description: "Please select at least one burn area to calculate TBSA.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate total burn percentage
    let total = 0;
    selectedRegions.forEach(regionId => {
      const region = burnAreas[ageGroup].find(area => area.id === regionId);
      if (region) {
        total += region.value;
      }
    });
    
    // Round to nearest 0.5%
    const roundedTotal = Math.round(total * 2) / 2;
    setBurnPercentage(roundedTotal);
    
    // Calculate fluid requirements (Parkland Formula) if weight is provided
    if (weight) {
      // Parkland formula: 4 mL x weight (kg) x TBSA (%)
      const fluidRequirementMl = 4 * weight * roundedTotal;
      setFluidRequirement(fluidRequirementMl);
    } else {
      setFluidRequirement(null);
    }
    
    setResultsVisible(true);
    
    toast({
      title: "TBSA Calculation Complete",
      description: `Estimated burn area: ${roundedTotal}% TBSA`,
    });
  };
  
  // Reset form
  const resetForm = () => {
    setSelectedRegions([]);
    setBurnPercentage(0);
    setFluidRequirement(null);
    setResultsVisible(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      {/* Header section */}
      <div className="flex items-center mb-8">
        <Ruler size={32} className="text-nhs-orange mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">Burns Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400">Total Body Surface Area (TBSA) Assessment</p>
        </div>
      </div>
      
      <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription className="text-sm">
          This calculator is for demonstration purposes only. Always follow your local protocols and guidelines for burn assessment and management. Patients with burns ≥15% TBSA should be considered for specialist burn care.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column for burn assessment inputs */}
        <div className="lg:col-span-2">
          <Card>
            {/* Card header */}
            <CardHeader>
              <CardTitle>Burns Assessment</CardTitle>
              <CardDescription>Select patient details and affected body areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Type Selection */}
              <div className="space-y-3">
                <Label className="text-base">Patient Age Group</Label>
                <div className="flex w-full mb-4">
                  <Tabs 
                    defaultValue="adult" 
                    value={ageGroup} 
                    onValueChange={(v) => {
                      setAgeGroup(v as 'adult' | 'child' | 'infant');
                      resetForm();
                    }}
                    className="w-full"
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="adult" className="flex-1">Adult</TabsTrigger>
                      <TabsTrigger value="child" className="flex-1">Child (1-10yrs)</TabsTrigger>
                      <TabsTrigger value="infant" className="flex-1">Infant (&lt;1yr)</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              {/* Patient Weight for Fluid Calculation */}
              <div className="space-y-2">
                <Label htmlFor="weight">Patient Weight (kg) - Optional for fluid calculation</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight in kg"
                  value={weight ?? ''}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              
              {/* Body Region Selection */}
              <div className="pt-2 border-t">
                <h3 className="font-medium mb-3">Select Burned Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Body Diagram</Label>
                    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                      {ageGroup === 'adult' && <BodyDiagramAdult />}
                      {(ageGroup === 'child' || ageGroup === 'infant') && <BodyDiagramChild />}
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Tap on diagram to select burned regions
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Manual Selection</Label>
                    <div className="border rounded-md p-4 h-[24rem] overflow-y-auto">
                      <div className="space-y-2">
                        {burnAreas[ageGroup].map((area) => (
                          <div key={area.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={area.id}
                              className="h-5 w-5 rounded border-gray-300"
                              checked={selectedRegions.includes(area.id)}
                              onChange={() => toggleRegion(area.id)}
                            />
                            <Label htmlFor={area.id} className="text-sm">
                              {area.name} ({area.value}%)
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Selected Regions Summary */}
              <div className="pt-2 border-t">
                <h3 className="font-medium mb-3">Selected Regions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRegions.length > 0 ? (
                    selectedRegions.map(regionId => {
                      const region = burnAreas[ageGroup].find(area => area.id === regionId);
                      return region ? (
                        <div key={regionId} className="bg-nhs-blue text-white px-2 py-1 rounded-full text-sm">
                          {region.name} ({region.value}%)
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No regions selected</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button onClick={calculateBurnPercentage}>Calculate TBSA</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Results Area */}
        <div className="lg:col-span-1">
          <Card className={resultsVisible ? "border-2 border-nhs-blue" : ""}>
            <CardHeader>
              <CardTitle>TBSA Results</CardTitle>
              <CardDescription>Burn assessment summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {resultsVisible ? (
                <>
                  <div className="text-center py-4">
                    <div className="text-6xl font-bold mb-2 text-nhs-blue">{burnPercentage}%</div>
                    <div className="text-xl font-medium">
                      Total Body Surface Area
                    </div>
                  </div>
                  
                  {fluidRequirement !== null && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center">
                        <Droplet className="mr-2 text-blue-600" size={18} /> {/* Changed DropletHalf to Droplet */}
                        Fluid Resuscitation (Parkland Formula)
                      </h3>
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                        <p className="font-semibold text-lg">{fluidRequirement} mL</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total 24-hour fluid</p>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="font-medium">First 8 hours:</p>
                            <p>{Math.round(fluidRequirement / 2)} mL</p>
                          </div>
                          <div>
                            <p className="font-medium">Next 16 hours:</p>
                            <p>{Math.round(fluidRequirement / 2)} mL</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Alert className={`
                    ${burnPercentage < 10 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}
                    ${burnPercentage >= 10 && burnPercentage < 20 ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' : ''}
                    ${burnPercentage >= 20 ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' : ''}
                  `}>
                    <AlertTriangle className={`
                      h-4 w-4
                      ${burnPercentage < 10 ? 'text-green-600 dark:text-green-400' : ''}
                      ${burnPercentage >= 10 && burnPercentage < 20 ? 'text-amber-600 dark:text-amber-400' : ''}
                      ${burnPercentage >= 20 ? 'text-red-600 dark:text-red-400' : ''}
                    `} />
                    <AlertTitle>Management Guidance</AlertTitle>
                    <AlertDescription className="text-sm">
                      {burnPercentage < 10 && "Minor burn: Consider outpatient management if appropriate."}
                      {burnPercentage >= 10 && burnPercentage < 20 && "Moderate burn: Consider referral to specialist burn service."}
                      {burnPercentage >= 20 && "Major burn: Requires specialist burn service. Consider critical care support."}
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Ruler className="mb-2" size={32} />
                  <p>Select burned body regions to calculate TBSA.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">About TBSA Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p>
                The "Rule of Nines" is a method used to estimate the Total Body Surface Area (TBSA) 
                affected by burns. Different proportions are used for adults and children.
              </p>
              <p>
                <strong>Adult Proportions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Head and neck: 9%</li>
                <li>Each arm: 9% (4.5% front, 4.5% back)</li>
                <li>Each leg: 18% (9% front, 9% back)</li>
                <li>Torso front: 18% (9% chest, 9% abdomen)</li>
                <li>Back: 18%</li>
                <li>Perineum: 1%</li>
              </ul>
              <Separator className="my-2" />
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle className="text-xs">Referral Criteria</AlertTitle>
                <AlertDescription className="text-xs">
                  Consider specialist burn service referral for:
                  <ul className="list-disc list-inside mt-1">
                    <li>Burns &gt;10% TBSA in adults</li>
                    <li>Burns &gt;5% TBSA in children</li>
                    <li>Any full thickness burn &gt;5% TBSA</li>
                    <li>Burns to face, hands, feet, genitalia</li>
                    <li>Circumferential burns</li>
                    <li>Inhalation injury</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BurnsCalculator;
