
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Activity, Heart, Brain, Weight, Ruler, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEncounter } from "@/contexts/EncounterContext";

// Import calculator components
import NEWS2Calculator from "../calculators/NEWS2Calculator";
import GCSCalculator from "../calculators/GCSCalculator";
import DrugDosageCalculator from "../calculators/DrugDosageCalculator";
import BurnsCalculator from "../calculators/BurnsCalculator";
import QRISKCalculator from "../calculators/QRISKCalculator";

const GuidancePage = () => {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const { activeEncounter } = useEncounter();

  // Calculator data with proper routes
  const calculatorsList = [
    {
      id: 'news2',
      title: 'NEWS2 Score',
      description: 'National Early Warning Score 2',
      icon: <Heart className="text-nhs-red" />,
      details: 'Calculate deterioration risk based on vital signs'
    },
    {
      id: 'gcs',
      title: 'GCS Calculator',
      description: 'Glasgow Coma Scale',
      icon: <Brain className="text-nhs-purple" />,
      details: 'Assess level of consciousness in a standardized way'
    },
    {
      id: 'drug-dosage',
      title: 'Drug Dosage',
      description: 'Weight-based medication calculator',
      icon: <Weight className="text-nhs-green" />,
      details: 'Calculate medication doses based on patient weight'
    },
    {
      id: 'burns',
      title: 'Burns Calculator',
      description: 'Total Body Surface Area',
      icon: <Ruler className="text-nhs-orange" />,
      details: 'Estimate burn percentage and fluid requirements'
    }
  ];

  // Function to render the selected calculator
  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'news2':
        return <NEWS2Calculator />;
      case 'gcs':
        return <GCSCalculator />;
      case 'drug-dosage':
        return <DrugDosageCalculator />;
      case 'burns':
        return <BurnsCalculator />;
      default:
        return null;
    }
  };

  // If a calculator is active, show just that calculator with a back button
  if (activeCalculator) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => setActiveCalculator(null)}
            className="mr-2"
          >
            <ChevronRight className="mr-1 rotate-180" /> Back to Guidance
          </Button>
        </div>
        <div className="mt-4">
          {renderCalculator()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpen className="mr-2 text-nhs-blue" /> Clinical Guidance
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Access clinical tools and calculators for your patient
        </p>
      </div>

      <Tabs defaultValue="calculators">
        <TabsList>
          <TabsTrigger value="calculators">Calculators</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculators" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {calculatorsList.map(calculator => (
              <Card key={calculator.id} className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                      {calculator.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{calculator.title}</CardTitle>
                      <CardDescription>{calculator.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {calculator.details}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full flex justify-between items-center"
                    onClick={() => setActiveCalculator(calculator.id)}
                  >
                    <span>Open Calculator</span>
                    <ChevronRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="guidelines" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Guidelines</CardTitle>
              <CardDescription>
                Access to JRCALC and local clinical guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Select a category below to view relevant guidelines:
              </p>
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  <h3 className="font-medium">Cardiac Emergencies</h3>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  <h3 className="font-medium">Respiratory Conditions</h3>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  <h3 className="font-medium">Medical Emergencies</h3>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  <h3 className="font-medium">Trauma Management</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Reference</CardTitle>
              <CardDescription>
                Information on common emergency medications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">Adrenaline (Epinephrine)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sympathomimetic</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">Amiodarone</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Antiarrhythmic</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">Aspirin</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Antiplatelet</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">Glyceryl Trinitrate</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nitrate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuidancePage;
