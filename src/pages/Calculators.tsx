
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ChevronRight, Activity, Heart, FlaskConical, Ruler, Thermometer, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface CalculatorItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  tags: string[];
}

const calculators: CalculatorItem[] = [
  {
    id: 'news2',
    title: 'NEWS2 Calculator',
    description: 'Calculate National Early Warning Score 2 for patient deterioration',
    path: '/calculators/news2',
    icon: <Heart className="text-nhs-red" />,
    tags: ['vitals', 'deterioration', 'triage']
  },
  {
    id: 'gcs',
    title: 'GCS Calculator',
    description: 'Calculate Glasgow Coma Scale for consciousness assessment',
    path: '/calculators/gcs',
    icon: <Activity className="text-nhs-blue" />,
    tags: ['neurological', 'consciousness', 'trauma']
  },
  {
    id: 'drug-dosage',
    title: 'Drug Dosage Calculator',
    description: 'Calculate medication dosages based on patient weight and age',
    path: '/calculators/drug-dosage',
    icon: <FlaskConical className="text-nhs-purple" />,
    tags: ['medication', 'pediatric', 'emergency']
  },
  {
    id: 'qrisk',
    title: 'QRISK3 Calculator',
    description: 'Cardiovascular disease risk assessment',
    path: '/calculators/qrisk',
    icon: <Heart className="text-nhs-red" />,
    tags: ['cardiac', 'prevention', 'risk']
  },
  {
    id: 'burns',
    title: 'Burns Calculator',
    description: 'Calculate total body surface area for burns assessment',
    path: '/calculators/burns',
    icon: <Thermometer className="text-nhs-warm-yellow" />,
    tags: ['trauma', 'emergency', 'treatment']
  }
];

const Calculators = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter calculators based on search term
  const filteredCalculators = calculators.filter(calc => 
    calc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
          aria-label="Go back to home"
        >
          <ChevronLeft size={24} />
        </Button>
        <Calculator size={28} className="text-nhs-blue mr-3" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-nhs-dark-blue dark:text-white">Clinical Calculators</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Decision support tools</p>
        </div>
      </div>

      {/* Search box */}
      <div className="mb-6 w-full max-w-md">
        <Input
          type="search"
          placeholder="Search calculators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {filteredCalculators.map((calc) => (
          <Card 
            key={calc.id} 
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <div className="mr-3 p-2 bg-blue-50 dark:bg-blue-900 rounded-full">
                  {calc.icon}
                </div>
                <span className="truncate">{calc.title}</span>
              </CardTitle>
              <CardDescription className="line-clamp-2">{calc.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2">
                {calc.tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full flex justify-between items-center" 
                onClick={() => navigate(calc.path)}
              >
                <span>Open Calculator</span>
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCalculators.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No calculators found matching "{searchTerm}"</p>
        </div>
      )}

      <Separator className="my-6" />

      <div className="mt-6 mx-auto max-w-2xl">
        <h2 className="text-lg md:text-xl font-bold mb-3">About Clinical Calculators</h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3">
          These clinical calculators assist with patient assessment and clinical decision-making. They are designed to be used as adjuncts to clinical judgment and should not replace thorough assessment.
        </p>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Always follow your local clinical guidelines and protocols when making treatment decisions.
        </p>
      </div>

      {/* Development notice */}
      <div className="mt-6 p-3 md:p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto text-sm">
        <h3 className="font-bold">Development Version</h3>
        <p>These calculators are for demonstration purposes only. Always verify calculations with approved tools.</p>
      </div>
    </div>
  );
};

export default Calculators;
