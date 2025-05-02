
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Activity, Heart, Brain, Weight, Ruler, ChevronRight, Search, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Dummy data for calculators
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
    id: 'qrisk',
    title: 'QRISK3',
    description: 'Cardiovascular risk assessment',
    icon: <Activity className="text-nhs-blue" />,
    details: 'Estimate 10-year risk of heart attack or stroke'
  },
  {
    id: 'burns',
    title: 'Burns Calculator',
    description: 'Total Body Surface Area',
    icon: <Ruler className="text-nhs-orange" />,
    details: 'Calculate burn percentage and fluid requirements'
  }
];

const Calculators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Filter calculators based on search term
  const filteredCalculators = calculatorsList.filter(calculator =>
    calculator.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calculator.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          <Calculator size={32} className="text-nhs-blue mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">Clinical Calculators</h1>
            <p className="text-gray-600 dark:text-gray-400">Tools to assist with clinical decision making</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-1" size={16} />
          Back
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text"
            placeholder="Search calculators..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Calculators grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCalculators.map(calculator => (
          <Card key={calculator.id} className="hover:shadow-md transition-shadow duration-200">
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
                onClick={() => navigate(`/calculators/${calculator.id}`)}
              >
                <span>Open Calculator</span>
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredCalculators.length === 0 && (
        <Card className="my-8">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No calculators found matching "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Development notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="font-bold">Development Version</p>
        <p className="text-sm">These are placeholder calculators for demonstration purposes only.</p>
      </div>
    </div>
  );
};

export default Calculators;
