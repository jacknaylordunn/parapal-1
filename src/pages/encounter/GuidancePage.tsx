
import { useState } from 'react';
import { Search, BookOpen, Pill, Calculator, ListTree, CheckSquare, Phone } from 'lucide-react';

// Placeholder data for clinical guidelines
const clinicalGuidelines = [
  {
    id: 'chest-pain',
    title: 'Chest Pain',
    category: 'Medical',
    content: `
      # Chest Pain Management
      
      ## Assessment
      - Character: crushing, sharp, dull, pressure
      - Radiation: arm, jaw, back
      - Associated symptoms: dyspnea, nausea, diaphoresis
      - Duration and onset
      - Exacerbating/relieving factors
      - Past cardiac history
      
      ## Management
      1. Position of comfort
      2. Oxygen if SpO2 < 94%
      3. IV access
      4. Cardiac monitoring
      5. 12-lead ECG within 10 minutes
      6. Consider:
         - Aspirin 300mg (if not allergic)
         - GTN spray 400mcg (if SBP > 90mmHg)
         - Morphine for pain relief
      
      ## Red Flags
      - ST elevation or depression on ECG
      - Hypotension
      - Arrhythmias
      - Pulmonary edema
      
      ## Differential Diagnosis
      - Acute Coronary Syndrome
      - Pulmonary Embolism
      - Aortic Dissection
      - Pneumothorax
      - Pericarditis
      
      **PLACEHOLDER: This is sample guidance only.**
    `
  },
  {
    id: 'stroke',
    title: 'Stroke/TIA',
    category: 'Medical',
    content: `
      # Stroke/TIA Management
      
      ## Assessment
      - FAST assessment:
        - Facial drooping
        - Arm weakness
        - Speech difficulties
        - Time to call for help
      - Time of onset is critical
      - Blood glucose (rule out hypoglycemia)
      - GCS and AVPU
      
      ## Management
      1. ABC assessment
      2. Oxygen if SpO2 < 94%
      3. Position: head elevated 30° if no trauma
      4. IV access
      5. Blood glucose check
      6. Transport to stroke center if within time window
      
      ## Red Flags
      - Seizures
      - Decreased level of consciousness
      - Vomiting
      - Severe headache
      - Hypertensive crisis
      
      ## Pre-alert Criteria
      - Symptom onset < 4.5 hours
      - Clear time of onset
      - Persisting neurological deficit
      
      **PLACEHOLDER: This is sample guidance only.**
    `
  }
];

// Placeholder data for drugs
const drugFormulary = [
  {
    id: 'aspirin',
    name: 'Aspirin',
    classification: 'Antiplatelet',
    indications: ['Chest pain of suspected cardiac origin', 'Acute myocardial infarction'],
    adultDose: '300mg chewed or dispersed in water, administered once',
    pediatricDose: 'Not routinely given to children in the pre-hospital setting',
    contraindications: [
      'Hypersensitivity to aspirin',
      'Active peptic ulceration',
      'Blood clotting disorders',
      'Children under 16 years (risk of Reye\'s syndrome)'
    ],
    sideEffects: [
      'Gastric irritation',
      'Nausea',
      'Vomiting',
      'Increased bleeding time'
    ],
    notes: 'PLACEHOLDER: This is sample formulary data only.'
  },
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    classification: 'Non-opioid analgesic',
    indications: ['Mild to moderate pain', 'Pyrexia'],
    adultDose: '1g orally or IV, up to 4 times daily. Maximum 4g in 24 hours.',
    pediatricDose: 'Age/weight dependent. 15mg/kg every 4-6 hours. Maximum 4 doses in 24 hours.',
    contraindications: [
      'Hypersensitivity to paracetamol',
      'Severe hepatic impairment'
    ],
    sideEffects: [
      'Generally well tolerated at therapeutic doses',
      'Rare: rash, blood disorders',
      'Overdose can cause hepatic necrosis'
    ],
    notes: 'PLACEHOLDER: This is sample formulary data only.'
  }
];

// Placeholder contact directory
const contactDirectory = [
  {
    id: 1,
    name: 'Emergency Department (General)',
    number: '01234 567890',
    category: 'Hospital'
  },
  {
    id: 2,
    name: 'Stroke Team',
    number: '01234 567891',
    category: 'Specialty'
  },
  {
    id: 3,
    name: 'Major Trauma Center',
    number: '01234 567892',
    category: 'Trauma'
  },
  {
    id: 4,
    name: 'Cardiac Catheter Lab',
    number: '01234 567893',
    category: 'Cardiology'
  },
  {
    id: 5,
    name: 'Clinical Support Desk',
    number: '01234 567894',
    category: 'Support'
  }
];

