
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, Search, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Expanded data for guidelines
const guidelineCategories = [
  { 
    id: 'cardiac',
    name: 'Cardiac Emergencies',
    guidelines: [
      { 
        id: 'acs', 
        title: 'Acute Coronary Syndromes',
        content: `
          # Acute Coronary Syndromes (ACS)
          
          ## Assessment
          - Character of pain: central chest pain/discomfort, often described as heaviness, pressure, or squeezing
          - Radiation to jaw, neck, arms (particularly left)
          - Associated symptoms: nausea, vomiting, sweating, dyspnea, anxiety
          - Risk factors: age, smoking, diabetes, hypertension, high cholesterol, family history
          
          ## Management
          1. Position of comfort, typically semi-recumbent
          2. Oxygen if SpO2 < 94%
          3. IV access
          4. 12-lead ECG within 10 minutes of first medical contact
          5. Aspirin 300mg (chewed or dispersed)
          6. GTN spray (400mcg) if systolic BP > 90mmHg
          7. Pain relief: consider morphine 2-5mg IV titrated
          8. Consider antiemetic (e.g., ondansetron 4mg)
          
          ## STEMI Care Pathway
          - Immediate notification to cardiac catheter laboratory if STEMI identified
          - Target door-to-balloon time < 90 minutes
          - Pre-alert receiving facility
          
          ## NSTEMI/Unstable Angina Care Pathway
          - Risk stratification (GRACE or TIMI score)
          - Antiplatelet therapy
          - Anticoagulation
          - Consider early invasive strategy for high-risk features
          
          ## Special Considerations
          - Posterior MI: look for ST depression in V1-V3
          - Right ventricular involvement: check right-sided ECG leads
          - Caution with GTN in inferior MI with possible RV involvement
          - Modified approach for LBBB or paced rhythm
          
          ## Documentation Requirements
          - Time of symptom onset
          - Time of aspirin administration
          - Serial ECGs if symptoms change
          - Response to treatments
          
          **Always follow local protocols and guidelines. This is a general framework only.**
        `
      },
      { 
        id: 'ca', 
        title: 'Cardiac Arrest',
        content: `
          # Cardiac Arrest
          
          ## Initial Actions
          - Confirm cardiac arrest (unresponsive and not breathing normally)
          - Call for help and commence CPR immediately
          - Attach defibrillator/monitor as soon as available
          
          ## Adult Advanced Life Support Algorithm
          
          ### Shockable Rhythm (VF/pVT)
          1. Immediate defibrillation (150-200J biphasic)
          2. Resume CPR for 2 minutes
          3. During CPR:
             - IV/IO access
             - Adrenaline 1mg IV/IO (repeat every 3-5 minutes)
             - Consider advanced airway management
             - Continuous chest compressions when advanced airway in place
          4. After 2 minutes, reassess rhythm
          5. If shockable, deliver shock and resume CPR
          6. Consider amiodarone 300mg IV/IO after 3rd shock
          
          ### Non-Shockable Rhythm (Asystole/PEA)
          1. Resume CPR for 2 minutes
          2. During CPR:
             - IV/IO access
             - Adrenaline 1mg IV/IO as soon as possible, then every 3-5 minutes
             - Consider advanced airway management
             - Continuous chest compressions when advanced airway in place
          3. After 2 minutes, reassess rhythm
          
          ## Reversible Causes (4Hs and 4Ts)
          - Hypoxia → Ensure adequate ventilation
          - Hypovolemia → IV fluid bolus
          - Hypothermia → Active warming
          - Hyper/hypokalemia → Treat electrolyte abnormalities
          - Tension pneumothorax → Needle decompression
          - Tamponade → Pericardiocentesis
          - Toxins → Antidotes if available
          - Thrombosis → Consider thrombolysis
          
          ## Post-Resuscitation Care
          - Optimize ventilation (target EtCO2 35-45 mmHg)
          - Maintain SpO2 94-98%
          - Target systolic BP > 100 mmHg
          - 12-lead ECG
          - Consider temperature control
          - Transport to appropriate facility
          
          ## Special Circumstances
          - Drowning: Focus on oxygenation and ventilation
          - Pregnancy: Left lateral tilt, early perimortem cesarean section
          - Hypothermia: "No one is dead until they're warm and dead"
          - Drug overdose: Consider specific antidotes
          
          **Follow current Resuscitation Council guidelines**
        `
      },
      { 
        id: 'crd', 
        title: 'Cardiac Rhythm Disturbances',
        content: `
          # Cardiac Rhythm Disturbances
          
          ## Assessment
          - 12-lead ECG
          - Rate and rhythm regularity
          - QRS width (narrow < 120ms, wide > 120ms)
          - Patient stability (BP, conscious level, chest pain, heart failure)
          
          ## Tachyarrhythmias Management
          
          ### Unstable Tachycardia (any rhythm with adverse signs)
          - Synchronized cardioversion (initial energies):
            - Narrow regular: 70-120J
            - Narrow irregular: 120-150J
            - Wide regular: 150J
            - Wide irregular: 150J
          - Consider sedation if conscious
          
          ### Stable Narrow Complex Tachycardia
          1. Vagal maneuvers
          2. Adenosine 6mg rapid IV bolus
          3. If unsuccessful, adenosine 12mg after 1-2 minutes
          4. If still unsuccessful, consider:
             - Beta-blockers
             - Calcium channel blockers
             - Amiodarone
             
          ### Stable Wide Complex Tachycardia
          - Presumed VT:
            - Amiodarone 300mg IV over 10-60 minutes
            - Consider cardiology consultation
          
          ## Bradyarrhythmias Management
          
          ### Unstable Bradycardia
          - Atropine 500mcg IV (may repeat to max 3mg)
          - If no response:
            - Transcutaneous pacing if available
            - Adrenaline infusion (2-10 mcg/min)
          
          ### Specific Arrhythmias
          
          #### Atrial Fibrillation
          - Rate control: beta-blockers, calcium channel blockers
          - If onset < 48hrs, consider chemical/electrical cardioversion
          
          #### Atrial Flutter
          - Rate control as per AF
          - Consider cardioversion at lower energies (50-100J)
          
          #### Ventricular Fibrillation
          - Immediate defibrillation
          - Follow cardiac arrest protocol
          
          ## Transport Considerations
          - Monitor continuously during transport
          - Pre-alert receiving facility for unstable rhythms
          - Consider HEMS activation for remote locations
          
          **Always follow local protocols and consider expert advice for complex cases.**
        `
      },
      { 
        id: 'hf', 
        title: 'Heart Failure',
        content: `
          # Heart Failure
          
          ## Assessment
          - History: previous cardiac disease, orthopnea, PND, exercise tolerance
          - Examination: raised JVP, peripheral edema, lung crepitations, S3 gallop
          - Vital signs: tachycardia, tachypnea, hypoxia
          - Classifications:
            - Left vs Right heart failure
            - Acute vs Chronic
            - NYHA Functional Classification (I-IV)
          
          ## Acute Heart Failure Management
          
          ### Initial Management
          1. Position: seated upright if tolerated
          2. Oxygen therapy to maintain SpO2 94-98%
          3. IV access
          4. ECG and vital signs monitoring
          
          ### Pharmacological Treatment
          1. Nitrates:
             - GTN spray 400mcg sublingually (if SBP > 90mmHg)
             - Can be repeated every 5 minutes if needed
          
          2. Diuretics:
             - Furosemide 40-80mg IV (higher doses if already on diuretic therapy)
          
          3. Morphine (with caution):
             - 2.5-5mg IV for anxiety and dyspnea
             - Consider antiemetic
          
          ### Severe Cases
          - Consider CPAP if available and trained in its use
          - Monitor for respiratory fatigue
          - Consider inotropic support if available and trained
          
          ## Cardiogenic Shock
          - Signs: hypotension, end-organ hypoperfusion, altered mental status
          - Management:
            - Fluid resuscitation if hypovolemic
            - Inotropic support if available
            - Consider mechanical circulatory support at receiving facility
          
          ## Special Considerations
          - Right heart failure: caution with excess diuresis
          - Diastolic heart failure: avoid excessive vasodilation
          - Valve disease: specific management based on valve affected
          
          ## Transport Considerations
          - Cardiac monitoring during transport
          - Position of comfort
          - Pre-alert receiving facility
          - Consider need for critical care team
          
          **Note: Treatment approach may vary depending on local protocols and guidelines.**
        `
      }
    ] 
  },
  { 
    id: 'respiratory',
    name: 'Respiratory Conditions',
    guidelines: [
      { 
        id: 'asthma', 
        title: 'Asthma',
        content: `
          # Asthma
          
          ## Assessment
          - History: previous attacks, triggers, current treatment
          - Examination: respiratory rate, accessory muscle use, wheeze, ability to speak
          - Signs of severe asthma:
            - RR > 25/min
            - HR > 110/min
            - Inability to complete sentences
            - SpO2 < 92%
            - PEFR < 50% predicted/best
          - Signs of life-threatening asthma:
            - Silent chest
            - Cyanosis
            - Poor respiratory effort
            - Altered consciousness
            - SpO2 < 90%
            - PEFR < 33% predicted/best
          
          ## Management
          
          ### Initial Treatment (All Patients)
          1. Position of comfort (typically sitting upright)
          2. Oxygen to maintain SpO2 94-98%
          3. Salbutamol 5mg via nebulizer (drive with oxygen if available)
          4. Consider ipratropium bromide 500mcg via nebulizer
          
          ### Severe Asthma
          1. Continuous nebulized bronchodilators
          2. Prednisolone 40-50mg oral (or IV hydrocortisone 100mg if unable to take oral)
          3. Consider IV magnesium sulfate 2g over 20 minutes
          
          ### Life-threatening Asthma
          1. Above treatments plus:
          2. IV hydrocortisone 100mg
          3. IV magnesium sulfate 2g over 20 minutes
          4. Consider adrenaline 0.5mL of 1:1000 IM if no response to initial treatment
          5. Consider IPPV/BVM ventilation if respiratory failure develops
          
          ## Ongoing Management
          - Reassess after each treatment
          - Continue bronchodilators as needed
          - Monitor vital signs and oxygen saturation
          - Be alert for pneumothorax as a complication
          
          ## Treatment Failure / Critical Asthma
          - Signs: deterioration despite treatment, exhaustion, decreased consciousness
          - Management: 
            - Consider assisted ventilation
            - Early warning to receiving hospital
            - Consider critical care support
          
          ## Special Considerations
          - Pediatrics: age-appropriate doses, consider breath-holding issues
          - Pregnancy: treat as normal, don't withhold treatment
          - COPD with asthmatic component: caution with oxygen therapy
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'copd', 
        title: 'COPD',
        content: `
          # Chronic Obstructive Pulmonary Disease (COPD)
          
          ## Assessment
          - History: smoking, previous exacerbations, baseline exercise tolerance
          - Current medication and oxygen use at home
          - Examination: respiratory rate, accessory muscle use, pursed lip breathing
          - Auscultation: wheeze, reduced air entry, prolonged expiration
          - Signs of severe exacerbation:
            - Marked dyspnea
            - Tachypnea > 25/min
            - Tachycardia > 110/min
            - Use of accessory muscles
            - Inability to complete sentences
          
          ## Management of Acute Exacerbation
          
          ### Oxygen Therapy
          - Target SpO2 88-92% using controlled oxygen
          - Start with 24-28% (Venturi) or 2L/min nasal cannula
          - Titrate to target saturation
          - Monitor closely for CO2 retention
          
          ### Bronchodilators
          1. Salbutamol 5mg via nebulizer
          2. Ipratropium bromide 500mcg via nebulizer
          3. Consider continuous nebulization for severe cases
          
          ### Additional Treatments
          1. Prednisolone 30-40mg oral (or IV hydrocortisone 100mg if unable to take oral)
          2. Consider antibiotics if purulent sputum (amoxicillin or doxycycline)
          3. IV/oral fluids if signs of dehydration
          
          ### Severe Cases
          - Consider CPAP if available and trained in its use
          - Early warning to receiving hospital
          - Consider need for NIV at hospital
          
          ## Signs of Treatment Failure
          - Deteriorating level of consciousness
          - Exhaustion
          - Worsening acidosis
          - Rising CO2 levels (if monitoring available)
          - Worsening hypoxemia despite oxygen therapy
          
          ## Special Considerations
          - Pneumothorax: consider in sudden deterioration
          - Heart failure: may coexist with COPD
          - Pulmonary embolism: consider in hypoxic patients with minimal wheeze
          
          ## Transport Considerations
          - Position of comfort (usually sitting upright)
          - Continue controlled oxygen
          - Monitor for deterioration during transport
          - Pre-alert receiving facility for severe cases
          
          **Always follow local protocols and guidelines. This is a general framework only.**
        `
      },
      { 
        id: 'pe', 
        title: 'Pulmonary Embolism',
        content: `
          # Pulmonary Embolism
          
          ## Risk Factors
          - Recent surgery or trauma
          - Immobility/bed rest > 3 days
          - Active cancer
          - Previous VTE
          - Estrogen therapy/oral contraceptives
          - Pregnancy and postpartum
          - Known thrombophilia
          - Age > 65 years
          
          ## Assessment
          - History: sudden onset dyspnea, pleuritic chest pain
          - Examination: tachypnea, tachycardia, hypoxemia
          - Signs of massive PE:
            - Hypotension (SBP < 90 mmHg)
            - Signs of shock
            - Syncope
          - ECG findings (non-specific):
            - Sinus tachycardia
            - Right heart strain (S1Q3T3 pattern)
            - Right bundle branch block
            - T-wave inversion in V1-V4
          
          ## Clinical Probability Scoring
          
          ### Wells Score for PE
          - Clinical signs of DVT: +3
          - PE most likely diagnosis: +3
          - Heart rate > 100: +1.5
          - Immobilization or surgery in previous 4 weeks: +1.5
          - Previous DVT/PE: +1.5
          - Hemoptysis: +1
          - Malignancy: +1
          
          Score interpretation:
          - < 2: Low probability
          - 2-6: Moderate probability
          - > 6: High probability
          
          ## Management
          
          ### Initial Management (All Patients)
          1. Oxygen to maintain SpO2 94-98%
          2. IV access
          3. Consider fluid bolus for hypotension
          4. Cardiac monitoring
          5. Pain relief as needed
          
          ### Suspected Massive PE with Shock
          1. Fluid resuscitation
          2. Consider vasopressors if persistently hypotensive
          3. Early activation of critical care team
          4. Early hospital notification (thrombolysis may be indicated)
          
          ## Transport Considerations
          - Position of comfort
          - Careful fluid management
          - Monitor for deterioration
          - Pre-alert receiving facility for high-risk patients
          
          **Definitive diagnosis and treatment (anticoagulation/thrombolysis) will occur in hospital setting.**
        `
      },
      { 
        id: 'pneumonia', 
        title: 'Pneumonia',
        content: `
          # Pneumonia
          
          ## Assessment
          - History: cough, sputum production, fever, dyspnea, chest pain
          - Risk factors: age > 65, comorbidities, immunosuppression
          - Examination: respiratory rate, oxygen saturation, temperature
          - Auscultation: crackles, bronchial breathing, reduced air entry
          
          ## Severity Assessment: NEWS2 Score
          - Physiological parameters scored:
            - Respiratory rate
            - Oxygen saturation
            - Systolic blood pressure
            - Heart rate
            - Level of consciousness
            - Temperature
          - Higher scores indicate greater severity
          
          ## CURB-65 Score (for reference)
          - Confusion (new onset)
          - Urea > 7 mmol/L
          - Respiratory rate ≥ 30/min
          - Blood pressure: systolic < 90 mmHg or diastolic ≤ 60 mmHg
          - Age ≥ 65 years
          
          Score interpretation:
          - 0-1: Low risk, consider home treatment
          - 2: Moderate risk, consider hospital assessment
          - 3-5: High risk, requires hospitalization
          
          ## Management
          
          ### Initial Treatment
          1. Oxygen to maintain SpO2 94-98% (88-92% in known COPD)
          2. IV access for moderate to severe cases
          3. Monitor vital signs
          
          ### Moderate to Severe Cases
          1. Consider IV fluids if signs of dehydration
          2. Position to optimize ventilation
          3. Consider antibiotics prior to transport if:
             - Severe pneumonia
             - Long transport time
             - Local protocols permit
          
          ## Special Considerations
          - Sepsis: apply sepsis screening and management
          - COPD: caution with oxygen therapy
          - Elderly: may present atypically with confusion rather than respiratory symptoms
          - Immunocompromised: higher risk of severe infection and atypical organisms
          
          ## Transport Considerations
          - Monitor for deterioration during transport
          - Position semi-recumbent if tolerated
          - Consider pre-alerting receiving facility for severe cases
          
          **Hospital management will include radiology, microbiology, and appropriate antibiotic therapy.**
        `
      }
    ] 
  },
  { 
    id: 'medical',
    name: 'Medical Emergencies',
    guidelines: [
      { 
        id: 'sepsis', 
        title: 'Sepsis',
        content: `
          # Sepsis
          
          ## Definition
          - "Life-threatening organ dysfunction caused by a dysregulated host response to infection"
          - Septic shock: Sepsis with persistent hypotension requiring vasopressors and lactate > 2 mmol/L despite adequate fluid resuscitation
          
          ## Assessment for Sepsis
          
          ### Screening: NEWS2 Score ≥ 5 or qSOFA ≥ 2
          
          #### qSOFA Criteria (quick Sequential Organ Failure Assessment)
          - Respiratory rate ≥ 22/min
          - Systolic BP ≤ 100 mmHg
          - Altered mental status (GCS < 15)
          
          ### Look for source of infection:
          - Respiratory: cough, dyspnea, sputum
          - Urinary: dysuria, frequency, suprapubic pain
          - Abdominal: pain, distension, peritonism
          - Skin/soft tissue: cellulitis, wounds
          - Central nervous system: neck stiffness, photophobia
          - Indwelling devices: lines, catheters
          
          ## Red Flag Sepsis Signs
          - Systolic BP < 90 mmHg or MAP < 65 mmHg
          - Lactate ≥ 2 mmol/L (if available)
          - Heart rate > 130 bpm
          - Respiratory rate > 25/min
          - Oxygen saturation < 91% on air
          - Urine output < 0.5 mL/kg/hr (if catheterized)
          - Non-blanching rash or mottled/ashen/cyanotic skin
          - Recent chemotherapy
          
          ## Management: Sepsis Six
          
          1. **Oxygen**: Titrate to SpO2 94-98% (88-92% if risk of CO2 retention)
          2. **Blood cultures**: To be taken in hospital (not prehospital)
          3. **Antibiotics**: Consider prehospital antibiotics if:
             - High suspicion of sepsis
             - Long transport time to hospital
             - Local protocols permit
          4. **Fluids**: IV crystalloid bolus 500mL-1L if hypotensive or signs of poor perfusion
          5. **Lactate**: Will be measured in hospital
          6. **Urine output**: Monitor if catheter in situ
          
          ## Special Considerations
          
          ### Neutropenic Sepsis
          - Definition: neutrophils < 0.5 x 10^9/L and temp ≥ 38°C
          - Higher risk: recent chemotherapy, known malignancy
          - Management: as per sepsis plus urgent transport
          
          ### Maternal Sepsis
          - May progress rapidly
          - Consider early antimicrobials
          - Position left lateral tilt if > 20 weeks gestation
          
          ## Transport Considerations
          - Pre-alert receiving facility
          - Continue fluid resuscitation as needed
          - Monitor vital signs frequently
          - Consider critical care support for severe cases
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'stroke', 
        title: 'Stroke/TIA',
        content: `
          # Stroke/TIA
          
          ## Assessment
          
          ### FAST Assessment
          - Facial weakness: Can the person smile? Is their face drooped on one side?
          - Arm weakness: Can the person raise both arms and keep them there?
          - Speech problems: Can the person speak clearly? Can they understand what you say?
          - Time to call emergency services
          
          ### Additional Assessment
          - Time of onset (or last known well) - CRUCIAL
          - Blood glucose (rule out hypoglycemia)
          - GCS and AVPU
          - Medical history: previous stroke, anticoagulation, recent surgery
          
          ## Classification
          - Ischemic stroke (~85%)
          - Hemorrhagic stroke (~15%)
          - TIA: symptoms resolve within 24 hours (typically < 1 hour)
          
          ## Pre-hospital Management
          1. ABC assessment
          2. Oxygen if SpO2 < 94%
          3. Position: supine with 30° head elevation if stroke suspected, flat if TIA suspected
          4. IV access
          5. Blood glucose check
          6. Monitor vital signs
          7. Protect paralyzed limbs
          
          ## Treatment Pathways
          
          ### Ischemic Stroke Pathway
          - Thrombolysis eligibility (typically within 4.5 hours of onset)
          - Thrombectomy eligibility (within 24 hours for selected patients)
          - Consider direct transport to thrombectomy center if:
            - FAST-positive
            - Time of onset known and within window
            - No significant comorbidities
          
          ### Hemorrhagic Stroke Pathway
          - Medical management
          - Possible neurosurgical intervention
          
          ## Red Flags
          - Seizures
          - Decreased level of consciousness
          - Vomiting
          - Severe headache
          - Hypertensive crisis
          - Neck stiffness
          
          ## Communications to Hospital
          - Time of onset/last known well
          - FAST findings
          - Current vital signs
          - Blood glucose
          - Anticoagulant use
          - Pre-morbid status/functional level
          
          ## Special Considerations
          - Posterior circulation strokes: may present with vertigo, diplopia, ataxia
          - "Stroke mimics": hypoglycemia, seizure, migraine, sepsis
          - Consider 12-lead ECG to identify comorbid cardiac issues
          
          **Always follow local protocols and pathways.**
        `
      },
      { 
        id: 'diabetes', 
        title: 'Diabetic Emergencies',
        content: `
          # Diabetic Emergencies
          
          ## Hypoglycemia
          
          ### Assessment
          - Definition: Blood glucose < 4.0 mmol/L (< 72 mg/dL)
          - Common symptoms:
            - Sweating, tremor, hunger
            - Confusion, altered behavior
            - Seizures, reduced consciousness
          - Risk factors: insulin/sulfonylurea use, missed meals, alcohol, exercise
          
          ### Management
          1. **Conscious patient able to swallow safely:**
             - Oral glucose 15-20g (glucose tablets, gel, or sugary drink)
             - Reassess after 10 minutes
             - Second dose if still symptomatic or BG < 4.0 mmol/L
             - Follow with longer-acting carbohydrate (sandwich, fruit)
          
          2. **Altered consciousness or unable to swallow safely:**
             - Glucagon 1mg IM (adults and children > 25kg)
             - OR IV glucose 10% 100mL bolus (titrate to response)
             - Reassess after 10 minutes
             - Repeat treatment if necessary
          
          3. **Post-treatment:**
             - Monitor for recurrence
             - Consider causes (missed meal, medication error)
             - Advise on follow-up with regular provider
          
          ## Hyperglycemia/Diabetic Ketoacidosis (DKA)
          
          ### Assessment
          - Definition: Blood glucose > 11.0 mmol/L (> 200 mg/dL) with ketosis
          - Common symptoms:
            - Polyuria, polydipsia
            - Nausea, vomiting, abdominal pain
            - Kussmaul's respiration (deep, labored breathing)
            - Fruity breath odor (acetone)
            - Dehydration signs
            - Altered consciousness
          - Risk factors: infection, missed insulin, new-onset diabetes
          
          ### Management
          1. ABC assessment
          2. IV access (large bore if possible)
          3. Fluid resuscitation: 0.9% sodium chloride 10mL/kg in first hour
          4. Cardiac monitoring
          5. Pre-alert receiving facility
          
          ## Hyperosmolar Hyperglycemic State (HHS)
          
          ### Assessment
          - Very high blood glucose (often > 30 mmol/L or > 540 mg/dL)
          - Extreme dehydration
          - Minimal or no ketosis
          - Often in elderly with type 2 diabetes
          - Gradual onset over days
          - Altered consciousness, focal neurological deficits possible
          
          ### Management
          - As per DKA management with careful fluid resuscitation
          - Monitor for cardiac complications during rehydration
          
          ## Special Considerations
          - Pediatric patients: more susceptible to rapid deterioration
          - Pregnancy: lower thresholds for treatment
          - Elderly: atypical presentation common
          - Altered mental status: consider other causes (stroke, infection)
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'anaphylaxis', 
        title: 'Anaphylaxis',
        content: `
          # Anaphylaxis
          
          ## Recognition
          
          Diagnosis is likely when ALL of the following 3 criteria are met:
          
          1. **Sudden onset and rapid progression of symptoms**
          2. **Life-threatening airway and/or breathing and/or circulation problems**
          3. **Skin and/or mucosal changes (flushing, urticaria, angioedema)**
          
          Note: Skin changes may be absent in 10-20% of reactions
          
          ## Assessment
          
          ### Airway problems:
          - Swelling of lips, tongue, throat
          - Stridor
          - Hoarse voice
          
          ### Breathing problems:
          - Shortness of breath
          - Wheeze
          - Confusion caused by hypoxia
          - Respiratory arrest
          
          ### Circulation problems:
          - Pale, clammy skin
          - Tachycardia
          - Hypotension
          - Dizziness/syncope
          - Cardiac arrest
          
          ### Disability:
          - Altered consciousness due to hypoperfusion
          
          ### Exposure:
          - Widespread urticarial rash
          - Angioedema
          
          ## Management
          
          ### Immediate Actions
          1. **Remove trigger if possible**
          2. **Call for help**
          3. **Adrenaline (epinephrine) 1:1000 (1mg/mL) IM into outer mid-thigh**
             - Adult and child > 12 years: 500mcg (0.5mL)
             - Child 6-12 years: 300mcg (0.3mL)
             - Child < 6 years: 150mcg (0.15mL)
          4. **Position patient appropriately**
             - If dyspneic: sitting position
             - If hypotensive: supine with legs elevated
             - If pregnant: left lateral position
          
          ### Secondary Actions
          1. **High-flow oxygen** (15L/min via non-rebreather mask)
          2. **IV access**
          3. **Fluid bolus** if hypotensive: 500-1000mL crystalloid (adult) - titrate to response
          4. **Monitor vital signs**
          
          ### If No Improvement After 5 minutes
          - Repeat adrenaline IM dose
          - Continue fluid resuscitation if hypotensive
          
          ### Additional Treatments
          - **Antihistamine**: chlorphenamine IV/IM
            - Adult: 10mg
            - Child 6-12 years: 5mg
            - Child 6 months-6 years: 2.5mg
          - **Corticosteroid**: hydrocortisone IV/IM
            - Adult: 200mg
            - Child 6-12 years: 100mg
            - Child 6 months-6 years: 50mg
          - **Bronchodilator**: salbutamol for persistent wheeze
          
          ## Transport Considerations
          - Monitor continuously
          - Pre-alert receiving facility
          - Be prepared for deterioration en route
          - Consider need for additional adrenaline doses
          
          ## Special Considerations
          - **Beta-blockers**: may reduce effectiveness of adrenaline
          - **Pregnant patients**: left lateral position to prevent aortocaval compression
          - **Biphasic reactions**: symptoms can recur 1-72 hours after initial resolution
          
          **All patients with suspected anaphylaxis should be transported to hospital for observation, even if symptoms resolve.**
        `
      }
    ] 
  },
  { 
    id: 'trauma',
    name: 'Trauma',
    guidelines: [
      { 
        id: 'tbi', 
        title: 'Traumatic Brain Injury',
        content: `
          # Traumatic Brain Injury
          
          ## Assessment
          
          ### Primary Survey (CABCDE)
          - Airway: maintain with C-spine control
          - Breathing: ensure adequate ventilation
          - Circulation: control external hemorrhage, assess for shock
          - Disability: 
            - GCS assessment (categorize as mild 13-15, moderate 9-12, severe 3-8)
            - Pupillary response
            - Limb movements
          - Exposure: full examination (prevent hypothermia)
          
          ### Secondary Survey
          - Detailed neurological assessment
          - Signs of base of skull fracture:
            - Raccoon eyes (periorbital ecchymosis)
            - Battle's sign (mastoid ecchymosis)
            - CSF otorrhea or rhinorrhea
            - Hemotympanum
          - Associated injuries
          
          ## Management
          
          ### All TBI Patients
          1. C-spine immobilization
          2. Oxygen to maintain SpO2 > 94%
          3. Position head up 30° unless contraindicated
          4. Prevent secondary injury:
             - Maintain systolic BP > 110mmHg (adults)
             - Avoid hypoxia
             - Maintain normothermia
          
          ### Severe TBI (GCS ≤ 8)
          1. Secure airway (consider advanced airway if trained)
          2. Ventilate to normocapnia (if EtCO2 monitoring available)
          3. IV access and fluid resuscitation to maintain SBP > 110mmHg
          4. Consider prehospital tranexamic acid if severe bleeding and < 3 hours from injury
          5. Seizure management if present
          
          ### Suspected Raised Intracranial Pressure
          - Signs: decreasing GCS, pupillary abnormalities, hypertension with bradycardia
          - Management:
            - Ensure optimal oxygenation and ventilation
            - Maintain cerebral perfusion pressure
            - Consider hyperventilation ONLY for acute neurological deterioration
            - Pre-alert neurosurgical center
          
          ## Transport Considerations
          - Direct transport to Major Trauma Centre with neurosurgical capability for:
            - GCS < 14 after trauma
            - Deteriorating GCS
            - Focal neurological signs
            - Suspected open or depressed skull fracture
            - Post-traumatic seizure
          - Smooth transfer and transport to minimize secondary injury
          - Continuous monitoring of vital signs and neurology
          - Pre-alert receiving facility
          
          ## Special Considerations
          - Elderly patients: higher risk with lower impact
          - Anticoagulated patients: higher risk of intracranial hemorrhage
          - Pediatrics: age-appropriate GCS assessment
          - Alcohol/drugs: may confound assessment
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'spinal', 
        title: 'Spinal Injuries',
        content: `
          # Spinal Injuries
          
          ## Assessment
          
          ### Mechanism of Injury
          - High-energy trauma
          - Falls from height
          - Axial loading
          - High-speed motor vehicle collisions
          - Diving accidents
          
          ### Clinical Assessment
          
          #### Signs and symptoms
          - Pain or tenderness in spine
          - Neurological deficits:
            - Weakness
            - Numbness or tingling
            - Loss of movement
            - Priapism
          - Autonomic dysfunction:
            - Hypotension with bradycardia
            - Poikilothermia (inability to regulate temperature)
            - Urinary retention
          
          #### Spinal shock vs. neurogenic shock
          - Spinal shock: temporary loss of reflexes below injury level
          - Neurogenic shock: hypotension without tachycardia, warm peripheries
          
          ## Manual In-line Stabilization
          
          ### Indications for full spinal immobilization:
          1. Altered level of consciousness
          2. Evidence of intoxication
          3. Painful distracting injury
          4. Neurological deficit or complaint
          5. Spinal pain or tenderness
          
          ### Canadian C-Spine Rules (for alert, stable trauma patients)
          1. Any high-risk factor that mandates immobilization?
             - Age ≥65 years
             - Dangerous mechanism
             - Paresthesias in extremities
          2. Any low-risk factor that allows safe assessment of range of motion?
             - Simple rear-end collision
             - Sitting position in ED
             - Ambulatory at scene
             - Delayed onset of neck pain
             - Absence of midline C-spine tenderness
          3. Able to actively rotate neck 45° left and right?
          
          ## Management
          
          ### Initial Management
          1. Manual in-line stabilization
          2. Airway management with C-spine control
          3. Ensure adequate oxygenation and ventilation
          4. Circulatory support (neurogenic shock requires fluids and vasopressors)
          
          ### Immobilization Techniques
          - Cervical collar plus blocks and straps
          - Scoop stretcher or long board (minimizing time on rigid surfaces)
          - Pelvic splint for suspected thoracolumbar injuries
          
          ### Neurogenic Shock Management
          - IV fluid bolus
          - Vasopressors if available
          - Maintain systolic BP > 90 mmHg
          - Prevent hypothermia
          
          ## Special Considerations
          
          ### Pediatrics
          - Different immobilization techniques due to anatomical differences
          - Higher fulcrum of cervical spine (C2-C3 vs C5-C6 in adults)
          - Consider child-specific immobilization device
          
          ### Elderly
          - Higher risk with minor mechanisms
          - Pre-existing degenerative changes
          - Caution with rigid collars (pressure areas)
          
          ### Penetrating Trauma
          - Immobilization may delay transport and increase mortality
          - Selective immobilization only with neurological signs/symptoms
          
          ## Transport Considerations
          - Direct transport to spinal care center when appropriate
          - Continuous monitoring for deterioration
          - Gentle handling during all transfers
          - Pressure area care during transport
          - Consider pain management without masking neurological signs
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'burns', 
        title: 'Burns',
        content: `
          # Burns Management
          
          ## Assessment
          
          ### Burn Severity Assessment
          - **Depth**:
            - Superficial (1st degree): erythema, pain, no blisters
            - Partial thickness (2nd degree): blisters, moist, painful
            - Full thickness (3rd degree): dry, leathery, painless, charred
          - **Extent**: Use Rule of Nines or Lund-Browder chart
            - Adult Rule of Nines:
              - Head & neck: 9%
              - Each upper limb: 9%
              - Each lower limb: 18%
              - Anterior trunk: 18%
              - Posterior trunk: 18%
              - Genitalia: 1%
          - **Location**: face, hands, feet, genitals, joints, circumferential burns
          
          ### Severity Classification
          - **Minor**: <10% BSA partial thickness in adults
          - **Moderate**: 10-20% BSA partial thickness in adults
          - **Major**:
            - >20% BSA partial thickness in adults
            - >10% BSA full thickness
            - Burns to face, hands, feet, genitals
            - Circumferential burns
            - Inhalation injury
            - Significant comorbidities
          
          ## Management
          
          ### Initial Management
          1. **Stop the burning process**:
             - Remove clothing/jewelry
             - Irrigation with cool water (10-15 mins for thermal burns)
             - Dry, sterile dressing
          2. **Assess ABCDE**:
             - Airway: signs of inhalation injury?
             - Breathing: adequate ventilation?
             - Circulation: IV access for burns >15% BSA
             - Disability: pain assessment
             - Exposure: complete assessment while preventing hypothermia
          
          ### Fluid Resuscitation
          - **For burns >15% BSA in adults (>10% in children/elderly)**:
            - IV crystalloid according to Parkland formula:
              - 4mL × kg bodyweight × % BSA burned
              - Half in first 8 hours, remainder in next 16 hours
          - **Monitor urine output**: target 0.5mL/kg/hr for adults
          
          ### Analgesia
          - Titrated IV opioids for moderate to severe pain
          - Consider anxiolytic for associated anxiety
          
          ### Wound Care
          - Cover with clean, dry sheet or burns dressing
          - Cling film applied lengthways (not circumferentially)
          - Keep patient warm
          
          ## Special Considerations
          
          ### Inhalation Injury Signs
          - Burns in enclosed space
          - Facial burns
          - Singed nasal hair/eyebrows
          - Carbonaceous sputum/sooty mouth
          - Hoarse voice/stridor
          - Respiratory distress
          
          ### Chemical Burns
          - Dry powder: brush off before irrigation
          - Continuous irrigation for at least 30 minutes
          - Consider specific antidotes for certain chemicals
          
          ### Electrical Burns
          - Often more severe than apparent
          - Cardiac monitoring essential
          - Assess for entrance and exit wounds
          - Risk of compartment syndrome
          
          ## Transport Considerations
          - Direct transport to burns center for:
            - >10% BSA partial thickness burns
            - Any full thickness burns
            - Burns to face/hands/feet/genitals/joints
            - Circumferential burns
            - Inhalation injury
            - Electrical/chemical burns
          - Prevent hypothermia during transport
          - Elevate burned extremities
          - Continue fluid resuscitation
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'fractures', 
        title: 'Fractures',
        content: `
          # Fracture Management
          
          ## Assessment
          
          ### History
          - Mechanism of injury
          - Time of injury
          - Pain characteristics
          - Associated symptoms
          - Past medical history
          - Tetanus status
          
          ### Examination
          - Look: deformity, swelling, bruising, open wounds
          - Feel: tenderness, crepitus, abnormal movement
          - Move: assess active and passive range of motion (if appropriate)
          - Neurovascular status:
            - Pulses
            - Capillary refill
            - Sensation
            - Motor function
            - Temperature comparison
          
          ## Management Principles
          
          ### Primary Survey
          - Assess ABCDE
          - Control obvious hemorrhage
          - Consider associated injuries
          
          ### Management of Closed Fractures
          1. Analgesia: IV/IM/IN depending on severity
          2. Immobilization:
             - Principles: immobilize joint above and below fracture site
             - Techniques: splints, slings, vacuum splints, traction splints
          3. Reduction: only if neurovascular compromise and long transport time
          4. Reassess neurovascular status after any manipulation
          
          ### Management of Open Fractures
          1. Control bleeding
          2. Cover wound with sterile dressing
          3. DO NOT push protruding bone back into wound
          4. Immobilize as per closed fractures
          5. Consider antibiotics if prolonged transport time
          
          ## Specific Fracture Management
          
          ### Upper Limb
          - **Clavicle**: broad arm sling
          - **Shoulder/Humerus**: collar and cuff sling
          - **Elbow**: vacuum splint or padded splint at angle of comfort
          - **Forearm**: vacuum splint or padded splint
          - **Wrist/Hand**: elevation, splint in position of function
          
          ### Lower Limb
          - **Pelvis**: pelvic binder for suspected unstable fractures
          - **Hip/Femur**: traction splint if isolated midshaft
          - **Knee**: vacuum splint or padded splint
          - **Tibia/Fibula**: vacuum splint or box splint
          - **Ankle/Foot**: vacuum splint or padded splint
          
          ### Spine
          - See spinal injury guideline
          
          ## Complications
          - **Neurovascular compromise**: prioritize transport
          - **Compartment syndrome**: pain out of proportion, pain on passive stretch
          - **Fat embolism**: respiratory distress, confusion, petechial rash
          - **Rhabdomyolysis**: in crush injuries
          
          ## Special Considerations
          
          ### Pediatric Fractures
          - Growth plate injuries
          - Greenstick and buckle fractures
          - Greater healing potential
          - Consider non-accidental injury
          
          ### Elderly Fractures
          - Higher risk with minimal trauma
          - Osteoporosis
          - Associated medical conditions
          - Higher complication rates
          
          ### Transport Considerations
          - Adequate immobilization
          - Reassess neurovascular status during transport
          - Appropriate positioning
          - Consider need for direct transfer to orthopedic center
          
          **Always follow local protocols and guidelines.**
        `
      }
    ] 
  },
  { 
    id: 'obstetric',
    name: 'Obstetric Emergencies',
    guidelines: [
      { 
        id: 'delivery', 
        title: 'Normal Delivery',
        content: `
          # Normal Delivery
          
          ## Assessment
          
          ### History
          - Estimated due date (EDD)
          - Gravida/Para status (number of pregnancies/births)
          - Antenatal history and complications
          - Length of previous labors
          - Time contractions started and current frequency
          - Whether membranes have ruptured
          - Urge to push or open bowels
          - Bleeding
          
          ### Signs of Imminent Delivery
          - Contractions: 2-3 minutes apart, lasting 60-90 seconds
          - Strong urge to push
          - Bulging perineum
          - Crowning
          
          ## Management
          
          ### Preparation
          1. Position mother on bed/floor with buttocks at edge if possible
          2. Ensure privacy and warmth
          3. Prepare equipment:
             - Delivery pack if available
             - Clean towels/sheets
             - Cord clamps/ties
             - Suction device
             - PPE (gloves, apron, eye protection)
          4. Place absorbent material under buttocks
          5. Position woman: semi-recumbent or side-lying
          
          ### Delivery Procedure
          1. **First Stage (Dilation)**: Support and encourage
          2. **Second Stage (Delivery)**:
             - Apply gentle counterpressure to baby's head to prevent explosive delivery
             - Check for cord around neck (if present and loose, slip over head)
             - Allow head to rotate naturally
             - Support perineum
             - For shoulders: gentle downward pressure for anterior shoulder, then upward for posterior
             - Support baby's body as it delivers
          3. **Third Stage (Placenta)**:
             - Place baby on mother's abdomen/chest (skin-to-skin)
             - Clamp and cut cord after cessation of pulsation
             - Await signs of placental separation (cord lengthening, small gush of blood)
             - Encourage controlled maternal effort for placental delivery
             - Retain placenta for hospital inspection
          
          ### Immediate Newborn Care
          1. Dry and wrap baby (prevent heat loss)
          2. Assess APGAR at 1 and 5 minutes
          3. Clear airway if necessary (only if obvious obstruction)
          4. Assess color and respiratory effort
          5. Skin-to-skin contact with mother if possible
          
          ### Maternal Care
          1. Monitor vital signs
          2. Observe for excessive bleeding
          3. Encourage breastfeeding (aids uterine contraction)
          4. Estimate blood loss
          5. Monitor uterine tone
          
          ## Complications
          - **Cord prolapse**: knee-chest position, manual elevation of presenting part
          - **Shoulder dystocia**: McRoberts maneuver, suprapubic pressure
          - **Breech presentation**: hands-off approach if delivery progressing
          - **Postpartum hemorrhage**: uterine massage, IV access
          
          ## Transport Considerations
          - Transport both mother and baby to hospital even if delivery appears uncomplicated
          - Ensure warmth during transport
          - Monitor mother and baby continuously
          - Be prepared for complications during transport
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'pph', 
        title: 'Post-Partum Hemorrhage',
        content: `
          # Post-Partum Hemorrhage
          
          ## Definition
          - Primary PPH: blood loss >500mL within 24 hours of birth
          - Severe PPH: blood loss >1000mL
          - Life-threatening: continued bleeding or clinical signs of shock
          
          ## Assessment
          
          ### Risk Factors
          - Previous PPH
          - Multiple pregnancy
          - Pre-eclampsia/hypertension
          - Prolonged labor
          - Operative delivery
          - Placental abnormalities
          - Uterine abnormalities
          - Coagulation disorders
          
          ### Signs and Symptoms
          - Visible blood loss
          - Signs of shock: tachycardia, hypotension, decreased LOC
          - Uterine atony (soft, boggy uterus)
          - Retained placental tissue
          - Genital tract trauma
          
          ## Management
          
          ### Initial Management
          1. Call for assistance
          2. ABC assessment
          3. Oxygen via non-rebreathe mask
          4. Two large-bore IV cannulae
          5. Fluid resuscitation: crystalloid bolus 500mL-1L
          6. Take blood samples if equipment available
          
          ### Specific Management
          1. **Uterine massage**:
             - Place one hand in vagina and one on abdomen
             - Massage uterine fundus through abdominal wall
          
          2. **Bimanual compression** (if trained and proficient):
             - One hand in vagina, one on abdomen
             - Apply pressure between both hands
          
          3. **Pharmacological**:
             - Oxytocin 10 IU IM (if available)
             - Tranexamic acid 1g IV over 10 minutes (within 3 hours of birth)
          
          4. **Aortic compression** (if trained):
             - Apply pressure with closed fist just above umbilicus
             - Press downward and slightly to left
          
          ### Ongoing Management
          - Monitor vital signs every 5 minutes
          - Estimate ongoing blood loss
          - Keep patient warm
          - Position flat with legs elevated if hypotensive
          - Prepare for rapid transport
          
          ## Transport Considerations
          - Pre-alert receiving hospital
          - Consider requesting blood products to be available
          - Request specialist obstetric team
          - Continue monitoring and resuscitation during transport
          - Consider HEMS activation for remote locations
          
          ## Special Considerations
          - **Retained placenta**: Do not attempt to remove in pre-hospital setting
          - **Uterine inversion**: Rare but severe - cover with moist sterile towels and urgent transport
          - **Amniotic fluid embolism**: Supportive care, rapid transport
          
          **Always follow local protocols and guidelines.**
        `
      },
      { 
        id: 'preeclampsia', 
        title: 'Pre-eclampsia',
        content: `
          # Pre-eclampsia and Eclampsia
          
          ## Definitions
          - **Pre-eclampsia**: Hypertension developing after 20 weeks gestation with proteinuria and/or evidence of end-organ dysfunction
          - **Severe pre-eclampsia**: Pre-eclampsia with severe hypertension and/or severe organ dysfunction
          - **Eclampsia**: Seizures in context of pre-eclampsia
          - **HELLP syndrome**: Hemolysis, Elevated Liver enzymes, Low Platelets
          
          ## Assessment
          
          ### Signs and Symptoms
          - **Hypertension**: BP ≥140/90 mmHg
          - **Severe hypertension**: BP ≥160/110 mmHg
          - **Other signs**:
            - Headache (severe, persistent)
            - Visual disturbances (flashing lights, blurred vision)
            - Epigastric/right upper quadrant pain
            - Nausea/vomiting
            - Edema (particularly face, hands)
            - Hyperreflexia
            - Reduced urine output
            - Pulmonary edema
          
          ## Management
          
          ### Pre-eclampsia
          1. Position: left lateral tilt (reduces aortocaval compression)
          2. IV access
          3. Vital signs monitoring including BP every 15 minutes
          4. Fluid balance monitoring
          5. Transport to appropriate obstetric facility
          
          ### Severe Pre-eclampsia
          As above plus:
          1. Consider antihypertensive treatment if BP ≥160/110 mmHg
             - Labetalol 10mg IV over 2 minutes (if available and trained)
             - If contraindications to labetalol, consider hydralazine or nifedipine
          2. Pre-alert receiving facility
          3. Prepare for possible seizures
          
          ### Eclampsia
          1. **Airway protection** during seizure
          2. **Position**: left lateral
          3. **Oxygen** via mask
          4. **Seizure management**:
             - Magnesium sulfate 4g IV over 5-15 minutes (if available and trained)
             - If magnesium unavailable, consider benzodiazepines as per local protocol
          5. **Antihypertensive therapy** as above if BP remains ≥160/110 mmHg
          6. **Urgent transport** to obstetric facility
          
          ## Post-Seizure Care
          - Maintain airway
          - Monitor vital signs closely
          - Be prepared for recurrent seizures
          - Monitor for magnesium toxicity if administered:
            - Respiratory depression
            - Loss of patellar reflexes
            - Altered mental status
          
          ## Transport Considerations
          - Left lateral tilt during transport
          - Minimize external stimuli (light, noise)
          - Continuous monitoring
          - Prepare for potential deterioration en route
          - Consider critical care support for intubated patients
          
          ## Special Considerations
          - Pre-eclampsia can develop or worsen postpartum
          - Magnesium sulfate is the drug of choice for preventing and treating eclamptic seizures
          - Target BP: reduce to 140-150/90-100 mmHg (avoid rapid decreases)
          - Consider HELLP syndrome with right upper quadrant pain, abnormal bleeding, jaundice
          
          **Always follow local protocols and guidelines.**
        `
      }
    ] 
  }
];

const Guidelines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuidelineId, setSelectedGuidelineId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedGuideline, setSelectedGuideline] = useState<any | null>(null);
  const navigate = useNavigate();
  
  // Find the selected guideline when IDs change
  useEffect(() => {
    if (selectedCategoryId && selectedGuidelineId) {
      const category = guidelineCategories.find(cat => cat.id === selectedCategoryId);
      if (category) {
        const guideline = category.guidelines.find(guide => guide.id === selectedGuidelineId);
        if (guideline) {
          setSelectedGuideline(guideline);
          return;
        }
      }
      setSelectedGuideline(null);
    } else {
      setSelectedGuideline(null);
    }
  }, [selectedCategoryId, selectedGuidelineId]);
  
  // Filter guidelines based on search term
  const filteredCategories = guidelineCategories.map(category => ({
    ...category,
    guidelines: category.guidelines.filter(guideline => 
      guideline.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.guidelines.length > 0);

  const handleBack = () => {
    if (selectedGuideline) {
      setSelectedGuidelineId(null);
      setSelectedCategoryId(null);
      setSelectedGuideline(null);
    } else {
      navigate(-1);
    }
  };
  
  const handleGuidelineClick = (categoryId: string, guidelineId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedGuidelineId(guidelineId);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          <BookOpen size={32} className="text-nhs-blue mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">Clinical Guidelines</h1>
            <p className="text-gray-600 dark:text-gray-400">JRCALC and local trust guidelines</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-1" size={16} />
          {selectedGuideline ? 'Back to Guidelines' : 'Back'}
        </Button>
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
        {selectedGuideline ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{selectedGuideline.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {selectedGuideline.content.split('\n').map((line: string, index: number) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-nhs-blue">{line.substring(3)}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-bold mt-3 mb-2">{line.substring(4)}</h3>;
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
                    return <div key={index} className="h-2"></div>;
                  } else {
                    return <p key={index} className="my-2">{line}</p>;
                  }
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCategories.length > 0 ? (
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
                          <div 
                            key={guideline.id}
                            onClick={() => handleGuidelineClick(category.id, guideline.id)}
                            className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <span>{guideline.title}</span>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
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
          )
        )}
      </div>
      
      {/* Development notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="font-bold">Development Version</p>
        <p className="text-sm">These are the latest JRCALC and local trust guidelines.</p>
      </div>
    </div>
  );
};

export default Guidelines;
