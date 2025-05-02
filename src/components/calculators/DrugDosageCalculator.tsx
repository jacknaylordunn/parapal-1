
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Drug {
  name: string;
  adultDose: string;
  pediatricDosePerKg: number;
  unit: string;
  maxDose?: number;
}

const drugs: Drug[] = [
  { 
    name: 'Paracetamol', 
    adultDose: '1g', 
    pediatricDosePerKg: 15, 
    unit: 'mg',
    maxDose: 1000
  },
  { 
    name: 'Ibuprofen', 
    adultDose: '400mg', 
    pediatricDosePerKg: 10, 
    unit: 'mg',
    maxDose: 400
  },
  { 
    name: 'Adrenaline 1:10,000', 
    adultDose: '1mg', 
    pediatricDosePerKg: 0.01, 
    unit: 'mg',
    maxDose: 1
  },
  { 
    name: 'Amiodarone', 
    adultDose: '300mg', 
    pediatricDosePerKg: 5, 
    unit: 'mg',
    maxDose: 300
  },
  { 
    name: 'Salbutamol', 
    adultDose: '5mg', 
    pediatricDosePerKg: 0.15, 
    unit: 'mg',
    maxDose: 5
  }
];

const DrugDosageCalculator = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState<string>('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [calculatedDose, setCalculatedDose] = useState<string | null>(null);
  
  const handleCalculate = () => {
    if (!selectedDrug || !weight || isNaN(parseFloat(weight))) {
      return;
    }
    
    const weightKg = parseFloat(weight);
    if (weightKg <= 0) {
      return;
    }
    
    // Calculate pediatric dose based on weight
    const rawDose = weightKg * selectedDrug.pediatricDosePerKg;
    
    // Apply max dose cap if needed
    const finalDose = selectedDrug.maxDose 
      ? Math.min(rawDose, selectedDrug.maxDose) 
      : rawDose;
    
    // Format the result
    setCalculatedDose(`${finalDose.toFixed(1)} ${selectedDrug.unit}`);
  };
  
  const handleReset = () => {
    setWeight('');
    setSelectedDrug(null);
    setCalculatedDose(null);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-1" size={16} />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Drug Dosage Calculator</CardTitle>
          <CardDescription>Calculate pediatric medication doses based on weight</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="weight">Patient Weight (kg)</Label>
            <Input 
              id="weight" 
              type="number" 
              placeholder="Enter weight in kg" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="drug">Medication</Label>
            <Select 
              onValueChange={(value) => {
                const drug = drugs.find(d => d.name === value);
                setSelectedDrug(drug || null);
              }}
              value={selectedDrug?.name || ""}
            >
              <SelectTrigger id="drug">
                <SelectValue placeholder="Select medication" />
              </SelectTrigger>
              <SelectContent>
                {drugs.map((drug) => (
                  <SelectItem key={drug.name} value={drug.name}>
                    {drug.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedDrug && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <h3 className="font-medium">Adult Dose:</h3>
              <p className="text-lg font-bold">{selectedDrug.adultDose}</p>
              <h3 className="font-medium mt-2">Pediatric Dose:</h3>
              <p>{selectedDrug.pediatricDosePerKg} {selectedDrug.unit}/kg</p>
              {selectedDrug.maxDose && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Maximum dose: {selectedDrug.maxDose} {selectedDrug.unit}
                </p>
              )}
            </div>
          )}
          
          <div className="flex justify-center">
            <Button onClick={handleCalculate} disabled={!selectedDrug || !weight}>
              Calculate Dose
            </Button>
          </div>
          
          {calculatedDose && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
              <h3 className="font-semibold text-lg">Calculated Pediatric Dose:</h3>
              <p className="text-2xl font-bold text-nhs-blue mt-2">{calculatedDose}</p>
              {selectedDrug?.maxDose && parseFloat(weight) * selectedDrug.pediatricDosePerKg > selectedDrug.maxDose && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                  Note: Dose has been capped at the maximum recommended dose
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          <Button onClick={() => navigate(-1)}>Done</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DrugDosageCalculator;
