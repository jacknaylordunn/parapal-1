
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Weight, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define medication data types
interface DosageRange {
  min: number;
  max: number;
  unit: string;
  perWeight?: boolean;
}

interface Route {
  name: string;
  dosages: DosageRange[];
  notes?: string;
}

interface Medication {
  id: string;
  name: string;
  category: string;
  routes: Route[];
  concentration?: string;
}

// Example medications data
const medications: Medication[] = [
  {
    id: "paracetamol",
    name: "Paracetamol",
    category: "Analgesic",
    routes: [
      {
        name: "Oral",
        dosages: [
          { min: 10, max: 15, unit: "mg/kg", perWeight: true },
          { min: 500, max: 1000, unit: "mg" }
        ],
        notes: "Maximum 4g/day for adults. For children, max 60mg/kg/day."
      },
      {
        name: "Intravenous",
        dosages: [
          { min: 15, max: 15, unit: "mg/kg", perWeight: true },
          { min: 1000, max: 1000, unit: "mg" }
        ],
        notes: "Maximum 4g/day for adults. For children <50kg, max 60mg/kg/day."
      }
    ]
  },
  {
    id: "morphine",
    name: "Morphine",
    category: "Opioid Analgesic",
    concentration: "10mg/mL",
    routes: [
      {
        name: "Intravenous",
        dosages: [
          { min: 0.1, max: 0.2, unit: "mg/kg", perWeight: true },
          { min: 2.5, max: 10, unit: "mg" }
        ],
        notes: "Titrate to effect. Consider reduced dose in elderly or compromised patients."
      },
      {
        name: "Intramuscular",
        dosages: [
          { min: 0.1, max: 0.2, unit: "mg/kg", perWeight: true },
          { min: 5, max: 15, unit: "mg" }
        ]
      }
    ]
  },
  {
    id: "salbutamol",
    name: "Salbutamol",
    category: "Bronchodilator",
    routes: [
      {
        name: "Nebulizer",
        dosages: [
          { min: 2.5, max: 5, unit: "mg" }
        ],
        notes: "For acute asthma in adults. 2.5mg for children <5 years."
      },
      {
        name: "Inhaler",
        dosages: [
          { min: 100, max: 200, unit: "mcg" }
        ],
        notes: "1-2 puffs as needed, up to 4 times daily."
      }
    ]
  },
  {
    id: "adrenaline",
    name: "Adrenaline (Epinephrine)",
    category: "Sympathomimetic",
    concentration: "1:10,000 (100 mcg/mL) or 1:1,000 (1 mg/mL)",
    routes: [
      {
        name: "Intravenous (Cardiac Arrest)",
        dosages: [
          { min: 1, max: 1, unit: "mg" }
        ],
        notes: "Give 1mg every 3-5 minutes during cardiac arrest."
      },
      {
        name: "Intramuscular (Anaphylaxis)",
        dosages: [
          { min: 0.01, max: 0.01, unit: "mg/kg", perWeight: true },
          { min: 0.3, max: 0.5, unit: "mg" }
        ],
        notes: "Max single dose: 0.5mg adults, 0.3mg children."
      }
    ]
  },
  {
    id: "amiodarone",
    name: "Amiodarone",
    category: "Antiarrhythmic",
    routes: [
      {
        name: "Intravenous (Cardiac Arrest)",
        dosages: [
          { min: 5, max: 5, unit: "mg/kg", perWeight: true },
          { min: 300, max: 300, unit: "mg" }
        ],
        notes: "Initial dose 300mg during cardiac arrest, consider further 150mg."
      },
      {
        name: "Intravenous (Arrhythmias)",
        dosages: [
          { min: 5, max: 5, unit: "mg/kg", perWeight: true },
          { min: 300, max: 300, unit: "mg" }
        ],
        notes: "Given over 20-60 minutes, then 900mg over 24 hours."
      }
    ]
  }
];

