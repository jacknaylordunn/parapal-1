
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Dummy data for guidelines
const guidelineCategories = [
  { 
    id: 'cardiac',
    name: 'Cardiac Emergencies',
    guidelines: [
      { id: 'acs', title: 'Acute Coronary Syndromes' },
      { id: 'ca', title: 'Cardiac Arrest' },
      { id: 'crd', title: 'Cardiac Rhythm Disturbances' },
      { id: 'hf', title: 'Heart Failure' }
    ] 
  },
  { 
    id: 'respiratory',
    name: 'Respiratory Conditions',
    guidelines: [
      { id: 'asthma', title: 'Asthma' },
      { id: 'copd', title: 'COPD' },
      { id: 'pe', title: 'Pulmonary Embolism' },
      { id: 'pneumonia', title: 'Pneumonia' }
    ] 
  },
  { 
    id: 'medical',
    name: 'Medical Emergencies',
    guidelines: [
      { id: 'sepsis', title: 'Sepsis' },
      { id: 'stroke', title: 'Stroke/TIA' },
      { id: 'diabetes', title: 'Diabetic Emergencies' },
      { id: 'anaphylaxis', title: 'Anaphylaxis' }
    ] 
  },
  { 
    id: 'trauma',
    name: 'Trauma',
    guidelines: [
      { id: 'tbi', title: 'Traumatic Brain Injury' },
      { id: 'spinal', title: 'Spinal Injuries' },
      { id: 'burns', title: 'Burns' },
      { id: 'fractures', title: 'Fractures' }
    ] 
  },
  { 
    id: 'obstetric',
    name: 'Obstetric Emergencies',
    guidelines: [
      { id: 'delivery', title: 'Normal Delivery' },
      { id: 'pph', title: 'Post-Partum Hemorrhage' },
      { id: 'preeclampsia', title: 'Pre-eclampsia' }
    ] 
  }
];

const Guidelines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter guidelines based on search term
  const filteredCategories = guidelineCategories.map(category => ({
    ...category,
    guidelines: category.guidelines.filter(guideline => 
      guideline.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.guidelines.length > 0);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <BookOpen size={32} className="text-nhs-blue mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">Clinical Guidelines</h1>
          <p className="text-gray-600 dark:text-gray-400">JRCALC and local trust guidelines</p>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text"
            placeholder="Search guidelines..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Guidelines list */}
      <div className="space-y-6">
        {filteredCategories.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredCategories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 -mx-4 rounded text-lg">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="mb-2">
                    <CardContent className="p-0">
                      {category.guidelines.map((guideline) => (
                        <a 
                          key={guideline.id}
                          href={`#guideline-${guideline.id}`}
                          className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <span>{guideline.title}</span>
                          <ChevronRight size={16} className="text-gray-400" />
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No guidelines found matching "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Development notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="font-bold">Development Version</p>
        <p className="text-sm">These are placeholder guidelines for demonstration purposes only.</p>
      </div>
    </div>
  );
};

export default Guidelines;
