
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, PatientDetails } from '../../lib/db';
import { calculateAge } from '../../lib/clinical-utils';
import { Save, UserCheck } from 'lucide-react';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const encounterId = parseInt(id || '0');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Patient state
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    firstName: '',
    lastName: '',
    dateOfBirth: undefined,
    age: undefined,
    sex: 'Male',
    nhsNumber: '',
    address: '',
    contactNumber: '',
    nextOfKin: '',
    nextOfKinContact: ''
  });
  
  const [isUnknownPatient, setIsUnknownPatient] = useState(false);
  const [isMajorIncident, setIsMajorIncident] = useState(false);
  
  // Load patient data on component mount
  useEffect(() => {
    const loadPatientData = async () => {
      if (!encounterId) return;
      
      try {
        const encounter = await db.encounters.get(encounterId);
        
        if (encounter) {
          if (encounter.patientDetails) {
            setPatientDetails(encounter.patientDetails);
          }
          
          setIsUnknownPatient(encounter.isUnknownPatient || false);
          setIsMajorIncident(encounter.isMajorIncident || false);
        }
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatientData();
  }, [encounterId]);
  
  // Save patient data
  const savePatientData = async () => {
    if (!encounterId) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await db.encounters.update(encounterId, {
        patientDetails,
        isUnknownPatient,
        isMajorIncident,
        lastUpdated: new Date()
      });
      
      setSaveMessage({ type: 'success', text: 'Patient details saved successfully' });
      
      // Log the event
      await db.logIncident(encounterId, 'Patient Details Updated');
    } catch (error) {
      console.error('Error saving patient data:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save patient details' });
    } finally {
      setIsSaving(false);
      
      // Clear save message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };
  
  // Handle date of birth change and calculate age
  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value ? new Date(e.target.value) : undefined;
    const age = calculateAge(dob);
    
    setPatientDetails({
      ...patientDetails,
      dateOfBirth: dob,
      age
    });
  };
  
  // Handle unknown patient toggle
  const handleUnknownPatientToggle = () => {
    const newValue = !isUnknownPatient;
    setIsUnknownPatient(newValue);
    
    // If toggling to unknown, clear patient details
    if (newValue) {
      setPatientDetails({
        firstName: 'Unknown',
        lastName: 'Patient',
        dateOfBirth: undefined,
        age: undefined,
        sex: 'Unknown',
        nhsNumber: '',
        address: '',
        contactNumber: '',
        nextOfKin: '',
        nextOfKinContact: ''
      });
    }
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading patient details...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient Details</h1>
        <button
          onClick={savePatientData}
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
      
      {/* Special patient flags */}
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleUnknownPatientToggle}
          className={`flex items-center p-3 rounded-md border ${
            isUnknownPatient 
              ? 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <UserCheck size={20} className="mr-2" />
          Unknown Patient
        </button>
        
        <button
          type="button"
          onClick={() => setIsMajorIncident(!isMajorIncident)}
          className={`flex items-center p-3 rounded-md border ${
            isMajorIncident 
              ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84Z"/>
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
          </svg>
          Major Incident Casualty
        </button>
      </div>
      
      <div className="clinical-card">
        <h2 className="text-xl font-semibold mb-4">Demographics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name fields */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
            <input
              id="firstName"
              type="text"
              value={patientDetails.firstName || ''}
              onChange={(e) => setPatientDetails({...patientDetails, firstName: e.target.value})}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={patientDetails.lastName || ''}
              onChange={(e) => setPatientDetails({...patientDetails, lastName: e.target.value})}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* DOB and Age */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={patientDetails.dateOfBirth ? new Date(patientDetails.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={handleDOBChange}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>
            <div className="flex">
              <input
                id="age"
                type="number"
                value={patientDetails.age || ''}
                onChange={(e) => setPatientDetails({...patientDetails, age: parseInt(e.target.value) || undefined})}
                className="clinical-input w-full"
                disabled={isUnknownPatient || patientDetails.dateOfBirth !== undefined}
                placeholder={patientDetails.dateOfBirth ? "Calculated from DOB" : ""}
              />
              {patientDetails.age && (
                <span className="ml-2 flex items-center text-gray-700 dark:text-gray-300">years</span>
              )}
            </div>
          </div>
          
          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block text-sm font-medium mb-1">Sex</label>
            <select
              id="sex"
              value={patientDetails.sex || ''}
              onChange={(e) => setPatientDetails({...patientDetails, sex: e.target.value})}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          
          {/* NHS Number */}
          <div>
            <label htmlFor="nhsNumber" className="block text-sm font-medium mb-1">NHS Number</label>
            <input
              id="nhsNumber"
              type="text"
              value={patientDetails.nhsNumber || ''}
              onChange={(e) => setPatientDetails({...patientDetails, nhsNumber: e.target.value})}
              className="clinical-input w-full"
              placeholder="XXX XXX XXXX"
              disabled={isUnknownPatient}
            />
          </div>
        </div>
      </div>
      
      <div className="clinical-card">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
            <input
              id="address"
              type="text"
              value={patientDetails.address || ''}
              onChange={(e) => setPatientDetails({...patientDetails, address: e.target.value})}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* Contact Number */}
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              id="contactNumber"
              type="tel"
              value={patientDetails.contactNumber || ''}
              onChange={(e) => setPatientDetails({...patientDetails, contactNumber: e.target.value})}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* Next of Kin */}
          <div>
            <label htmlFor="nextOfKin" className="block text-sm font-medium mb-1">Next of Kin</label>
            <input
              id="nextOfKin"
              type="text"
              value={patientDetails.nextOfKin || ''}
              onChange={(e) => setPatientDetails({...patientDetails, nextOfKin: e.target.value})}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* Next of Kin Contact */}
          <div>
            <label htmlFor="nextOfKinContact" className="block text-sm font-medium mb-1">Next of Kin Contact</label>
            <input
              id="nextOfKinContact"
              type="tel"
              value={patientDetails.nextOfKinContact || ''}
              onChange={(e) => setPatientDetails({...patientDetails, nextOfKinContact: e.target.value})}
              className="clinical-input w-full"
              disabled={isUnknownPatient}
            />
          </div>
        </div>
      </div>
      
      {/* Submit button (bottom) */}
      <div className="flex justify-end">
        <button
          onClick={savePatientData}
          disabled={isSaving}
          className="bg-nhs-blue hover:bg-nhs-dark-blue text-white px-6 py-3 rounded-md flex items-center"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Patient Details'}
        </button>
      </div>
    </div>
  );
};

export default PatientPage;
