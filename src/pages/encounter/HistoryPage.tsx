import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, PatientHistory, PatientAllergy, PatientMedication } from '../../lib/db';
import { Save, Plus, Trash, Edit, X, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const HistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const encounterId = parseInt(id || '0');
  
  const [patientHistory, setPatientHistory] = useState<PatientHistory>({
    encounterId,
    presentingComplaint: '',
    historyPresentingComplaint: '',
    pastMedicalHistory: '',
    socialHistory: '',
    familyHistory: '',
    allergies: [],
    medications: [],
    safeguardingConcerns: false,
    safeguardingNotes: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  const [editingAllergyId, setEditingAllergyId] = useState<number | null>(null);
  
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<number | null>(null);
  
  const [hasNKDA, setHasNKDA] = useState(false);
  const [hasNoMeds, setHasNoMeds] = useState(false);

  // Load patient history on component mount
  useEffect(() => {
    const loadPatientHistory = async () => {
      if (!encounterId) return;
      
      try {
        // Try to find existing history for this encounter
        const history = await db.patientHistories
          .where('encounterId')
          .equals(encounterId)
          .first();
        
        if (history) {
          // If we have history, load allergies and medications
          const allergies = await db.allergies.toArray();
          const medications = await db.medications.toArray();
          
          setPatientHistory({
            ...history,
            allergies: allergies || [],
            medications: medications || []
          });
          
          // Set the checkbox states based on data
          setHasNKDA(allergies.length === 0);
          setHasNoMeds(medications.length === 0);
        }
      } catch (error) {
        console.error('Error loading patient history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatientHistory();
  }, [encounterId]);
  
  // Handle saving the patient history
  const saveHistory = async () => {
    if (!encounterId) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Check if history already exists
      const existingHistory = await db.patientHistories
        .where('encounterId')
        .equals(encounterId)
        .first();
      
      if (existingHistory) {
        // Update existing history
        await db.patientHistories.update(existingHistory.id!, {
          presentingComplaint: patientHistory.presentingComplaint,
          historyPresentingComplaint: patientHistory.historyPresentingComplaint,
          pastMedicalHistory: patientHistory.pastMedicalHistory,
          socialHistory: patientHistory.socialHistory,
          familyHistory: patientHistory.familyHistory,
          safeguardingConcerns: patientHistory.safeguardingConcerns,
          safeguardingNotes: patientHistory.safeguardingNotes
        });
      } else {
        // Create new history
        const historyId = await db.patientHistories.add({
          encounterId,
          presentingComplaint: patientHistory.presentingComplaint,
          historyPresentingComplaint: patientHistory.historyPresentingComplaint,
          pastMedicalHistory: patientHistory.pastMedicalHistory,
          socialHistory: patientHistory.socialHistory,
          familyHistory: patientHistory.familyHistory,
          safeguardingConcerns: patientHistory.safeguardingConcerns,
          safeguardingNotes: patientHistory.safeguardingNotes,
          allergies: [],
          medications: []
        });
      }
      
      // Log the event
      await db.logIncident(encounterId, 'Patient History Updated');
      
      setSaveMessage({ type: 'success', text: 'History saved successfully' });
    } catch (error) {
      console.error('Error saving patient history:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save history' });
    } finally {
      setIsSaving(false);
      
      // Clear save message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };
  
  // Update a field in the patient history
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPatientHistory({
        ...patientHistory,
        [name]: checked
      });
      return;
    }
    
    setPatientHistory({
      ...patientHistory,
      [name]: value
    });
  };
  
  // Handle speech-to-text (placeholder)
  const handleSpeechToText = (fieldName: string) => {
    console.log(`Speech-to-text triggered for ${fieldName}`);
    alert('Voice input is a placeholder feature. Not implemented in this version.');
    // PLACEHOLDER: Speech-to-text implementation would go here
  };
  
  // Handle NKDA checkbox
  const handleNKDAChange = (checked: boolean) => {
    setHasNKDA(checked);
    
    if (checked) {
      // Clear allergies if NKDA is checked
      setPatientHistory({
        ...patientHistory,
        allergies: []
      });
      // Clear allergies from database
      db.allergies.clear()
        .catch(err => console.error('Error clearing allergies:', err));
    }
  };
  
  // Handle No Medications checkbox
  const handleNoMedsChange = (checked: boolean) => {
    setHasNoMeds(checked);
    
    if (checked) {
      // Clear medications if "No Regular Meds" is checked
      setPatientHistory({
        ...patientHistory,
        medications: []
      });
      // Clear medications from database
      db.medications.clear()
        .catch(err => console.error('Error clearing medications:', err));
    }
  };
  
  // Add or edit an allergy
  const saveAllergy = (allergy: PatientAllergy) => {
    // Uncheck NKDA when adding an allergy
    setHasNKDA(false);
    
    if (editingAllergyId) {
      // Update existing allergy
      setPatientHistory({
        ...patientHistory,
        allergies: patientHistory.allergies.map(a => 
          a.id === editingAllergyId ? { ...allergy, id: editingAllergyId } : a
        )
      });
      
      // Update in database
      db.allergies.update(editingAllergyId, allergy)
        .catch(err => console.error('Error updating allergy:', err));
    } else {
      // Add new allergy with a temporary ID
      const newAllergy = { ...allergy, id: Date.now() };
      setPatientHistory({
        ...patientHistory,
        allergies: [...patientHistory.allergies, newAllergy]
      });
      
      // Add to database
      db.allergies.add(newAllergy)
        .catch(err => console.error('Error adding allergy:', err));
    }
    
    setShowAddAllergyModal(false);
    setEditingAllergyId(null);
  };
  
  // Delete an allergy
  const deleteAllergy = (id: number) => {
    const updatedAllergies = patientHistory.allergies.filter(a => a.id !== id);
    setPatientHistory({
      ...patientHistory,
      allergies: updatedAllergies
    });
    
    // If no allergies left, set NKDA to true
    if (updatedAllergies.length === 0) {
      setHasNKDA(true);
    }
    
    // Delete from database
    db.allergies.delete(id)
      .catch(err => console.error('Error deleting allergy:', err));
  };
  
  // Add or edit a medication
  const saveMedication = (medication: PatientMedication) => {
    // Uncheck No Regular Meds when adding a medication
    setHasNoMeds(false);
    
    if (editingMedicationId) {
      // Update existing medication
      setPatientHistory({
        ...patientHistory,
        medications: patientHistory.medications.map(m => 
          m.id === editingMedicationId ? { ...medication, id: editingMedicationId } : m
        )
      });
      
      // Update in database
      db.medications.update(editingMedicationId, medication)
        .catch(err => console.error('Error updating medication:', err));
    } else {
      // Add new medication with a temporary ID
      const newMedication = { ...medication, id: Date.now() };
      setPatientHistory({
        ...patientHistory,
        medications: [...patientHistory.medications, newMedication]
      });
      
      // Add to database
      db.medications.add(newMedication)
        .catch(err => console.error('Error adding medication:', err));
    }
    
    setShowAddMedicationModal(false);
    setEditingMedicationId(null);
  };
  
  // Delete a medication
  const deleteMedication = (id: number) => {
    const updatedMedications = patientHistory.medications.filter(m => m.id !== id);
    setPatientHistory({
      ...patientHistory,
      medications: updatedMedications
    });
    
    // If no medications left, set No Regular Meds to true
    if (updatedMedications.length === 0) {
      setHasNoMeds(true);
    }
    
    // Delete from database
    db.medications.delete(id)
      .catch(err => console.error('Error deleting medication:', err));
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading patient history...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient History</h1>
        <button
          onClick={saveHistory}
          disabled={isSaving}
          className="bg-nhs-blue hover:bg-nhs-dark-blue text-white px-4 py-2 rounded-md flex items-center"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      {/* Save message */}
      {saveMessage && (
        <div className={`p-3 rounded-md ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200'
        }`}>
          {saveMessage.text}
        </div>
      )}
      
      {/* Presenting Complaint */}
      <div className="clinical-card">
        <h2 className="text-xl font-semibold mb-4">Presenting Complaint</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-grow">
              <textarea
                id="presentingComplaint"
                name="presentingComplaint"
                value={patientHistory.presentingComplaint || ''}
                onChange={handleInputChange}
                className="clinical-input w-full h-24"
                placeholder="Chief complaint or reason for ambulance call"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSpeechToText('presentingComplaint')}
              className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
              title="Voice Input (Placeholder)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* History of Presenting Complaint (OPQRST) */}
      <details className="clinical-card" open>
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          History of Presenting Complaint
        </summary>
        
        <div className="space-y-4 pl-2">
          <div>
            <label htmlFor="historyPresentingComplaint" className="block text-sm font-medium mb-1">
              OPQRST Assessment
            </label>
            <div className="flex items-start">
              <div className="flex-grow">
                <textarea
                  id="historyPresentingComplaint"
                  name="historyPresentingComplaint"
                  value={patientHistory.historyPresentingComplaint || ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full h-32"
                  placeholder="Onset: When did it start?\nProvocation: What makes it better/worse?\nQuality: Describe the sensation\nRadiation: Does it spread?\nSeverity: How bad is it (0-10)?\nTime: Duration and frequency"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSpeechToText('historyPresentingComplaint')}
                className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                title="Voice Input (Placeholder)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </details>
      
      {/* Past Medical History */}
      <details className="clinical-card">
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          Past Medical History
        </summary>
        
        <div className="space-y-4 pl-2">
          <div>
            <div className="flex items-start">
              <div className="flex-grow">
                <textarea
                  id="pastMedicalHistory"
                  name="pastMedicalHistory"
                  value={patientHistory.pastMedicalHistory || ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full h-24"
                  placeholder="Previous medical conditions, surgeries, hospitalizations"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSpeechToText('pastMedicalHistory')}
                className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                title="Voice Input (Placeholder)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </details>
      
      {/* Allergies */}
      <details className="clinical-card" open>
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          Allergies
        </summary>
        
        <div className="space-y-4 pl-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nkda"
                  checked={hasNKDA}
                  onCheckedChange={(checked) => handleNKDAChange(!!checked)}
                />
                <label htmlFor="nkda" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  No Known Drug Allergies (NKDA)
                </label>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setEditingAllergyId(null);
                setShowAddAllergyModal(true);
              }}
              disabled={hasNKDA}
              className={`flex items-center px-3 py-1 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md ${hasNKDA ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus size={16} className="mr-1" />
              Add Allergy
            </button>
          </div>
          
          {/* Allergies List */}
          {patientHistory.allergies.length > 0 ? (
            <div className="mt-3 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Allergen
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reaction
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {patientHistory.allergies.map(allergy => (
                    <tr key={allergy.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {allergy.allergen}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {allergy.reaction || '—'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          allergy.severity === 'Severe' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          allergy.severity === 'Moderate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {allergy.severity || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingAllergyId(allergy.id);
                            setShowAddAllergyModal(true);
                          }}
                          className="text-nhs-blue hover:text-nhs-dark-blue mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteAllergy(allergy.id!)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              No allergies recorded
            </div>
          )}
        </div>
      </details>
      
      {/* Medications */}
      <details className="clinical-card">
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          Medications
        </summary>
        
        <div className="space-y-4 pl-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noMeds"
                  checked={hasNoMeds}
                  onCheckedChange={(checked) => handleNoMedsChange(!!checked)}
                />
                <label htmlFor="noMeds" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  No Regular Medications
                </label>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setEditingMedicationId(null);
                setShowAddMedicationModal(true);
              }}
              disabled={hasNoMeds}
              className={`flex items-center px-3 py-1 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md ${hasNoMeds ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus size={16} className="mr-1" />
              Add Medication
            </button>
          </div>
          
          {/* Medications List */}
          {patientHistory.medications.length > 0 ? (
            <div className="mt-3 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dose
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {patientHistory.medications.map(medication => (
                    <tr key={medication.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {medication.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {medication.dose || '—'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {medication.frequency || '—'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {medication.route || '—'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingMedicationId(medication.id);
                            setShowAddMedicationModal(true);
                          }}
                          className="text-nhs-blue hover:text-nhs-dark-blue mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteMedication(medication.id!)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              No medications recorded
            </div>
          )}
        </div>
      </details>
      
      {/* Family History */}
      <details className="clinical-card">
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          Family History
        </summary>
        
        <div className="space-y-4 pl-2">
          <div className="flex items-start">
            <div className="flex-grow">
              <textarea
                id="familyHistory"
                name="familyHistory"
                value={patientHistory.familyHistory || ''}
                onChange={handleInputChange}
                className="clinical-input w-full h-20"
                placeholder="Relevant medical conditions in family members"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSpeechToText('familyHistory')}
              className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
              title="Voice Input (Placeholder)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
          </div>
        </div>
      </details>
      
      {/* Social History */}
      <details className="clinical-card">
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          Social History
        </summary>
        
        <div className="space-y-4 pl-2">
          <div className="flex items-start">
            <div className="flex-grow">
              <textarea
                id="socialHistory"
                name="socialHistory"
                value={patientHistory.socialHistory || ''}
                onChange={handleInputChange}
                className="clinical-input w-full h-20"
                placeholder="Living situation, alcohol, tobacco, recreational drugs"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSpeechToText('socialHistory')}
              className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
              title="Voice Input (Placeholder)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
          </div>
        </div>
      </details>
      
      {/* Safeguarding */}
      <details className="clinical-card">
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          Safeguarding Concerns
        </summary>
        
        <div className="space-y-4 pl-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="safeguardingConcerns"
                checked={patientHistory.safeguardingConcerns || false}
                onCheckedChange={(checked) => {
                  setPatientHistory({
                    ...patientHistory,
                    safeguardingConcerns: !!checked
                  });
                }}
              />
              <label htmlFor="safeguardingConcerns" className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Safeguarding concerns noted
              </label>
            </div>
          </div>
          
          {patientHistory.safeguardingConcerns && (
            <div className="mt-3">
              <label htmlFor="safeguardingNotes" className="block text-sm font-medium mb-1">
                Details of concerns
              </label>
              <div className="flex items-start">
                <div className="flex-grow">
                  <textarea
                    id="safeguardingNotes"
                    name="safeguardingNotes"
                    value={patientHistory.safeguardingNotes || ''}
                    onChange={handleInputChange}
                    className="clinical-input w-full h-20 border-red-300 dark:border-red-700"
                    placeholder="Document safeguarding concerns here"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </details>
      
      {/* Body Map (Placeholder) */}
      <details className="clinical-card">
        <summary className="text-xl font-semibold mb-4 cursor-pointer">
          Body Map
        </summary>
        
        <div className="space-y-4 pl-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Body map feature will be implemented in a future version.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              PLACEHOLDER: Would include front/back body diagrams with point-and-click interface
            </p>
          </div>
        </div>
      </details>
      
      {/* Submit button (bottom) */}
      <div className="flex justify-end">
        <button
          onClick={saveHistory}
          disabled={isSaving}
          className="bg-nhs-blue hover:bg-nhs-dark-blue text-white px-6 py-3 rounded-md flex items-center"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Patient History'}
        </button>
      </div>
      
      {/* Add Allergy Modal */}
      {showAddAllergyModal && (
        <AddAllergyModal
          currentAllergy={
            editingAllergyId 
              ? patientHistory.allergies.find(a => a.id === editingAllergyId) 
              : undefined
          }
          onSave={saveAllergy}
          onCancel={() => {
            setShowAddAllergyModal(false);
            setEditingAllergyId(null);
          }}
        />
      )}
      
      {/* Add Medication Modal */}
      {showAddMedicationModal && (
        <AddMedicationModal
          currentMedication={
            editingMedicationId 
              ? patientHistory.medications.find(m => m.id === editingMedicationId) 
              : undefined
          }
          onSave={saveMedication}
          onCancel={() => {
            setShowAddMedicationModal(false);
            setEditingMedicationId(null);
          }}
        />
      )}
    </div>
  );
};

// Add Allergy Modal
const AddAllergyModal = ({ 
  currentAllergy, 
  onSave, 
  onCancel 
}: { 
  currentAllergy?: PatientAllergy,
  onSave: (allergy: PatientAllergy) => void,
  onCancel: () => void
}) => {
  const [allergyData, setAllergyData] = useState<PatientAllergy>({
    allergen: currentAllergy?.allergen || '',
    reaction: currentAllergy?.reaction || '',
    severity: currentAllergy?.severity || 'Mild'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAllergyData({
      ...allergyData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(allergyData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {currentAllergy ? 'Edit Allergy' : 'Add Allergy'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Allergen */}
          <div>
            <label htmlFor="allergen" className="block text-sm font-medium mb-1">
              Allergen
            </label>
            <input
              id="allergen"
              name="allergen"
              type="text"
              value={allergyData.allergen}
              onChange={handleChange}
              className="clinical-input w-full"
              placeholder="e.g., Penicillin"
              required
            />
          </div>
          
          {/* Reaction */}
          <div>
            <label htmlFor="reaction" className="block text-sm font-medium mb-1">
              Reaction
            </label>
            <input
              id="reaction"
              name="reaction"
              type="text"
              value={allergyData.reaction || ''}
              onChange={handleChange}
              className="clinical-input w-full"
              placeholder="e.g., Rash, Anaphylaxis"
            />
          </div>
          
          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium mb-1">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={allergyData.severity || 'Mild'}
              onChange={handleChange}
              className="clinical-input w-full"
            >
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md flex items-center"
            >
              <Check size={18} className="mr-2" />
              {currentAllergy ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Medication Modal
const AddMedicationModal = ({ 
  currentMedication, 
  onSave, 
  onCancel 
}: { 
  currentMedication?: PatientMedication,
  onSave: (medication: PatientMedication) => void,
  onCancel: () => void
}) => {
  const [medicationData, setMedicationData] = useState<PatientMedication>({
    name: currentMedication?.name || '',
    dose: currentMedication?.dose || '',
    frequency: currentMedication?.frequency || '',
    route: currentMedication?.route || '',
    lastTaken: currentMedication?.lastTaken
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMedicationData({
      ...medicationData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(medicationData);
  };
  
  const routeOptions = [
    'Oral',
    'Intravenous',
    'Intramuscular',
    'Subcutaneous',
    'Topical',
    'Inhaled',
    'Sublingual',
    'Rectal',
    'Transdermal',
    'Other'
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {currentMedication ? 'Edit Medication' : 'Add Medication'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Medication Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Medication Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={medicationData.name}
              onChange={handleChange}
              className="clinical-input w-full"
              placeholder="e.g., Ramipril"
              required
            />
          </div>
          
          {/* Dose */}
          <div>
            <label htmlFor="dose" className="block text-sm font-medium mb-1">
              Dose
            </label>
            <input
              id="dose"
              name="dose"
              type="text"
              value={medicationData.dose || ''}
              onChange={handleChange}
              className="clinical-input w-full"
              placeholder="e.g., 5mg"
            />
          </div>
          
          {/* Frequency */}
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium mb-1">
              Frequency
            </label>
            <input
              id="frequency"
              name="frequency"
              type="text"
              value={medicationData.frequency || ''}
              onChange={handleChange}
              className="clinical-input w-full"
              placeholder="e.g., Once daily, Twice daily, PRN"
            />
          </div>
          
          {/* Route */}
          <div>
            <label htmlFor="route" className="block text-sm font-medium mb-1">
              Route
            </label>
            <select
              id="route"
              name="route"
              value={medicationData.route || ''}
              onChange={handleChange}
              className="clinical-input w-full"
            >
              <option value="">Select route</option>
              {routeOptions.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
          
          {/* Last Taken */}
          <div>
            <label htmlFor="lastTaken" className="block text-sm font-medium mb-1">
              Last Taken (if known)
            </label>
            <input
              id="lastTaken"
              name="lastTaken"
              type="datetime-local"
              value={medicationData.lastTaken ? new Date(medicationData.lastTaken).toISOString().slice(0, 16) : ''}
              onChange={(e) => setMedicationData({
                ...medicationData,
                lastTaken: e.target.value ? new Date(e.target.value) : undefined
              })}
              className="clinical-input w-full"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md flex items-center"
            >
              <Check size={18} className="mr-2" />
              {currentMedication ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HistoryPage;
