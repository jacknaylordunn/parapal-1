
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, ArrowLeft, Save, FlipHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Body regions with percentages
const bodyRegions = {
  adult: {
    head: 9,
    neck: 1,
    chest: 9,
    abdomen: 9,
    back: 18,
    rightArm: 9,
    leftArm: 9,
    rightLeg: 18,
    leftLeg: 18,
    genitalia: 1
  },
  child: { // 1-9 years
    head: 14,
    neck: 2,
    chest: 9,
    abdomen: 9,
    back: 18,
    rightArm: 9,
    leftArm: 9,
    rightLeg: 16,
    leftLeg: 16,
    genitalia: 1
  },
  infant: { // <1 year
    head: 18,
    neck: 2,
    chest: 9,
    abdomen: 9,
    back: 18,
    rightArm: 9,
    leftArm: 9,
    rightLeg: 14,
    leftLeg: 14,
    genitalia: 1
  }
};

const BurnsCalculator = () => {
  const navigate = useNavigate();
  const [ageGroup, setAgeGroup] = useState<"adult" | "child" | "infant">("adult");
  const [weight, setWeight] = useState<number>(70);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isFrontView, setIsFrontView] = useState<boolean>(true);
  
  // Toggle body region selection
  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };
  
  // Calculate total TBSA percentage
  const calculateTBSA = () => {
    return selectedRegions.reduce((total, region) => {
      return total + (bodyRegions[ageGroup][region as keyof typeof bodyRegions[typeof ageGroup]] || 0);
    }, 0);
  };
  
  // Calculate fluid requirements using Parkland formula
  const calculateFluidRequirements = () => {
    const tbsa = calculateTBSA();
    // Parkland formula: 4 mL × weight (kg) × %TBSA
    const totalFluid = 4 * weight * tbsa;
    
    // First 8 hours: half of the total
    const firstHalf = totalFluid / 2;
    // Next 16 hours: remaining half
    const secondHalf = totalFluid / 2;
    
    return {
      totalFluid,
      firstHalf,
      secondHalf
    };
  };
  
  const fluidRequirements = calculateFluidRequirements();
  const tbsaPercentage = calculateTBSA();
  
  // Function to toggle between front and back views
  const toggleBodyView = () => {
    setIsFrontView(!isFrontView);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => navigate('/calculators')} className="mr-2">
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-nhs-dark-blue dark:text-white flex items-center">
            <Ruler className="mr-2" /> Burns Calculator
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-6">
        {/* Body Diagram */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Body Surface Area Diagram</CardTitle>
              <Button variant="outline" size="sm" onClick={toggleBodyView} className="flex items-center">
                <FlipHorizontal size={16} className="mr-2" />
                {isFrontView ? 'Show Back' : 'Show Front'}
              </Button>
            </div>
            <CardDescription>Select affected areas on the diagram</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="adult" className="mb-4" onValueChange={(value) => setAgeGroup(value as "adult" | "child" | "infant")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="adult">Adult</TabsTrigger>
                <TabsTrigger value="child">Child (1-9y)</TabsTrigger>
                <TabsTrigger value="infant">Infant (&lt;1y)</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full h-[60vh] bg-gray-50 dark:bg-gray-800 border rounded-md overflow-hidden">
              {/* Interactive Body Diagram */}
              <div className="flex justify-center h-full">
                <svg
                  viewBox="0 0 200 400"
                  className="h-full max-h-[600px]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Body Outline */}
                  {isFrontView ? (
                    <>
                      {/* Head - Front */}
                      <circle
                        cx="100"
                        cy="40"
                        r="30"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('head') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('head')}
                        style={{ cursor: 'pointer' }}
                      />
                      {/* Text label for head */}
                      <text x="100" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].head}%
                      </text>
                      
                      {/* Neck - Front */}
                      <rect
                        x="90"
                        y="70"
                        width="20"
                        height="15"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('neck') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('neck')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="100" y="78" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].neck}%
                      </text>
                      
                      {/* Chest - Front */}
                      <rect
                        x="70"
                        y="85"
                        width="60"
                        height="50"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('chest') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('chest')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="100" y="110" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].chest}%
                      </text>
                      
                      {/* Abdomen - Front */}
                      <rect
                        x="70"
                        y="135"
                        width="60"
                        height="50"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('abdomen') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('abdomen')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="100" y="160" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].abdomen}%
                      </text>
                      
                      {/* Genitalia */}
                      <rect
                        x="85"
                        y="185"
                        width="30"
                        height="15"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('genitalia') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('genitalia')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="100" y="192" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].genitalia}%
                      </text>
                      
                      {/* Right Arm - Front */}
                      <rect
                        x="40"
                        y="85"
                        width="30"
                        height="90"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('rightArm') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('rightArm')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="55" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].rightArm}%
                      </text>
                      
                      {/* Left Arm - Front */}
                      <rect
                        x="130"
                        y="85"
                        width="30"
                        height="90"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('leftArm') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('leftArm')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="145" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].leftArm}%
                      </text>
                      
                      {/* Right Leg - Front */}
                      <rect
                        x="70"
                        y="200"
                        width="30"
                        height="150"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('rightLeg') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('rightLeg')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="85" y="275" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].rightLeg / 2}%
                      </text>
                      
                      {/* Left Leg - Front */}
                      <rect
                        x="100"
                        y="200"
                        width="30"
                        height="150"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('leftLeg') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('leftLeg')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="115" y="275" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].leftLeg / 2}%
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Back View */}
                      {/* Head - Back */}
                      <circle
                        cx="100"
                        cy="40"
                        r="30"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('head') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('head')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="100" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].head}%
                      </text>
                      
                      {/* Neck - Back */}
                      <rect
                        x="90"
                        y="70"
                        width="20"
                        height="15"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('neck') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('neck')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="100" y="78" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].neck}%
                      </text>
                      
                      {/* Back */}
                      <rect
                        x="70"
                        y="85"
                        width="60"
                        height="100"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('back') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('back')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="100" y="135" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].back}%
                      </text>
                      
                      {/* Right Arm - Back */}
                      <rect
                        x="40"
                        y="85"
                        width="30"
                        height="90"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('rightArm') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('rightArm')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="55" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].rightArm}%
                      </text>
                      
                      {/* Left Arm - Back */}
                      <rect
                        x="130"
                        y="85"
                        width="30"
                        height="90"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('leftArm') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('leftArm')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="145" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].leftArm}%
                      </text>
                      
                      {/* Right Leg - Back */}
                      <rect
                        x="70"
                        y="200"
                        width="30"
                        height="150"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('rightLeg') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('rightLeg')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="85" y="275" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].rightLeg / 2}%
                      </text>
                      
                      {/* Left Leg - Back */}
                      <rect
                        x="100"
                        y="200"
                        width="30"
                        height="150"
                        stroke="black"
                        strokeWidth="1"
                        fill={selectedRegions.includes('leftLeg') ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'}
                        onClick={() => toggleRegion('leftLeg')}
                        style={{ cursor: 'pointer' }}
                      />
                      <text x="115" y="275" textAnchor="middle" dominantBaseline="middle" fontSize="8" pointerEvents="none">
                        {bodyRegions[ageGroup].leftLeg / 2}%
                      </text>
                    </>
                  )}
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Calculator Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">Weight (kg)</label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Selected Areas</label>
                <div className="text-sm">
                  {selectedRegions.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {selectedRegions.map(region => (
                        <li key={region} className="capitalize">
                          {region.replace(/([A-Z])/g, ' $1').trim()} - {bodyRegions[ageGroup][region as keyof typeof bodyRegions[typeof ageGroup]]}%
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No areas selected</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Burns Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <div className="flex justify-between">
                  <span>Total Burn Surface Area:</span>
                  <span className="font-bold">{tbsaPercentage}%</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">Burn Classification</h4>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  {tbsaPercentage < 10 ? (
                    <p className="text-green-600 dark:text-green-400">Minor Burn</p>
                  ) : tbsaPercentage < 20 ? (
                    <p className="text-yellow-600 dark:text-yellow-400">Moderate Burn</p>
                  ) : (
                    <p className="text-red-600 dark:text-red-400">Major Burn</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Fluid Requirements (Parkland Formula)</h4>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span>Total 24hr fluid:</span>
                    <span className="font-bold">{fluidRequirements.totalFluid.toFixed(0)} mL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First 8hrs:</span>
                    <span>{fluidRequirements.firstHalf.toFixed(0)} mL ({(fluidRequirements.firstHalf / 8).toFixed(0)} mL/hr)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next 16hrs:</span>
                    <span>{fluidRequirements.secondHalf.toFixed(0)} mL ({(fluidRequirements.secondHalf / 16).toFixed(0)} mL/hr)</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Save size={16} className="mr-2" /> Save Assessment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BurnsCalculator;
