
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEncounter } from '../contexts/EncounterContext';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-notification';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { createNewEncounter } = useEncounter();
  const navigate = useNavigate();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setValidationError(null);
    
    // Basic validation
    if (!incidentNumber.trim()) {
      setValidationError('Please enter an incident number');
      return;
    }
    
    // Check incident number format (alphanumeric with optional dash or slash)
    const validFormat = /^[A-Za-z0-9\-\/]+$/.test(incidentNumber);
    if (!validFormat) {
      setValidationError('Incident number should only contain letters, numbers, dashes, or slashes');
      return;
    }
    
    // Minimum length
    if (incidentNumber.trim().length < 3) {
      setValidationError('Incident number should be at least 3 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new encounter and redirect to patient details
      const newId = await createNewEncounter(incidentNumber.trim(), callType);
      
      // Provide feedback before navigation
      navigate(`/encounter/${newId}/patient`);
    } catch (err) {
      console.error('Encounter creation error:', err);
      setValidationError('Failed to create encounter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Start New Encounter</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Number */}
          <div>
            <label htmlFor="incidentNumber" className="block text-lg mb-2 font-medium text-gray-700 dark:text-gray-300">
              Incident Number
            </label>
            <Input
              id="incidentNumber"
              type="text"
              value={incidentNumber}
              onChange={(e) => setIncidentNumber(e.target.value)}
              placeholder="e.g., CAD12345"
              className="w-full"
              autoComplete="off"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the CAD or incident identifier
            </p>
          </div>
          
          {/* Call Type */}
          <div>
            <label htmlFor="callType" className="block text-lg mb-2 font-medium text-gray-700 dark:text-gray-300">
              Call Type
            </label>
            <select
              id="callType"
              value={callType}
              onChange={(e) => setCallType(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-nhs-blue dark:focus:ring-nhs-light-blue focus:border-transparent transition-colors"
            >
              {callTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select the primary nature of this call
            </p>
          </div>
          
          {/* Error display */}
          {validationError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/30 dark:border-red-700">
              <div className="flex">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="ml-3 text-red-700 dark:text-red-300">{validationError}</p>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-3 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md font-medium flex items-center transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
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