const DrugDosageCalculator = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(40);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [calculatedDosages, setCalculatedDosages] = useState<{
    min: number;
    max: number;
    unit: string;
    isPerWeight: boolean;
  } | null>(null);

  // Filter medications based on search term
  const filteredMeds = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dosages when medication, route or patient parameters change
  useEffect(() => {
    if (!selectedMed || !selectedRoute || weight <= 0) {
      setCalculatedDosages(null);
      return;
    }

    const routeData = selectedMed.routes.find(r => r.name === selectedRoute);
    if (!routeData) {
      setCalculatedDosages(null);
      return;
    }

    // Find appropriate dosage based on weight
    const weightBasedDosage = routeData.dosages.find(d => d.perWeight);
    const fixedDosage = routeData.dosages.find(d => !d.perWeight);

    if (weight < 50 && weightBasedDosage) {
      // Use weight-based for patients under 50kg
      setCalculatedDosages({
        min: weightBasedDosage.min * weight,
        max: weightBasedDosage.max * weight,
        unit: weightBasedDosage.unit.replace('/kg', ''),
        isPerWeight: true
      });
    } else if (fixedDosage) {
      // Use fixed dosage for adults
      setCalculatedDosages({
        min: fixedDosage.min,
        max: fixedDosage.max,
        unit: fixedDosage.unit,
        isPerWeight: false
      });
    } else if (weightBasedDosage) {
      // Fallback to weight-based if no fixed dosage available
      setCalculatedDosages({
        min: weightBasedDosage.min * weight,
        max: weightBasedDosage.max * weight,
        unit: weightBasedDosage.unit.replace('/kg', ''),
        isPerWeight: true
      });
    }
  }, [selectedMed, selectedRoute, weight]);

  // Handle medication selection
  const handleSelectMedication = (med: Medication) => {
    setSelectedMed(med);
    if (med.routes.length > 0) {
      setSelectedRoute(med.routes[0].name);
    } else {
      setSelectedRoute("");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/calculators')} className="mr-2">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-nhs-dark-blue dark:text-white flex items-center">
          <Weight className="mr-2" /> Drug Dosage Calculator
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Parameters</CardTitle>
              <CardDescription>Enter patient details for accurate dosing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="mt-1"
                    min="0"
                    max="500"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="mt-1"
                    min="0"
                    max="120"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medication Search</CardTitle>
              <CardDescription>Find a medication to calculate dosage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search medications..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="max-h-[300px] overflow-y-auto border rounded-md">
                {filteredMeds.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No medications found
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMeds.map(med => (
                      <div 
                        key={med.id} 
                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                          selectedMed?.id === med.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => handleSelectMedication(med)}
                      >
                        <div className="font-medium">{med.name}</div>
                        <div className="text-xs text-gray-500">{med.category}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {selectedMed && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedMed.name}</CardTitle>
                <CardDescription>{selectedMed.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMed.concentration && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md text-sm">
                    <span className="font-medium">Concentration:</span> {selectedMed.concentration}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="route">Administration Route</Label>
                  <Select 
                    value={selectedRoute} 
                    onValueChange={setSelectedRoute}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMed.routes.map(route => (
                        <SelectItem key={route.name} value={route.name}>
                          {route.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedRoute && calculatedDosages && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Calculated Dosage:</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                      {calculatedDosages.min === calculatedDosages.max ? (
                        <div className="text-xl text-center font-bold text-nhs-blue">
                          {calculatedDosages.min} {calculatedDosages.unit}
                        </div>
                      ) : (
                        <div className="text-xl text-center font-bold text-nhs-blue">
                          {calculatedDosages.min} - {calculatedDosages.max} {calculatedDosages.unit}
                        </div>
                      )}
                      {calculatedDosages.isPerWeight && (
                        <div className="text-center text-xs text-gray-500 mt-1">
                          Based on weight of {weight}kg
                        </div>
                      )}
                    </div>
                    
                    {selectedMed.routes.find(r => r.name === selectedRoute)?.notes && (
                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-md text-sm">
                        <p className="font-medium">Notes:</p>
                        <p>{selectedMed.routes.find(r => r.name === selectedRoute)?.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save to Patient Record</Button>
              </CardFooter>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>This calculator provides a guide only. Always check against current guidelines and prescribing information.</p>
              <p className="mt-2 text-amber-600">Verify all dosages before administration.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DrugDosageCalculator;
