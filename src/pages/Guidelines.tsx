
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define guideline categories and their contents
export const guidelineCategories = [
  {
    id: 'cardiac',
    name: 'Cardiac',
    guidelines: [
      { 
        id: 'chest-pain', 
        title: 'Chest Pain', 
        icon: '❤️',
        summary: 'Assessment and management of chest pain',
        updated: '2023-04-15'
      },
      { 
        id: 'cardiac-arrest', 
        title: 'Cardiac Arrest', 
        icon: '💔',
        summary: 'Adult and pediatric cardiac arrest protocols',
        updated: '2023-05-22'
      },
      { 
        id: 'heart-failure', 
        title: 'Heart Failure', 
        icon: '💓',
        summary: 'Acute heart failure assessment and management',
        updated: '2023-03-10'
      },
      { 
        id: 'arrhythmias', 
        title: 'Arrhythmias', 
        icon: '📈',
        summary: 'Common cardiac rhythm abnormalities',
        updated: '2023-02-28'
      }
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    guidelines: [
      { 
        id: 'asthma', 
        title: 'Asthma', 
        icon: '🫁',
        summary: 'Acute asthma management guidelines',
        updated: '2023-04-05'
      },
      { 
        id: 'copd', 
        title: 'COPD', 
        icon: '🫠',
        summary: 'COPD exacerbation management',
        updated: '2023-03-18'
      },
      { 
        id: 'pneumonia', 
        title: 'Pneumonia', 
        icon: '🤧',
        summary: 'Assessment and treatment of suspected pneumonia',
        updated: '2023-01-25'
      },
      { 
        id: 'pulmonary-embolism', 
        title: 'Pulmonary Embolism', 
        icon: '🧬',
        summary: 'Recognition and management of suspected PE',
        updated: '2023-05-10'
      }
    ]
  },
  {
    id: 'trauma',
    name: 'Trauma',
    guidelines: [
      { 
        id: 'major-trauma', 
        title: 'Major Trauma', 
        icon: '🚨',
        summary: 'Major trauma triage and management',
        updated: '2023-06-12'
      },
      { 
        id: 'head-injury', 
        title: 'Head Injury', 
        icon: '🧠',
        summary: 'Head injury assessment and management',
        updated: '2023-05-20'
      },
      { 
        id: 'spinal-injury', 
        title: 'Spinal Injury', 
        icon: '🦴',
        summary: 'Spinal immobilization and management',
        updated: '2023-04-30'
      },
      { 
        id: 'burns', 
        title: 'Burns', 
        icon: '🔥',
        summary: 'Burns assessment, calculation and management',
        updated: '2023-03-15'
      }
    ]
  },
  {
    id: 'medical',
    name: 'Medical',
    guidelines: [
      { 
        id: 'stroke', 
        title: 'Stroke', 
        icon: '🧠',
        summary: 'Stroke recognition and management pathway',
        updated: '2023-06-01'
      },
      { 
        id: 'sepsis', 
        title: 'Sepsis', 
        icon: '🧫',
        summary: 'Sepsis screening and management',
        updated: '2023-05-05'
      },
      { 
        id: 'diabetes', 
        title: 'Diabetic Emergencies', 
        icon: '💉',
        summary: 'Hypo/hyperglycemia management',
        updated: '2023-04-22'
      },
      { 
        id: 'seizures', 
        title: 'Seizures', 
        icon: '⚡',
        summary: 'Management of seizures and status epilepticus',
        updated: '2023-02-15'
      }
    ]
  },
  {
    id: 'obstetrics',
    name: 'Obstetrics',
    guidelines: [
      { 
        id: 'normal-delivery', 
        title: 'Normal Delivery', 
        icon: '👶',
        summary: 'Management of normal childbirth',
        updated: '2023-03-25'
      },
      { 
        id: 'obstetric-emergencies', 
        title: 'Obstetric Emergencies', 
        icon: '🚨',
        summary: 'Common obstetric emergency protocols',
        updated: '2023-02-10'
      },
      { 
        id: 'pre-eclampsia', 
        title: 'Pre-eclampsia', 
        icon: '🌡️',
        summary: 'Recognition and management of pre-eclampsia',
        updated: '2023-01-18'
      },
      { 
        id: 'postpartum-hemorrhage', 
        title: 'Postpartum Hemorrhage', 
        icon: '🩸',
        summary: 'Management of postpartum hemorrhage',
        updated: '2023-04-05'
      }
    ]
  },
  {
    id: 'pediatric',
    name: 'Pediatric',
    guidelines: [
      { 
        id: 'pediatric-respiratory', 
        title: 'Respiratory Distress', 
        icon: '🧒',
        summary: 'Pediatric respiratory emergency management',
        updated: '2023-05-28'
      },
      { 
        id: 'pediatric-seizures', 
        title: 'Seizures', 
        icon: '⚡',
        summary: 'Management of seizures in children',
        updated: '2023-04-15'
      },
      { 
        id: 'pediatric-sepsis', 
        title: 'Sepsis', 
        icon: '🧫',
        summary: 'Recognition and management of pediatric sepsis',
        updated: '2023-03-20'
      },
      { 
        id: 'neonatal-resuscitation', 
        title: 'Neonatal Resuscitation', 
        icon: '👶',
        summary: 'Newborn life support guidelines',
        updated: '2023-02-25'
      }
    ]
  },
];

const Guidelines = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter guidelines based on search term
  const filteredGuidelines = searchTerm ? 
    guidelineCategories.map(category => ({
      ...category,
      guidelines: category.guidelines.filter(guideline => 
        guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guideline.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.guidelines.length > 0)
    : guidelineCategories;
  
  // Calculate total guidelines count
  const totalGuidelines = guidelineCategories.reduce(
    (count, category) => count + category.guidelines.length, 
    0
  );
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
          aria-label="Go back to home"
        >
          <ChevronLeft size={24} />
        </Button>
        <BookOpen size={32} className="text-nhs-blue mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">Clinical Guidelines</h1>
          <p className="text-gray-600 dark:text-gray-400">Evidence-based protocols for pre-hospital care</p>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search guidelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex space-x-2 overflow-x-auto pb-2 w-full">
            <TabsTrigger value="all" className="flex-shrink-0">
              All ({totalGuidelines})
            </TabsTrigger>
            {guidelineCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
                {category.name} ({category.guidelines.length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {filteredGuidelines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No guidelines found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredGuidelines.map(category => (
                  <div key={category.id}>
                    <h2 className="text-xl font-bold mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.guidelines.map(guideline => (
                        <Card 
                          key={guideline.id} 
                          className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                          onClick={() => navigate(`/guidelines/${category.id}/${guideline.id}`)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">
                                <span className="mr-2">{guideline.icon}</span>
                                {guideline.title}
                              </CardTitle>
                            </div>
                            <CardDescription>Last updated: {guideline.updated}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{guideline.summary}</p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button variant="ghost" className="w-full justify-between">
                              <span>View Guideline</span>
                              <ArrowRight size={16} />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {guidelineCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.guidelines
                  .filter(guideline => 
                    searchTerm === '' || 
                    guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    guideline.summary.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(guideline => (
                    <Card 
                      key={guideline.id} 
                      className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => navigate(`/guidelines/${category.id}/${guideline.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            <span className="mr-2">{guideline.icon}</span>
                            {guideline.title}
                          </CardTitle>
                        </div>
                        <CardDescription>Last updated: {guideline.updated}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{guideline.summary}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="ghost" className="w-full justify-between">
                          <span>View Guideline</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              {category.guidelines.filter(guideline => 
                searchTerm === '' || 
                guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guideline.summary.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No guidelines found matching "{searchTerm}"</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Development notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto">
        <h3 className="font-bold">Development Version</h3>
        <p>These guidelines are for demonstration purposes only. Always refer to your organization's current clinical practice guidelines.</p>
      </div>
    </div>
  );
};

export default Guidelines;