const GuidancePage = () => {
  const [activeTab, setActiveTab] = useState<string>('jrcalc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [selectedGuidelineId, setSelectedGuidelineId] = useState<string | null>(null);
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);
  
  // Filter guidelines and drugs based on search term
  const filteredGuidelines = clinicalGuidelines.filter(guideline =>
    searchTerm === '' || 
    guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guideline.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredDrugs = drugFormulary.filter(drug =>
    searchTerm === '' || 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.classification.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredContacts = contactDirectory.filter(contact =>
    searchTerm === '' || 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get selected guideline or drug
  const selectedGuideline = selectedGuidelineId 
    ? clinicalGuidelines.find(g => g.id === selectedGuidelineId) 
    : null;
    
  const selectedDrug = selectedDrugId
    ? drugFormulary.find(d => d.id === selectedDrugId)
    : null;
  
  // Handle phone call (placeholder)
  const handlePhoneCall = (phoneNumber: string) => {
    // In a real app, this would use the tel: protocol
    console.log(`Initiating call to: ${phoneNumber}`);
    window.open(`tel:${phoneNumber}`);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clinical Guidance</h1>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search guidelines, drugs, calculators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="clinical-input w-full pl-10"
        />
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        <NavButton
          active={activeTab === 'jrcalc'}
          onClick={() => setActiveTab('jrcalc')}
          icon={<BookOpen size={20} />}
          label="Guidelines"
        />
        <NavButton
          active={activeTab === 'drugs'}
          onClick={() => setActiveTab('drugs')}
          icon={<Pill size={20} />}
          label="Drug Formulary"
        />
        <NavButton
          active={activeTab === 'calculators'}
          onClick={() => setActiveTab('calculators')}
          icon={<Calculator size={20} />}
          label="Calculators"
        />
        <NavButton
          active={activeTab === 'algorithms'}
          onClick={() => setActiveTab('algorithms')}
          icon={<ListTree size={20} />}
          label="Algorithms"
        />
        <NavButton
          active={activeTab === 'checklists'}
          onClick={() => setActiveTab('checklists')}
          icon={<CheckSquare size={20} />}
          label="Checklists"
        />
        <NavButton
          active={activeTab === 'contacts'}
          onClick={() => setActiveTab('contacts')}
          icon={<Phone size={20} />}
          label="Contacts"
        />
      </div>
      
      {/* Content for each tab */}
      <div className="clinical-card">
        {/* JRCALC Guidelines */}
        {activeTab === 'jrcalc' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">JRCALC Clinical Guidelines</h2>
            
            {selectedGuideline ? (
              <div>
                <button
                  onClick={() => setSelectedGuidelineId(null)}
                  className="mb-4 text-nhs-blue hover:text-nhs-dark-blue flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Back to Guidelines
                </button>
                
                <h3 className="text-xl font-bold mb-2">{selectedGuideline.title}</h3>
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md mb-4">
                  <span className="text-sm">Category: {selectedGuideline.category}</span>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  {selectedGuideline.content.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-bold mt-3 mb-2">{line.substring(3)}</h2>;
                    } else if (line.startsWith('- ')) {
                      return <p key={index} className="pl-4 my-1">• {line.substring(2)}</p>;
                    } else if (line.startsWith('  - ')) {
                      return <p key={index} className="pl-8 my-1">◦ {line.substring(4)}</p>;
                    } else if (line.startsWith('     - ')) {
                      return <p key={index} className="pl-12 my-1">▪ {line.substring(7)}</p>;
                    } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || 
                              line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ')) {
                      return <p key={index} className="pl-4 my-1">{line}</p>;
                    } else if (line.startsWith('**')) {
                      return <p key={index} className="font-bold my-2">{line.replace(/\*\*/g, '')}</p>;
                    } else if (line.trim() === '') {
                      return <div key={index} className="h-2">&#x200B;</div>;
                    } else {
                      return <p key={index} className="my-2">{line}</p>;
                    }
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuidelines.length > 0 ? (
                  filteredGuidelines.map(guideline => (
                    <div 
                      key={guideline.id}
                      onClick={() => setSelectedGuidelineId(guideline.id)}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <h3 className="font-semibold text-nhs-blue">{guideline.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{guideline.category}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center p-8">
                    <p className="text-gray-500 dark:text-gray-400">No guidelines found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Drug Formulary */}
        {activeTab === 'drugs' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Drug Formulary</h2>
            
            {selectedDrug ? (
              <div>
                <button
                  onClick={() => setSelectedDrugId(null)}
                  className="mb-4 text-nhs-blue hover:text-nhs-dark-blue flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Back to Formulary
                </button>
                
                <h3 className="text-xl font-bold mb-2">{selectedDrug.name}</h3>
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md mb-4">
                  <span className="text-sm">Classification: {selectedDrug.classification}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-nhs-blue">Indications</h4>
                    <ul className="list-disc pl-5 mt-2">
                      {selectedDrug.indications.map((indication, index) => (
                        <li key={index}>{indication}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
                      <h4 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">Adult Dose</h4>
                      <p>{selectedDrug.adultDose}</p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-md">
                      <h4 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">Paediatric Dose</h4>
                      <p>{selectedDrug.pediatricDose}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-red-600">Contraindications</h4>
                    <ul className="list-disc pl-5 mt-2">
                      {selectedDrug.contraindications.map((contraindication, index) => (
                        <li key={index}>{contraindication}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-amber-600">Side Effects</h4>
                    <ul className="list-disc pl-5 mt-2">
                      {selectedDrug.sideEffects.map((sideEffect, index) => (
                        <li key={index}>{sideEffect}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedDrug.notes && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <p className="italic">{selectedDrug.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDrugs.length > 0 ? (
                  filteredDrugs.map(drug => (
                    <div 
                      key={drug.id}
                      onClick={() => setSelectedDrugId(drug.id)}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <h3 className="font-semibold text-nhs-blue">{drug.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{drug.classification}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center p-8">
                    <p className="text-gray-500 dark:text-gray-400">No drugs found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Calculators */}
        {activeTab === 'calculators' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Clinical Calculators</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Paediatric Drug Dose Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Calculate medication doses based on weight or age.</p>
                <button className="px-4 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md">
                  Open Calculator
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Burn Surface Area</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Calculate TBSA using Rule of Nines or Lund-Browder.</p>
                <button className="px-4 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md">
                  Open Calculator
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">GCS Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Calculate Glasgow Coma Scale score.</p>
                <button className="px-4 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md">
                  Open Calculator
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">IV Fluid Rate</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Calculate drip rates for IV fluid administration.</p>
                <button className="px-4 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md">
                  Open Calculator
                </button>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md">
              <p className="text-amber-800 dark:text-amber-300 text-center">
                PLACEHOLDER: Calculator functionality will be implemented in future versions.
              </p>
            </div>
          </div>
        )}
        
        {/* Algorithms */}
        {activeTab === 'algorithms' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Clinical Algorithms</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">ALS Cardiac Arrest</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Resuscitation Council UK algorithm</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Anaphylaxis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Management of severe allergic reactions</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Major Hemorrhage</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Management of severe bleeding</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Sepsis Screening</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">UK Sepsis Trust screening tool</p>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md">
              <p className="text-amber-800 dark:text-amber-300 text-center">
                PLACEHOLDER: Algorithms will be implemented in future versions.
              </p>
            </div>
          </div>
        )}
        
        {/* Checklists */}
        {activeTab === 'checklists' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Clinical Checklists</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">RSI Preparation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Preparation for rapid sequence induction</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Obstetric Assessment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emergency delivery preparation</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Major Trauma Primary Survey</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">CABCDE assessment for trauma patients</p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-nhs-blue mb-2">Vehicle Extrication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Safe extrication procedures</p>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md">
              <p className="text-amber-800 dark:text-amber-300 text-center">
                PLACEHOLDER: Interactive checklists will be implemented in future versions.
              </p>
            </div>
          </div>
        )}
        
        {/* Contacts Directory */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Directory</h2>
            
            {filteredContacts.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredContacts.map(contact => (
                      <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {contact.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {contact.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            onClick={() => handlePhoneCall(contact.number)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center ml-auto"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Call
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500 dark:text-gray-400">No contacts found matching "{searchTerm}"</p>
              </div>
            )}
            
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md">
              <p className="text-amber-800 dark:text-amber-300 text-center">
                PLACEHOLDER: Phone functionality depends on device capabilities.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Navigation Button Component
const NavButton = ({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  label: string 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-nhs-blue text-white' 
          : 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

export default GuidancePage;
