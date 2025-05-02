import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guidelineCategories } from '../Guidelines';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BookOpen, ChevronLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Type definitions
type GuidelineParams = {
  categoryId: string;
  guidelineId: string;
};

interface GuidelineContent {
  title: string;
  description: string;
  content: Record<string, any>;
  references: string[];
}

const GuidelineDetail = () => {
  const { categoryId, guidelineId } = useParams<GuidelineParams>();
  const [activeTab, setActiveTab] = useState('overview');
  const [guidelineData, setGuidelineData] = useState<GuidelineContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Find the category and guideline from the imported data
    const category = guidelineCategories.find(c => c.id === categoryId);
    const guideline = category?.guidelines.find(g => g.id === guidelineId);
    
    if (!category || !guideline) {
      setError('Guideline not found');
      setLoading(false);
      return;
    }
    
    // Simulate loading guideline content from a database
    setLoading(true);
    
    // Use setTimeout to simulate API call
    setTimeout(() => {
      // Create detailed guideline data based on guideline ID
      const guidelineContent = generateGuidelineContent(guideline.id, guideline.title);
      setGuidelineData(guidelineContent);
      setLoading(false);
    }, 500);
  }, [categoryId, guidelineId]);
  
  // Generate mock guideline content based on ID - this would come from a real database in production
  const generateGuidelineContent = (id: string, title: string): GuidelineContent => {
    // Base guideline content structure
    const baseContent: GuidelineContent = {
      title: title,
      description: `JRCALC Guidelines for ${title}`,
      content: {
        overview: `These are the current JRCALC guidelines for managing ${title} in pre-hospital settings.`,
        assessment: "Assessment details will be specific to this condition.",
        management: "Management details will be specific to this condition.",
        medications: "Medication information will be specific to this condition.",
      },
      references: [
        "JRCALC Guidelines 2023",
        "UK Ambulance Services Clinical Practice Guidelines",
        "National Institute for Health and Care Excellence (NICE)"
      ]
    };
    
    // Customize content based on specific guideline ID
    switch(id) {
      case 'acs':
        baseContent.content = {
          overview: "Acute Coronary Syndrome (ACS) refers to a range of conditions associated with sudden, reduced blood flow to the heart.",
          assessment: `
            <h3>Key Assessment Points</h3>
            <ul>
              <li>Chest pain characteristics (central, crushing, radiating)</li>
              <li>Associated symptoms (nausea, sweating, breathlessness)</li>
              <li>Risk factors (diabetes, smoking, family history)</li>
              <li>Vital signs including 12-lead ECG</li>
            </ul>
            <h3>Red Flags</h3>
            <ul>
              <li>ST elevation on ECG</li>
              <li>Hypotension</li>
              <li>Pulmonary edema</li>
              <li>Ongoing chest pain despite initial treatment</li>
            </ul>
          `,
          management: `
            <h3>Initial Management</h3>
            <ol>
              <li>Aspirin 300mg chewed</li>
              <li>GTN 400mcg spray/tablet sublingually (if SBP >90mmHg)</li>
              <li>Perform 12-lead ECG within first 10 minutes</li>
              <li>Establish IV access</li>
            </ol>
            <h3>For STEMI</h3>
            <ol>
              <li>Pre-alert receiving hospital as STEMI</li>
              <li>Consider primary PCI pathway</li>
              <li>Consider morphine 2-10mg IV in small increments</li>
              <li>Consider anti-emetic</li>
            </ol>
            <h3>For NSTEMI/Unstable Angina</h3>
            <ol>
              <li>Transport to nearest appropriate facility</li>
              <li>Ongoing pain management</li>
              <li>Re-assess vital signs frequently</li>
            </ol>
          `,
          medications: `
            <h3>ACS Medications</h3>
            <ul>
              <li><strong>Aspirin:</strong> 300mg, chewed</li>
              <li><strong>GTN:</strong> 400mcg SL, repeat every 5 mins up to 3 doses</li>
              <li><strong>Morphine:</strong> 2-10mg IV titrated to pain response</li>
              <li><strong>Oxygen:</strong> Only if SpO2 < 94% (target 94-98%)</li>
              <li><strong>Clopidogrel:</strong> 300mg PO (if advised by receiving unit)</li>
            </ul>
          `
        };
        break;
        
      case 'sepsis':
        baseContent.content = {
          overview: "Sepsis is a life-threatening condition caused by the body's response to an infection. Early recognition and treatment are crucial.",
          assessment: `
            <h3>Sepsis Screening Tool</h3>
            <p>Consider sepsis in any patient with:</p>
            <ul>
              <li>Suspected infection AND</li>
              <li>NEWS2 score of 5 or more OR</li>
              <li>Any single NEWS2 parameter of 3</li>
            </ul>
            <h3>Red Flag Sepsis - Any of:</h3>
            <ul>
              <li>Respiratory rate ≥25/min or new need for oxygen</li>
              <li>Systolic BP ≤90mmHg or drop >40mmHg from baseline</li>
              <li>Heart rate ≥130/min</li>
              <li>New confusion or altered mental state</li>
              <li>Not passed urine in 18 hours / <0.5ml/kg/hr if catheterized</li>
              <li>Mottled or cyanotic skin, poor capillary refill</li>
            </ul>
          `,
          management: `
            <h3>Pre-hospital Sepsis Management</h3>
            <ol>
              <li><strong>Oxygen:</strong> Target 94-98% (or 88-92% if risk of hypercapnic respiratory failure)</li>
              <li><strong>IV Access:</strong> Obtain blood cultures if possible before antibiotics</li>
              <li><strong>Fluid:</strong> 500ml bolus crystalloid if SBP <90mmHg, assess response, further boluses as needed</li>
              <li><strong>Pre-alert:</strong> Inform receiving hospital of suspected sepsis</li>
            </ol>
            <h3>Hospital Handover - Key Information</h3>
            <ul>
              <li>Suspected source of infection</li>
              <li>Vital signs trends including response to fluids</li>
              <li>Risk factors and relevant medical history</li>
            </ul>
          `,
          medications: `
            <h3>Consider Pre-hospital Antibiotics if:</h3>
            <ul>
              <li>Transport time >1 hour</li>
              <li>Septic shock (SBP <90mmHg despite fluid)</li>
              <li>As per local protocols</li>
            </ul>
            <p>Antibiotic choice should follow local guidelines.</p>
          `
        };
        break;
        
      case 'asthma':
        baseContent.content = {
          overview: "Asthma exacerbations are characterized by progressive worsening of shortness of breath, cough, wheezing, or chest tightness.",
          assessment: `
            <h3>Severity Assessment</h3>
            <p><strong>Moderate:</strong></p>
            <ul>
              <li>Increasing symptoms</li>
              <li>SpO2 ≥92%</li>
              <li>Speech normal</li>
              <li>Respiratory rate elevated but <25/min</li>
              <li>Heart rate 100-120/min</li>
            </ul>
            <p><strong>Severe:</strong></p>
            <ul>
              <li>SpO2 <92%</li>
              <li>Can't complete sentences</li>
              <li>Respiratory rate ≥25/min</li>
              <li>Heart rate >120/min</li>
              <li>Use of accessory muscles</li>
            </ul>
            <p><strong>Life-threatening:</strong></p>
            <ul>
              <li>SpO2 <92% despite oxygen</li>
              <li>Silent chest, cyanosis, or feeble respiratory effort</li>
              <li>Altered consciousness, exhaustion</li>
              <li>Hypotension, bradycardia</li>
            </ul>
          `,
          management: `
            <h3>Initial Management</h3>
            <ol>
              <li><strong>Oxygen:</strong> Target SpO2 94-98%</li>
              <li><strong>Salbutamol:</strong> 4-10 puffs via spacer or nebulized if severe (driven by oxygen)</li>
              <li><strong>Ipratropium bromide:</strong> 0.5mg nebulized with salbutamol for severe/life-threatening</li>
              <li><strong>Steroids:</strong> Prednisolone 40-50mg PO or hydrocortisone 100mg IV if unable to take oral</li>
            </ol>
            <h3>If Not Improving</h3>
            <ol>
              <li>Continuous salbutamol nebulization</li>
              <li>Consider IV magnesium sulfate 1.2-2g over 20 mins for severe cases</li>
              <li>Consider IM adrenaline for anaphylaxis or life-threatening asthma not responding</li>
              <li>Pre-alert hospital if severe/life-threatening</li>
            </ol>
          `,
          medications: `
            <h3>Asthma Medications</h3>
            <ul>
              <li><strong>Salbutamol:</strong> 5mg nebulized or 4-10 puffs via spacer</li>
              <li><strong>Ipratropium bromide:</strong> 0.5mg nebulized with salbutamol</li>
              <li><strong>Prednisolone:</strong> 40-50mg PO</li>
              <li><strong>Hydrocortisone:</strong> 100mg IV (if unable to take oral)</li>
              <li><strong>Magnesium sulfate:</strong> 1.2-2g IV over 20 mins (for severe)</li>
              <li><strong>Adrenaline:</strong> 0.5mg IM (0.5ml of 1:1000) for life-threatening not responding</li>
            </ul>
          `
        };
        break;
        
      default:
        // Keep base content for other guidelines
        break;
    }
    
    return baseContent;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nhs-blue"></div>
      </div>
    );
  }
  
  if (error || !guidelineData) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || 'Unable to load guideline data'}. 
          <Button variant="link" asChild className="p-0 ml-2">
            <Link to="/guidelines">Return to guidelines</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          className="mr-2"
          asChild
        >
          <Link to="/guidelines">
            <ChevronLeft size={18} className="mr-1" />
            Back to Guidelines
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center mb-6">
        <BookOpen size={32} className="text-nhs-blue mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">{guidelineData.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{guidelineData.description}</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>{guidelineData.content.overview}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="assessment">
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: guidelineData.content.assessment }}
              ></div>
            </TabsContent>
            
            <TabsContent value="management">
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: guidelineData.content.management }}
              ></div>
            </TabsContent>
            
            <TabsContent value="medications">
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: guidelineData.content.medications }}
              ></div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">References</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            {guidelineData.references.map((ref, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{ref}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: May 2023</p>
            <p className="mt-1 text-xs">This guideline is for reference only. Always follow your local protocols and policies.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GuidelineDetail;
