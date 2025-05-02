
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEncounter } from '../contexts/EncounterContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

// Define call types for dropdown
const callTypes = [
  'Medical',
  'Trauma',
  'Obstetric',
  'Paediatric',
  'Mental Health',
  'Other'
];

const NewEncounterPage = () => {
  const [incidentNumber, setIncidentNumber] = useState('');
  const [callType, setCallType] = useState('Medical');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createNewEncounter } = useEncounter();
  const navigate = useNavigate();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!incidentNumber.trim()) {
      setError('Please enter an incident number');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create new encounter and redirect to patient details
      const newId = await createNewEncounter(incidentNumber.trim(), callType);
      navigate(`/encounter/${newId}/patient`);
    } catch (err) {
      setError('Failed to create encounter. Please try again.');
      console.error('Encounter creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Start New Encounter</h1>
      
      <div className="clinical-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Number */}
          <div>
            <label htmlFor="incidentNumber" className="block text-lg mb-2 font-medium">
              Incident Number
            </label>
            <input
              id="incidentNumber"
              type="text"
              value={incidentNumber}
              onChange={(e) => setIncidentNumber(e.target.value)}
              placeholder="e.g., CAD12345"
              className="clinical-input w-full"
              autoComplete="off"
            />
          </div>
          
          {/* Call Type */}
          <div>
            <label htmlFor="callType" className="block text-lg mb-2 font-medium">
              Call Type
            </label>
            <select
              id="callType"
              value={callType}
              onChange={(e) => setCallType(e.target.value)}
              className="clinical-input w-full"
            >
              {callTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900 dark:border-red-700">
              <div className="flex">
                <AlertCircle className="text-red-600 dark:text-red-400" />
                <p className="ml-3 text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md font-medium flex items-center"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <CheckCircle className="mr-2" size={20} />
                  Start Encounter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEncounterPage;
