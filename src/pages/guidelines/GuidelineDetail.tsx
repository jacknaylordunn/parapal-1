
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guidelineCategories } from '../Guidelines';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BookOpen, ChevronLeft } from 'lucide-react';
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
  content: Record<string, string>;
  references: string[];
  lastUpdated: string;
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
    
    // Simulate loading guideline content
    setLoading(true);
    
    // Use setTimeout to simulate loading time
    setTimeout(() => {
      // Get guideline content
      const guidelineContent = getGuidelineContent(categoryId, guidelineId);
      setGuidelineData(guidelineContent);
      setLoading(false);
    }, 300);
  }, [categoryId, guidelineId]);
  
  // This function provides the actual guideline content
  const getGuidelineContent = (categoryId: string, guidelineId: string): GuidelineContent => {
    // Find guideline info
    const category = guidelineCategories.find(c => c.id === categoryId);
    const guideline = category?.guidelines.find(g => g.id === guidelineId);
    
    const baseData: GuidelineContent = {
      title: guideline?.title || "Unknown Guideline",
      description: `${category?.name || "Clinical"} Guidelines`,
      content: {
        overview: "This guideline provides evidence-based recommendations for practice.",
        assessment: "Assessment details will be described here.",
        management: "Management protocols will be outlined here.",
        medications: "Relevant medications will be listed here."
      },
      references: [
        "JRCALC Guidelines 2023",
        "UK Ambulance Services Clinical Practice Guidelines",
        "National Institute for Health and Care Excellence (NICE)"
      ],
      lastUpdated: "May 2023"
    };

    // Populate with actual content based on guideline ID
    switch (guidelineId) {
      // CARDIAC GUIDELINES
      case 'acs':
        return {
          ...baseData,
          content: {
            overview: `
              <h3>Acute Coronary Syndrome (ACS)</h3>
              <p>ACS refers to a spectrum of conditions caused by acute myocardial ischemia including:</p>
              <ul>
                <li>ST-elevation myocardial infarction (STEMI)</li>
                <li>Non-ST-elevation myocardial infarction (NSTEMI)</li>
                <li>Unstable angina</li>
              </ul>
              <p>Early recognition and appropriate management are critical to improving outcomes.</p>
            `,
            assessment: `
              <h3>History</h3>
              <p>Typical symptoms include:</p>
              <ul>
                <li>Central chest pain/discomfort/pressure/heaviness</li>
                <li>Radiation to left arm, neck, jaw, back or epigastrium</li>
                <li>Dyspnoea</li>
                <li>Nausea/vomiting</li>
                <li>Sweating/clamminess</li>
                <li>Anxiety or sense of impending doom</li>
              </ul>
              
              <h3>Risk Factors</h3>
              <ul>
                <li>Age (men >45, women >55)</li>
                <li>Smoking</li>
                <li>Diabetes mellitus</li>
                <li>Hypertension</li>
                <li>Hyperlipidaemia</li>
                <li>Family history of premature CAD</li>
                <li>Previous ACS, PCI or CABG</li>
              </ul>
              
              <h3>Examination</h3>
              <ul>
                <li>Vital signs (look for hypotension, tachycardia)</li>
                <li>Signs of heart failure (pulmonary oedema, raised JVP)</li>
                <li>12-lead ECG - obtain within 10 minutes of first contact</li>
              </ul>
              
              <h3>12-Lead ECG Interpretation</h3>
              <p><strong>STEMI Criteria:</strong></p>
              <ul>
                <li>New ST elevation at J point in two contiguous leads:</li>
                <li>≥2mm in men or ≥1.5mm in women in leads V2-V3</li>
                <li>≥1mm in other contiguous chest or limb leads</li>
                <li>New LBBB with concordant ST changes</li>
              </ul>
            `,
            management: `
              <h3>Initial Management (All ACS)</h3>
              <ol>
                <li>Position patient comfortably (usually semi-recumbent)</li>
                <li>Administer oxygen if SpO2 <94% (aim for 94-98%)</li>
                <li>Gain IV access</li>
                <li>Administer:
                  <ul>
                    <li>Aspirin 300mg to be chewed</li>
                    <li>GTN spray/tablets 400mcg SL (if SBP >90mmHg, repeat every 5 minutes up to 3 doses)</li>
                    <li>Consider analgesia: morphine 2-5mg IV titrated to response plus anti-emetic</li>
                  </ul>
                </li>
              </ol>
              
              <h3>For Confirmed STEMI</h3>
              <ol>
                <li>Pre-alert receiving hospital - state "STEMI"</li>
                <li>Consider secondary prevention medication according to local protocols:
                  <ul>
                    <li>Ticagrelor 180mg or Clopidogrel 300mg (based on local pathway)</li>
                  </ul>
                </li>
                <li>Expedite transport to primary PCI center if available and within time limits (typically 120 mins from first medical contact)</li>
                <li>If primary PCI not available within timeframes, consider pre-hospital thrombolysis if available and indicated</li>
              </ol>
              
              <h3>For NSTEMI/Unstable Angina</h3>
              <ol>
                <li>Transport to nearest appropriate facility</li>
                <li>Continue symptomatic relief</li>
                <li>Pre-alert if high-risk features present:
                  <ul>
                    <li>Hemodynamic instability</li>
                    <li>Ongoing chest pain despite treatment</li>
                    <li>Dynamic ECG changes</li>
                    <li>Heart failure</li>
                  </ul>
                </li>
              </ol>
            `,
            medications: `
              <h3>Key Medications</h3>
              <table class="border-collapse border border-gray-300 w-full mt-2">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">Medication</th>
                    <th class="border border-gray-300 px-4 py-2">Dose</th>
                    <th class="border border-gray-300 px-4 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Aspirin</td>
                    <td class="border border-gray-300 px-4 py-2">300mg</td>
                    <td class="border border-gray-300 px-4 py-2">To be chewed. Unless contraindicated or already administered</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Glyceryl Trinitrate (GTN)</td>
                    <td class="border border-gray-300 px-4 py-2">400mcg SL</td>
                    <td class="border border-gray-300 px-4 py-2">Repeat every 5 mins if needed (max 3 doses). SBP must be >90mmHg</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Morphine</td>
                    <td class="border border-gray-300 px-4 py-2">2-5mg IV</td>
                    <td class="border border-gray-300 px-4 py-2">Titrate to pain relief. Consider antiemetic</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Ticagrelor</td>
                    <td class="border border-gray-300 px-4 py-2">180mg PO</td>
                    <td class="border border-gray-300 px-4 py-2">Per local protocol for STEMI</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Clopidogrel</td>
                    <td class="border border-gray-300 px-4 py-2">300mg PO</td>
                    <td class="border border-gray-300 px-4 py-2">Alternative to Ticagrelor per local protocol</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Contraindications</h3>
              <p><strong>Aspirin:</strong> Known hypersensitivity, active gastrointestinal bleeding</p>
              <p><strong>GTN:</strong> Hypotension (SBP <90mmHg), severe bradycardia/tachycardia, right ventricular infarction, use of PDE5 inhibitors within 24-48 hours</p>
              <p><strong>Antiplatelet agents:</strong> Active bleeding, history of intracranial hemorrhage</p>
            `
          }
        };
        
      case 'ca':
        return {
          ...baseData,
          content: {
            overview: `
              <h3>Cardiac Arrest</h3>
              <p>Cardiac arrest is the cessation of cardiac mechanical activity, confirmed by the absence of a detectable pulse, unresponsiveness, and apnea or agonal gasping respirations.</p>
              <p>Immediate recognition and intervention are essential for improving survival outcomes.</p>
            `,
            assessment: `
              <h3>Recognition of Cardiac Arrest</h3>
              <ol>
                <li>Check responsiveness (gently shake and call loudly)</li>
                <li>Open airway (head tilt-chin lift or jaw thrust if trauma suspected)</li>
                <li>Look, listen and feel for normal breathing (take no more than 10 seconds)</li>
                <li>Simultaneously check for signs of circulation</li>
              </ol>
              
              <h3>Confirmation of Cardiac Arrest</h3>
              <ul>
                <li>Unresponsive</li>
                <li>Absent or abnormal breathing (agonal gasps)</li>
                <li>No signs of circulation</li>
              </ul>
              
              <h3>Initial ECG Rhythms in Cardiac Arrest</h3>
              <ul>
                <li><strong>Shockable rhythms:</strong>
                  <ul>
                    <li>Ventricular Fibrillation (VF)</li>
                    <li>Pulseless Ventricular Tachycardia (pVT)</li>
                  </ul>
                </li>
                <li><strong>Non-shockable rhythms:</strong>
                  <ul>
                    <li>Asystole</li>
                    <li>Pulseless Electrical Activity (PEA)</li>
                  </ul>
                </li>
              </ul>
            `,
            management: `
              <h3>Adult Basic Life Support (BLS)</h3>
              <ol>
                <li>Ensure safety of rescuer and victim</li>
                <li>Check responsiveness and breathing</li>
                <li>Call for help and activate emergency response system</li>
                <li>Start chest compressions:
                  <ul>
                    <li>Place heel of one hand on center of chest (lower half of sternum)</li>
                    <li>Place other hand on top</li>
                    <li>Compress at rate of 100-120 per minute</li>
                    <li>Compress chest to depth of 5-6 cm</li>
                    <li>Allow complete chest recoil after each compression</li>
                  </ul>
                </li>
                <li>Open airway and give rescue breaths (30:2 ratio)</li>
                <li>Continue until AED/defibrillator arrives or advanced help takes over</li>
              </ol>
              
              <h3>Adult Advanced Life Support (ALS)</h3>
              <h4>Shockable Rhythm (VF/pVT)</h4>
              <ol>
                <li>Give one shock (120-200J biphasic or 360J monophasic)</li>
                <li>Resume CPR 30:2 immediately for 2 minutes</li>
                <li>Minimize interruptions to chest compressions</li>
                <li>Establish IV/IO access</li>
                <li>Administer Adrenaline 1mg IV/IO after 3rd shock, then every 3-5 minutes</li>
                <li>Administer Amiodarone 300mg IV/IO after 3rd shock</li>
                <li>Consider and treat reversible causes (4Hs and 4Ts)</li>
              </ol>
              
              <h4>Non-shockable Rhythm (Asystole/PEA)</h4>
              <ol>
                <li>Continue CPR 30:2</li>
                <li>Establish IV/IO access</li>
                <li>Administer Adrenaline 1mg IV/IO as soon as possible, then every 3-5 minutes</li>
                <li>Consider and treat reversible causes (4Hs and 4Ts)</li>
                <li>Reassess rhythm every 2 minutes</li>
              </ol>
              
              <h3>Post-Resuscitation Care</h3>
              <ol>
                <li>Optimize oxygenation and ventilation (aim for SpO2 94-98%, normal CO2)</li>
                <li>12-lead ECG</li>
                <li>Treat precipitating causes</li>
                <li>Temperature management (target 36°C)</li>
                <li>Pre-alert receiving facility</li>
              </ol>
              
              <h3>Reversible Causes (4Hs and 4Ts)</h3>
              <ul>
                <li><strong>4Hs:</strong>
                  <ul>
                    <li>Hypoxia - ensure adequate oxygenation</li>
                    <li>Hypovolemia - IV fluid resuscitation</li>
                    <li>Hypothermia - active rewarming</li>
                    <li>Hypo/hyperkalemia and other metabolic disorders - treat accordingly</li>
                  </ul>
                </li>
                <li><strong>4Ts:</strong>
                  <ul>
                    <li>Tension pneumothorax - needle decompression/thoracostomy</li>
                    <li>Tamponade, cardiac - pericardiocentesis if trained and equipped</li>
                    <li>Thrombosis (coronary or pulmonary) - consider thrombolysis</li>
                    <li>Toxins - consider specific antidotes</li>
                  </ul>
                </li>
              </ul>
            `,
            medications: `
              <h3>Key Medications in Cardiac Arrest</h3>
              <table class="border-collapse border border-gray-300 w-full mt-2">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">Medication</th>
                    <th class="border border-gray-300 px-4 py-2">Dose</th>
                    <th class="border border-gray-300 px-4 py-2">Indication/Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Adrenaline (Epinephrine)</td>
                    <td class="border border-gray-300 px-4 py-2">1mg IV/IO</td>
                    <td class="border border-gray-300 px-4 py-2">
                      - Shockable: After 3rd shock, then every 3-5 minutes<br>
                      - Non-shockable: As soon as possible, then every 3-5 minutes
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Amiodarone</td>
                    <td class="border border-gray-300 px-4 py-2">
                      300mg IV/IO after 3rd shock<br>
                      150mg IV/IO after 5th shock
                    </td>
                    <td class="border border-gray-300 px-4 py-2">For refractory VF/pVT</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Fluids</td>
                    <td class="border border-gray-300 px-4 py-2">250-500ml boluses</td>
                    <td class="border border-gray-300 px-4 py-2">For hypovolemia or when hypovolemia suspected</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Advanced Airway Management</h3>
              <p>Options include:</p>
              <ul>
                <li>Supraglottic airway device (e.g., i-gel, LMA)</li>
                <li>Endotracheal intubation (for those trained and competent)</li>
              </ul>
              <p>Once advanced airway placed:</p>
              <ul>
                <li>Confirm correct placement</li>
                <li>Secure device</li>
                <li>Provide continuous compressions without pauses for ventilation</li>
                <li>Ventilate at 10 breaths/minute</li>
                <li>Monitor ETCO2 when available (helps confirm tube placement and may indicate ROSC)</li>
              </ul>
            `
          }
        };

      // RESPIRATORY CONDITIONS
      case 'asthma':
        return {
          ...baseData,
          content: {
            overview: `
              <h3>Asthma</h3>
              <p>Asthma is a chronic inflammatory disorder characterized by airway hyperresponsiveness and variable airflow obstruction. Exacerbations can be life-threatening and require prompt recognition and management.</p>
              <p>Pre-hospital assessment focuses on identifying the severity of the exacerbation and initiating appropriate treatment.</p>
            `,
            assessment: `
              <h3>Assessment of Asthma Severity</h3>
              
              <h4>Moderate Asthma</h4>
              <ul>
                <li>Increasing symptoms</li>
                <li>SpO2 ≥92%</li>
                <li>PEF >50% best or predicted</li>
                <li>Able to talk in sentences</li>
                <li>Respiratory rate 20-25/min</li>
                <li>Heart rate 100-120/min</li>
                <li>Use of accessory muscles</li>
              </ul>
              
              <h4>Severe Asthma</h4>
              <ul>
                <li>SpO2 <92%</li>
                <li>PEF 33-50% best or predicted</li>
                <li>Cannot complete sentences in one breath</li>
                <li>Respiratory rate >25/min</li>
                <li>Heart rate >120/min</li>
                <li>Marked use of accessory muscles</li>
              </ul>
              
              <h4>Life-threatening Asthma</h4>
              <ul>
                <li>SpO2 <92% with maximal oxygen</li>
                <li>PEF <33% best or predicted</li>
                <li>Silent chest, cyanosis, poor respiratory effort</li>
                <li>Altered consciousness, exhaustion</li>
                <li>Hypotension, arrhythmia</li>
                <li>Reduced carbon dioxide (normal/high indicates severe fatigue)</li>
              </ul>
              
              <h3>History Taking</h3>
              <ul>
                <li>Duration and severity of symptoms</li>
                <li>Medication use (including recent steroid use)</li>
                <li>Previous hospital admissions or ITU admissions</li>
                <li>Known triggers</li>
                <li>Response to any treatment already given</li>
              </ul>
            `,
            management: `
              <h3>Initial Management</h3>
              <ol>
                <li><strong>Position:</strong> Sit patient upright</li>
                <li><strong>Oxygen:</strong> Target SpO2 94-98%</li>
                <li><strong>Bronchodilators:</strong>
                  <ul>
                    <li>Salbutamol 4-10 puffs via spacer (mild-moderate) or 5mg nebulized (severe)</li>
                    <li>Ipratropium bromide 0.5mg nebulized with salbutamol for severe/life-threatening</li>
                  </ul>
                </li>
                <li><strong>Steroids:</strong> Prednisolone 40-50mg PO or hydrocortisone 100mg IV if unable to take oral medication</li>
              </ol>
              
              <h3>Management of Severe/Life-threatening Asthma</h3>
              <ol>
                <li>Consider continuous salbutamol nebulization</li>
                <li>Consider IV magnesium sulfate 1.2-2g over 20 minutes</li>
                <li>In extreme cases, consider IM adrenaline 0.5mg (0.5ml of 1:1000)</li>
                <li>Pre-alert receiving hospital</li>
                <li>Monitor closely for deterioration</li>
              </ol>
              
              <h3>Management Algorithm</h3>
              <h4>Moderate Exacerbation</h4>
              <ol>
                <li>Salbutamol 4-10 puffs via spacer (repeat after 10-20 mins if needed)</li>
                <li>Prednisolone 40-50mg PO</li>
                <li>Reassess after 15-30 minutes</li>
                <li>If improving: consider discharge with GP follow-up</li>
                <li>If not improving: escalate to severe protocol</li>
              </ol>
              
              <h4>Severe Exacerbation</h4>
              <ol>
                <li>Oxygen to maintain SpO2 94-98%</li>
                <li>Nebulized salbutamol 5mg + ipratropium 0.5mg</li>
                <li>Steroids: Prednisolone 40-50mg PO or hydrocortisone 100mg IV</li>
                <li>Repeat nebulizers every 15-30 mins as needed</li>
                <li>Transport to hospital</li>
                <li>Consider IV magnesium sulfate if no response</li>
              </ol>
              
              <h4>Life-threatening Features</h4>
              <ol>
                <li>Call for immediate assistance</li>
                <li>High-flow oxygen</li>
                <li>Continuous nebulized salbutamol</li>
                <li>Immediate IV hydrocortisone 100mg</li>
                <li>Consider IV magnesium sulfate 1.2-2g over 20 mins</li>
                <li>Consider IM adrenaline 0.5mg in extremis</li>
                <li>Pre-alert hospital</li>
                <li>Prepare for assisted ventilation if deteriorating</li>
              </ol>
            `,
            medications: `
              <h3>Key Medications for Asthma Management</h3>
              <table class="border-collapse border border-gray-300 w-full mt-2">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">Medication</th>
                    <th class="border border-gray-300 px-4 py-2">Dose</th>
                    <th class="border border-gray-300 px-4 py-2">Route</th>
                    <th class="border border-gray-300 px-4 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Salbutamol</td>
                    <td class="border border-gray-300 px-4 py-2">
                      4-10 puffs<br>
                      5mg<br>
                      5mg continuous
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      MDI via spacer<br>
                      Nebulized<br>
                      Nebulized
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      For mild-moderate<br>
                      For severe<br>
                      For life-threatening
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Ipratropium Bromide</td>
                    <td class="border border-gray-300 px-4 py-2">0.5mg</td>
                    <td class="border border-gray-300 px-4 py-2">Nebulized</td>
                    <td class="border border-gray-300 px-4 py-2">For severe/life-threatening, combined with salbutamol</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Prednisolone</td>
                    <td class="border border-gray-300 px-4 py-2">40-50mg</td>
                    <td class="border border-gray-300 px-4 py-2">Oral</td>
                    <td class="border border-gray-300 px-4 py-2">For all exacerbations requiring bronchodilators</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Hydrocortisone</td>
                    <td class="border border-gray-300 px-4 py-2">100mg</td>
                    <td class="border border-gray-300 px-4 py-2">IV</td>
                    <td class="border border-gray-300 px-4 py-2">If unable to take oral medication</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Magnesium Sulfate</td>
                    <td class="border border-gray-300 px-4 py-2">1.2-2g</td>
                    <td class="border border-gray-300 px-4 py-2">IV over 20 mins</td>
                    <td class="border border-gray-300 px-4 py-2">For severe asthma unresponsive to initial treatment</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Adrenaline</td>
                    <td class="border border-gray-300 px-4 py-2">0.5mg (0.5ml of 1:1000)</td>
                    <td class="border border-gray-300 px-4 py-2">IM</td>
                    <td class="border border-gray-300 px-4 py-2">For life-threatening asthma not responding to other treatments</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Oxygen Therapy</h3>
              <ul>
                <li>Target SpO2 94-98%</li>
                <li>Use appropriate delivery device based on patient needs</li>
                <li>High-flow oxygen for life-threatening asthma</li>
              </ul>
              
              <h3>Additional Notes</h3>
              <ul>
                <li>Do not delay transfer to hospital in severe cases</li>
                <li>Patients with life-threatening features need immediate hospital treatment</li>
                <li>Monitor response to treatment closely</li>
                <li>Reassess after each intervention</li>
              </ul>
            `
          }
        };

      // MEDICAL EMERGENCIES
      case 'sepsis':
        return {
          ...baseData,
          content: {
            overview: `
              <h3>Sepsis</h3>
              <p>Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. It represents a medical emergency requiring rapid assessment and intervention.</p>
              <p>Early recognition and treatment of sepsis significantly improves patient outcomes. The pre-hospital setting presents an important opportunity for early identification and initial management.</p>
            `,
            assessment: `
              <h3>Screening for Sepsis</h3>
              <p>Consider sepsis in any patient with:</p>
              <ol>
                <li>Suspected or confirmed infection AND</li>
                <li>NEWS2 score of 5 or more OR</li>
                <li>Any single NEWS2 parameter of 3</li>
              </ol>
              
              <h3>Red Flag Sepsis Criteria</h3>
              <p>Any of the following in a patient with suspected infection:</p>
              <ul>
                <li>Systolic BP ≤90 mmHg or MAP ≤65 mmHg</li>
                <li>Reduction in systolic BP of >40 mmHg from baseline</li>
                <li>Heart rate >130 beats per minute</li>
                <li>Respiratory rate ≥25 breaths per minute</li>
                <li>Requires oxygen to maintain SpO2 >92% (88% in COPD)</li>
                <li>Non-blanching rash, mottled/ashen/cyanotic</li>
                <li>Not passed urine in 18 hours (or <0.5 ml/kg/hr if catheterized)</li>
                <li>Lactate ≥2 mmol/l (if available)</li>
                <li>Recent chemotherapy (within 6 weeks)</li>
              </ul>
              
              <h3>Signs of Organ Dysfunction</h3>
              <ul>
                <li>Altered mental status - confusion, disorientation</li>
                <li>Respiratory - hypoxemia, increased work of breathing</li>
                <li>Cardiovascular - hypotension, tachycardia</li>
                <li>Renal - reduced urine output</li>
                <li>Liver - jaundice</li>
                <li>Coagulation - petechiae, ecchymosis</li>
                <li>Metabolic - hyperlactatemia (if measurable)</li>
              </ul>
              
              <h3>Common Sources of Infection</h3>
              <ul>
                <li>Respiratory tract</li>
                <li>Urinary tract</li>
                <li>Abdominal/gastrointestinal</li>
                <li>Skin/soft tissue</li>
                <li>Central nervous system</li>
                <li>Endocarditis</li>
                <li>Device-related</li>
                <li>Indeterminate</li>
              </ul>
            `,
            management: `
              <h3>Pre-hospital Management</h3>
              <ol>
                <li><strong>Administer oxygen:</strong>
                  <ul>
                    <li>Target SpO2 94-98% (or 88-92% in patients at risk of hypercapnic respiratory failure)</li>
                  </ul>
                </li>
                <li><strong>Obtain intravenous access:</strong>
                  <ul>
                    <li>Two large-bore IV cannulae if possible</li>
                    <li>Consider drawing blood cultures if equipment available and this won't delay transport</li>
                  </ul>
                </li>
                <li><strong>Fluid resuscitation:</strong>
                  <ul>
                    <li>If SBP <90 mmHg: Administer 500ml crystalloid bolus</li>
                    <li>Reassess after each bolus</li>
                    <li>Further 250-500ml boluses as required based on response</li>
                  </ul>
                </li>
                <li><strong>Monitor:</strong>
                  <ul>
                    <li>Vital signs, especially BP, HR, RR, SpO2</li>
                    <li>Mental status</li>
                    <li>Urine output if possible</li>
                  </ul>
                </li>
                <li><strong>Pre-alert receiving hospital:</strong>
                  <ul>
                    <li>Clearly communicate concern for sepsis</li>
                    <li>Provide details of suspected source</li>
                    <li>Report interventions given and response</li>
                  </ul>
                </li>
              </ol>
              
              <h3>Time-critical Actions</h3>
              <p>"Sepsis Six" - ideally within first hour:</p>
              <ol>
                <li>Oxygen therapy</li>
                <li>Blood cultures (in hospital)</li>
                <li>IV antibiotics (hospital or pre-hospital per local protocol)</li>
                <li>IV fluid resuscitation</li>
                <li>Measure lactate (in hospital)</li>
                <li>Monitor urine output (in hospital)</li>
              </ol>
              
              <h3>Transport Considerations</h3>
              <ul>
                <li>Expedite transport to appropriate facility</li>
                <li>Consider bypassing local facility for sepsis center if per local protocol</li>
                <li>Continue monitoring and resuscitation en route</li>
                <li>Pre-alert receiving facility using structured communication tool</li>
              </ul>
            `,
            medications: `
              <h3>Pre-hospital Antibiotic Therapy</h3>
              <p>Consider pre-hospital antibiotics if:</p>
              <ul>
                <li>Transport time >45-60 minutes</li>
                <li>Patient has septic shock (SBP <90mmHg despite fluid)</li>
                <li>Local protocols support administration</li>
              </ul>
              
              <h3>Common Pre-hospital Antibiotics</h3>
              <table class="border-collapse border border-gray-300 w-full mt-2">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">Antibiotic</th>
                    <th class="border border-gray-300 px-4 py-2">Dose</th>
                    <th class="border border-gray-300 px-4 py-2">Indication</th>
                    <th class="border border-gray-300 px-4 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Ceftriaxone</td>
                    <td class="border border-gray-300 px-4 py-2">2g IV</td>
                    <td class="border border-gray-300 px-4 py-2">Broad-spectrum coverage</td>
                    <td class="border border-gray-300 px-4 py-2">First-line in many protocols</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Amoxicillin-Clavulanate</td>
                    <td class="border border-gray-300 px-4 py-2">1.2g IV</td>
                    <td class="border border-gray-300 px-4 py-2">Community-acquired infection</td>
                    <td class="border border-gray-300 px-4 py-2">Good for respiratory/abdominal sources</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Gentamicin</td>
                    <td class="border border-gray-300 px-4 py-2">5mg/kg IV</td>
                    <td class="border border-gray-300 px-4 py-2">Gram-negative coverage</td>
                    <td class="border border-gray-300 px-4 py-2">Often given with other antibiotics</td>
                  </tr>
                </tbody>
              </table>
              <p class="text-sm italic mt-2">Note: Specific antibiotic choice should follow local antimicrobial guidelines and protocols.</p>
              
              <h3>IV Fluid Therapy</h3>
              <table class="border-collapse border border-gray-300 w-full mt-4">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">Type</th>
                    <th class="border border-gray-300 px-4 py-2">Initial Dose</th>
                    <th class="border border-gray-300 px-4 py-2">Subsequent Doses</th>
                    <th class="border border-gray-300 px-4 py-2">Monitoring</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Balanced crystalloid (e.g., Hartmann's)</td>
                    <td class="border border-gray-300 px-4 py-2">500ml IV bolus</td>
                    <td class="border border-gray-300 px-4 py-2">250-500ml bolus</td>
                    <td class="border border-gray-300 px-4 py-2">
                      Reassess after each bolus:<br>
                      - Blood pressure<br>
                      - Heart rate<br>
                      - Capillary refill<br>
                      - Mental status
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">0.9% Sodium Chloride</td>
                    <td class="border border-gray-300 px-4 py-2">500ml IV bolus</td>
                    <td class="border border-gray-300 px-4 py-2">250-500ml bolus</td>
                    <td class="border border-gray-300 px-4 py-2">As above</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Vasopressors</h3>
              <p>Rarely used in pre-hospital setting unless:</p>
              <ul>
                <li>Extended transport times</li>
                <li>Persistent shock despite adequate fluid resuscitation</li>
                <li>Critical care retrieval team available</li>
              </ul>
              <p>If used, norepinephrine is preferred agent (2-20 mcg/min, titrated to effect).</p>
            `
          }
        };

      // TRAUMA GUIDELINES
      case 'tbi':
        return {
          ...baseData,
          content: {
            overview: `
              <h3>Traumatic Brain Injury (TBI)</h3>
              <p>TBI is defined as an alteration in brain function or evidence of brain pathology caused by an external force. It's a leading cause of death and disability, particularly in young adults.</p>
              <p>Pre-hospital management focuses on preventing secondary brain injury by maintaining adequate cerebral perfusion and oxygenation.</p>
            `,
            assessment: `
              <h3>Initial Assessment</h3>
              <p>Follow the <strong>C-ABC</strong> approach:</p>
              <ol>
                <li><strong>Catastrophic hemorrhage</strong> - Control any major external bleeding</li>
                <li><strong>Airway</strong> - Assess and maintain, with cervical spine protection</li>
                <li><strong>Breathing</strong> - Assess and support</li>
                <li><strong>Circulation</strong> - Assess and support</li>
                <li><strong>Disability</strong> - Assess neurological status</li>
              </ol>
              
              <h3>Neurological Assessment</h3>
              <h4>Glasgow Coma Scale (GCS)</h4>
              <table class="border-collapse border border-gray-300 w-full mt-2">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-1">Response</th>
                    <th class="border border-gray-300 px-4 py-1">Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1" colspan="2"><strong>Eye Opening (E)</strong></td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Spontaneous</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">4</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">To sound</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">3</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">To pressure</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">2</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">None</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">1</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1" colspan="2"><strong>Verbal Response (V)</strong></td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Oriented</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">5</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Confused</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">4</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Words</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">3</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Sounds</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">2</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">None</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">1</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1" colspan="2"><strong>Motor Response (M)</strong></td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Obeys commands</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">6</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Localizing</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">5</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Normal flexion</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">4</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Abnormal flexion</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">3</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">Extension</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">2</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-1">None</td>
                    <td class="border border-gray-300 px-4 py-1 text-center">1</td>
                  </tr>
                </tbody>
              </table>
              
              <h4>Pupillary Response</h4>
              <ul>
                <li>Size (mm)</li>
                <li>Reactivity (brisk, sluggish, non-reactive)</li>
                <li>Symmetry</li>
              </ul>
              <p>Unilateral dilated pupil may indicate increased intracranial pressure causing compression of the oculomotor nerve.</p>
              
              <h4>Signs of Base of Skull Fracture</h4>
              <ul>
                <li>"Raccoon eyes" (periorbital ecchymosis)</li>
                <li>Battle's sign (mastoid ecchymosis)</li>
                <li>CSF otorrhea or rhinorrhea</li>
                <li>Hemotympanum</li>
              </ul>
              
              <h3>TBI Severity Classification</h3>
              <ul>
                <li><strong>Mild TBI:</strong> GCS 13-15</li>
                <li><strong>Moderate TBI:</strong> GCS 9-12</li>
                <li><strong>Severe TBI:</strong> GCS ≤8</li>
              </ul>
            `,
            management: `
              <h3>Pre-hospital Management</h3>
              
              <h4>Airway Management</h4>
              <ul>
                <li>Maintain cervical spine immobilization</li>
                <li>Clear airway of secretions/blood</li>
                <li>Consider airway adjuncts in unconscious patients</li>
                <li>For GCS ≤8 or deteriorating:
                  <ul>
                    <li>Consider advanced airway management if trained and equipped</li>
                    <li>Avoid hypoxia (SpO₂ <90%) at all costs</li>
                  </ul>
                </li>
              </ul>
              
              <h4>Breathing & Oxygenation</h4>
              <ul>
                <li>Give supplemental oxygen to maintain SpO₂ >94%</li>
                <li>Aim for normal ventilation (ETCO₂ 35-45 mmHg if monitoring available)</li>
                <li>Avoid hyperventilation unless signs of herniation (dilated fixed pupil)</li>
                <li>Address any tension pneumothorax immediately</li>
              </ul>
              
              <h4>Circulation</h4>
              <ul>
                <li>Establish IV/IO access</li>
                <li>Maintain systolic BP >100 mmHg (>110 mmHg in older adults)</li>
                <li>Use judicious fluid therapy - isotonic crystalloid</li>
                <li>Address any external hemorrhage</li>
              </ul>
              
              <h4>Disability</h4>
              <ul>
                <li>Repeated neurological assessments (GCS, pupils, limb movements)</li>
                <li>Document trends - deterioration requires immediate action</li>
                <li>Check blood glucose - treat if <4 mmol/L</li>
                <li>Position: 30° head elevation if no other injuries contraindicate</li>
              </ul>
              
              <h3>Management of Increased ICP</h3>
              <p>Signs include:</p>
              <ul>
                <li>Decreasing GCS</li>
                <li>Pupillary abnormalities</li>
                <li>Cushing's triad (hypertension, bradycardia, irregular respiration)</li>
              </ul>
              <p>Management:</p>
              <ol>
                <li>Ensure adequate oxygenation and ventilation</li>
                <li>30° head elevation (if no spinal injury concern)</li>
                <li>Minimize stimulation</li>
                <li>Consider short-term hyperventilation (ETCO₂ 30-35 mmHg) only as temporary measure for herniation</li>
                <li>Pre-alert neurosurgical center</li>
              </ol>
              
              <h3>Transport Considerations</h3>
              <ol>
                <li>Direct transport to trauma center with neurosurgical capability for:
                  <ul>
                    <li>GCS <15</li>
                    <li>Focal neurological deficit</li>
                    <li>Suspected open or depressed skull fracture</li>
                    <li>Signs of base of skull fracture</li>
                    <li>Post-traumatic seizure</li>
                    <li>Multi-system trauma</li>
                  </ul>
                </li>
                <li>Consider helicopter transport for distant facilities</li>
                <li>Pre-alert receiving facility</li>
                <li>Minimize on-scene time</li>
              </ol>
            `,
            medications: `
              <h3>Medications for TBI Management</h3>
              <table class="border-collapse border border-gray-300 w-full mt-2">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">Medication</th>
                    <th class="border border-gray-300 px-4 py-2">Indication</th>
                    <th class="border border-gray-300 px-4 py-2">Dosage</th>
                    <th class="border border-gray-300 px-4 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Fentanyl</td>
                    <td class="border border-gray-300 px-4 py-2">Pain control</td>
                    <td class="border border-gray-300 px-4 py-2">25-50 mcg IV/IO titrated</td>
                    <td class="border border-gray-300 px-4 py-2">Minimal effect on respiratory drive and hemodynamics; short acting</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Ketamine</td>
                    <td class="border border-gray-300 px-4 py-2">Sedation, analgesia for RSI</td>
                    <td class="border border-gray-300 px-4 py-2">1-2 mg/kg IV/IO</td>
                    <td class="border border-gray-300 px-4 py-2">Use with caution in TBI; historically avoided but recent evidence suggests safety with proper ventilation</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Etomidate</td>
                    <td class="border border-gray-300 px-4 py-2">Sedation for RSI</td>
                    <td class="border border-gray-300 px-4 py-2">0.3 mg/kg IV/IO</td>
                    <td class="border border-gray-300 px-4 py-2">Minimal hemodynamic effects; beneficial in TBI</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Rocuronium</td>
                    <td class="border border-gray-300 px-4 py-2">Paralysis for RSI</td>
                    <td class="border border-gray-300 px-4 py-2">1-1.2 mg/kg IV/IO</td>
                    <td class="border border-gray-300 px-4 py-2">Non-depolarizing agent; longer duration than succinylcholine</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Succinylcholine</td>
                    <td class="border border-gray-300 px-4 py-2">Paralysis for RSI</td>
                    <td class="border border-gray-300 px-4 py-2">1-1.5 mg/kg IV/IO</td>
                    <td class="border border-gray-300 px-4 py-2">Rapid onset, short duration</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Hypertonic Saline (3%)</td>
                    <td class="border border-gray-300 px-4 py-2">Increased ICP</td>
                    <td class="border border-gray-300 px-4 py-2">250-500ml IV</td>
                    <td class="border border-gray-300 px-4 py-2">Use according to local protocols; reduces cerebral edema</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Mannitol</td>
                    <td class="border border-gray-300 px-4 py-2">Increased ICP with herniation</td>
                    <td class="border border-gray-300 px-4 py-2">0.25-1 g/kg IV</td>
                    <td class="border border-gray-300 px-4 py-2">Rarely used pre-hospital; requires physician consultation</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Midazolam</td>
                    <td class="border border-gray-300 px-4 py-2">Seizure control</td>
                    <td class="border border-gray-300 px-4 py-2">2-5mg IV/IO</td>
                    <td class="border border-gray-300 px-4 py-2">May cause respiratory depression and hypotension</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">Levetiracetam</td>
                    <td class="border border-gray-300 px-4 py-2">Seizure prophylaxis</td>
                    <td class="border border-gray-300 px-4 py-2">1000mg IV over 15 min</td>
                    <td class="border border-gray-300 px-4 py-2">Hospital administration; rarely pre-hospital</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Rapid Sequence Induction (RSI) Considerations</h3>
              <p>RSI should only be performed by appropriately trained providers with proper equipment and monitoring.</p>
              <p>Key considerations in TBI:</p>
              <ul>
                <li>Preoxygenate thoroughly - avoid desaturation at all costs</li>
                <li>Use sedatives that maintain hemodynamic stability</li>
                <li>Apply manual in-line stabilization if cervical spine injury suspected</li>
                <li>Use capnography to confirm tube placement and monitor ventilation</li>
                <li>Avoid hyperventilation unless signs of herniation present</li>
                <li>Continue sedation after intubation</li>
              </ul>
              
              <h3>Fluid Therapy</h3>
              <ul>
                <li>Isotonic crystalloids (0.9% sodium chloride or balanced solution)</li>
                <li>Goal: Maintain systolic BP >100 mmHg</li>
                <li>Avoid excessive fluid administration</li>
                <li>Consider vasopressors for hypotension refractory to fluid resuscitation</li>
              </ul>
            `
          }
        };

      // Add more guidelines content following the pattern above...
        
      default:
        return {
          ...baseData,
          title: guideline?.title || "Clinical Guideline",
          description: `${category?.name || ""} Guidelines`,
          content: {
            overview: `
              <h3>${guideline?.title || "Clinical Guideline"}</h3>
              <p>This guideline provides evidence-based recommendations for the assessment and management of ${guideline?.title || "this condition"} in the pre-hospital and emergency setting.</p>
              <p>Always follow your local trust protocols alongside these national guidelines.</p>
            `,
            assessment: `
              <h3>Assessment</h3>
              <p>A thorough assessment should include:</p>
              <ul>
                <li>Detailed history of presenting complaint</li>
                <li>Relevant past medical history</li>
                <li>Current medications</li>
                <li>Allergies</li>
                <li>Comprehensive physical examination</li>
                <li>Vital signs monitoring</li>
              </ul>
              
              <h3>Red Flags</h3>
              <p>Be alert for the following warning signs that may indicate severe illness or complications:</p>
              <ul>
                <li>Abnormal vital signs</li>
                <li>Altered mental status</li>
                <li>Failure to respond to initial treatment</li>
                <li>High-risk features based on age or comorbidities</li>
              </ul>
            `,
            management: `
              <h3>Management Principles</h3>
              <ol>
                <li>Ensure safety of patient and practitioners</li>
                <li>Address life-threatening issues first (ABCDE approach)</li>
                <li>Provide symptomatic relief</li>
                <li>Consider appropriate treatment options based on assessment findings</li>
                <li>Determine appropriate disposition (treat and discharge, transport to hospital)</li>
                <li>Provide clear handover to receiving clinicians</li>
              </ol>
              
              <h3>Treatment Options</h3>
              <p>Treatment should be tailored to the individual patient based on:</p>
              <ul>
                <li>Severity of presentation</li>
                <li>Underlying cause(s)</li>
                <li>Comorbidities</li>
                <li>Current medication</li>
                <li>Response to initial interventions</li>
              </ul>
              
              <h3>Transport Considerations</h3>
              <p>Consider the following when determining transport destination:</p>
              <ul>
                <li>Severity of illness/injury</li>
                <li>Specialized care needs</li>
                <li>Distance to appropriate facilities</li>
                <li>Local protocols and pathways</li>
              </ul>
            `,
            medications: `
              <h3>Medication Considerations</h3>
              <p>When administering any medication, always:</p>
              <ul>
                <li>Check for contraindications and allergies</li>
                <li>Use appropriate dose based on patient weight, age, and renal/hepatic function</li>
                <li>Monitor for adverse effects</li>
                <li>Reassess after administration to determine efficacy</li>
                <li>Document all medications given including time, dose, route, and effect</li>
              </ul>
              
              <h3>Common Medications</h3>
              <p>Medication choices will depend on the specific condition being treated.</p>
              <p>Always refer to the latest formulary or guidance for dosing information.</p>
              
              <h3>Documentation</h3>
              <p>Ensure comprehensive documentation of:</p>
              <ul>
                <li>Assessment findings</li>
                <li>Interventions performed</li>
                <li>Medications administered</li>
                <li>Response to treatment</li>
                <li>Advice given to patient/family</li>
              </ul>
            `
          },
          references: [
            "JRCALC Guidelines 2023",
            "UK Ambulance Services Clinical Practice Guidelines",
            "National Institute for Health and Care Excellence (NICE)",
            "Resuscitation Council UK Guidelines"
          ],
          lastUpdated: "May 2023"
        };
    }
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
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: guidelineData.content.overview }}
              ></div>
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
            <p>Last updated: {guidelineData.lastUpdated}</p>
            <p className="mt-1 text-xs">This guideline is for reference only. Always follow your local protocols and policies.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GuidelineDetail;
