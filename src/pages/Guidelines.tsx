
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'react-router-dom';

// Comprehensive guidelines data structure with IDs and subtopics
export const guidelineCategories = [
  { 
    id: 'cardiac',
    name: 'Cardiac Emergencies',
    guidelines: [
      { id: 'acs', title: 'Acute Coronary Syndromes', subtopics: ['Assessment', 'Management', 'Medication', 'Pathways'] },
      { id: 'ca', title: 'Cardiac Arrest', subtopics: ['Adult BLS', 'Adult ALS', 'Post-ROSC Care', 'Special Circumstances'] },
      { id: 'crd', title: 'Cardiac Rhythm Disturbances', subtopics: ['Tachycardia', 'Bradycardia', 'Heart Blocks'] },
      { id: 'hf', title: 'Heart Failure', subtopics: ['Acute Pulmonary Oedema', 'Cardiogenic Shock'] }
    ] 
  },
  { 
    id: 'respiratory',
    name: 'Respiratory Conditions',
    guidelines: [
      { id: 'asthma', title: 'Asthma', subtopics: ['Assessment', 'Management', 'Medication', 'Critical Asthma'] },
      { id: 'copd', title: 'COPD', subtopics: ['Assessment', 'Management', 'Exacerbations'] },
      { id: 'pe', title: 'Pulmonary Embolism', subtopics: ['Risk Factors', 'Assessment', 'Management'] },
      { id: 'pneumonia', title: 'Pneumonia', subtopics: ['Assessment', 'Management', 'Severity Assessment'] }
    ] 
  },
  { 
    id: 'medical',
    name: 'Medical Emergencies',
    guidelines: [
      { id: 'sepsis', title: 'Sepsis', subtopics: ['Screening', 'NEWS2', 'Management', 'Septic Shock'] },
      { id: 'stroke', title: 'Stroke/TIA', subtopics: ['FAST Assessment', 'Thrombolysis Criteria', 'Hemorrhagic vs Ischemic'] },
      { id: 'diabetes', title: 'Diabetic Emergencies', subtopics: ['DKA', 'Hypoglycemia', 'HHS'] },
      { id: 'anaphylaxis', title: 'Anaphylaxis', subtopics: ['Recognition', 'Management', 'Follow-up'] }
    ] 
  },
  { 
    id: 'trauma',
    name: 'Trauma',
    guidelines: [
      { id: 'tbi', title: 'Traumatic Brain Injury', subtopics: ['Assessment', 'Management', 'Triage Criteria'] },
      { id: 'spinal', title: 'Spinal Injuries', subtopics: ['Assessment', 'Immobilization', 'Clearance'] },
      { id: 'burns', title: 'Burns', subtopics: ['Assessment', 'Rule of Nines', 'Management', 'Fluid Resuscitation'] },
      { id: 'fractures', title: 'Fractures', subtopics: ['Assessment', 'Immobilization', 'Analgesia'] },
      { id: 'major-trauma', title: 'Major Trauma', subtopics: ['Catastrophic Hemorrhage', 'Airway', 'Breathing', 'Circulation'] }
    ] 
  },
  { 
    id: 'obstetric',
    name: 'Obstetric Emergencies',
    guidelines: [
      { id: 'delivery', title: 'Normal Delivery', subtopics: ['Stages of Labour', 'Management', 'Complications'] },
      { id: 'pph', title: 'Post-Partum Hemorrhage', subtopics: ['Risk Factors', 'Assessment', 'Management'] },
      { id: 'preeclampsia', title: 'Pre-eclampsia', subtopics: ['Assessment', 'Management', 'Eclampsia'] },
      { id: 'cord-prolapse', title: 'Umbilical Cord Prolapse', subtopics: ['Recognition', 'Management'] }
    ] 
  },
  { 
    id: 'pediatric',
    name: 'Pediatric Emergencies',
    guidelines: [
      { id: 'ped-resus', title: 'Pediatric Resuscitation', subtopics: ['BLS', 'ALS', 'Drug Dosages'] },
      { id: 'ped-resp', title: 'Respiratory Distress', subtopics: ['Croup', 'Bronchiolitis', 'Asthma'] },
      { id: 'ped-seizures', title: 'Seizures', subtopics: ['Febrile Seizures', 'Status Epilepticus'] },
      { id: 'safeguarding', title: 'Safeguarding', subtopics: ['Recognition', 'Referral Pathways'] }
    ] 
  },
  { 
    id: 'mental-health',
    name: 'Mental Health',
    guidelines: [
      { id: 'suicide', title: 'Suicide Risk', subtopics: ['Assessment', 'Management', 'Referral'] },
      { id: 'psychosis', title: 'Acute Psychosis', subtopics: ['Assessment', 'Management', 'Safety'] },
      { id: 'section', title: 'Mental Health Act', subtopics: ['Section 136', 'Capacity Assessment'] },
      { id: 'agitation', title: 'Acute Agitation', subtopics: ['De-escalation', 'Management'] }
    ] 
  }
];

const Guidelines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Check for hash in URL to auto-open a category
  useEffect(() => {
    if (location.hash) {
      const categoryId = location.hash.substring(1);
      setActiveCategory(categoryId);
    }
  }, [location]);
  
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
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            {filteredCategories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 -mx-4 rounded text-lg">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="mb-2">
                    <CardContent className="p-0">
                      {category.guidelines.map((guideline) => (
                        <Link 
                          key={guideline.id}
                          to={`/guidelines/${category.id}/${guideline.id}`}
                          className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <span>{guideline.title}</span>
                          <ChevronRight size={16} className="text-gray-400" />
                        </Link>
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
        <p className="font-bold">Updated May 2023</p>
        <p className="text-sm">These guidelines reflect the latest JRCALC and UK Trust recommendations. Always follow your local protocols.</p>
      </div>
    </div>
  );
};

export default Guidelines;
