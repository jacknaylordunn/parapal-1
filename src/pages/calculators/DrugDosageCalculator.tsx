
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Weight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Define medication data
const medications = [
  { 
    name: "Paracetamol", 
    routes: ["Oral", "IV"],
    dosing: { 
      adult: { dose: "1g", max: "4g/day" }, 
      pediatric: { dose: "15mg/kg", max: "60mg/kg/day" } 
    }
  },
  { 
    name: "Amiodarone", 
    routes: ["IV"],
    dosing: { 
      adult: { dose: "300mg", max: "1.2g/day" }, 
      pediatric: { dose: "5mg/kg", max: "15mg/kg/day" } 
    }
  },
  { 
    name: "Adrenaline (1:10,000)", 
    routes: ["IV"],
    dosing: { 
      adult: { dose: "1mg", max: "3mg/resuscitation" }, 
      pediatric: { dose: "0.01mg/kg", max: "1mg/dose" } 
    }
  },
  { 
    name: "Salbutamol", 
    routes: ["Nebulizer", "Inhaler"],
    dosing: { 
      adult: { dose: "5mg neb", max: "20mg/day" }, 
      pediatric: { dose: "2.5mg neb", max: "10mg/day" } 
    }
  }
];

const DrugDosageCalculator = () => {
  const navigate = useNavigate();
  const [medication, setMedication] = useState("");
  const [route, setRoute] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [calculatedDose, setCalculatedDose] = useState<string | null>(null);

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
  
  // Get available routes for selected medication
  const getAvailableRoutes = () => {
    const selectedMed = medications.find(med => med.name === medication);
    return selectedMed ? selectedMed.routes : [];
  };
  
  // Calculate the dosage based on inputs
  const calculateDosage = () => {
    if (!medication || !weight || !age) {
      setCalculatedDose("Please fill in all fields");
      return;
    }
    
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);
    const selectedMed = medications.find(med => med.name === medication);
    
    if (!selectedMed) {
      setCalculatedDose("Medication not found");
      return;
    }
    
    let dosageInfo;
    if (ageNum >= 18 || weightNum >= 50) {
      dosageInfo = selectedMed.dosing.adult;
    } else {
      dosageInfo = selectedMed.dosing.pediatric;
    }
    
    if (dosageInfo.dose.includes('mg/kg')) {
      const mgPerKg = parseFloat(dosageInfo.dose.split('mg/kg')[0]);
      const calculatedMg = (mgPerKg * weightNum).toFixed(1);
      setCalculatedDose(`${calculatedMg}mg (${dosageInfo.dose})`);
    } else {
      setCalculatedDose(`${dosageInfo.dose} (standard dose)`);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBackClick} className="mr-2">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-nhs-dark-blue dark:text-white flex items-center">
          <Weight className="mr-2" /> Drug Dosage Calculator
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Enter patient details for accurate dosing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="e.g. 70" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="e.g. 45" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="medication">Medication</Label>
              <Select value={medication} onValueChange={(value) => {
                setMedication(value);
                setRoute("");
              }}>
                <SelectTrigger id="medication">
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map(med => (
                    <SelectItem key={med.name} value={med.name}>
                      {med.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="route">Route</Label>
              <Select 
                value={route} 
                onValueChange={setRoute}
                disabled={!medication}
              >
                <SelectTrigger id="route">
                  <SelectValue placeholder={medication ? "Select route" : "Select medication first"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoutes().map(routeOption => (
                    <SelectItem key={routeOption} value={routeOption}>
                      {routeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={calculateDosage}
              className="w-full mt-2" 
              disabled={!medication || !weight || !age}
            >
              Calculate Dosage
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calculated Dosage</CardTitle>
            <CardDescription>Based on patient weight and age</CardDescription>
          </CardHeader>
          <CardContent>
            {calculatedDose ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-1">{medication}</h3>
                  <p className="text-2xl font-bold text-nhs-blue">{calculatedDose}</p>
                  {route && <p className="text-sm text-gray-500 mt-1">Via {route}</p>}
                </div>
                
                {medication && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Reference Information:</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium">Adult Dose</p>
                        <p>{medications.find(med => med.name === medication)?.dosing.adult.dose}</p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium">Max Daily (Adult)</p>
                        <p>{medications.find(med => med.name === medication)?.dosing.adult.max}</p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium">Pediatric Dose</p>
                        <p>{medications.find(med => med.name === medication)?.dosing.pediatric.dose}</p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium">Max Daily (Pediatric)</p>
                        <p>{medications.find(med => med.name === medication)?.dosing.pediatric.max}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-gray-500 mb-2">Enter patient information and select a medication</p>
                <p className="text-sm text-gray-400">Dose will be calculated based on weight, age and best practice guidelines</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={!calculatedDose}>Save to Patient Record</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DrugDosageCalculator;
