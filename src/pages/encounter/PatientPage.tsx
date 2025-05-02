
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, PatientDetails } from '../../lib/db';
import { calculateAge } from '../../lib/clinical-utils';
import { Save, UserCheck, AlertTriangle, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { NHSNumberInput } from '../../components/patient/NHSNumberInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-notification';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const encounterId = parseInt(id || '0');
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
    
    try {
      await db.encounters.update(encounterId, {
        patientDetails,
        isUnknownPatient,
        isMajorIncident,
        lastUpdated: new Date()
      });
      
      toast({
        title: "Patient details saved",
        description: "Patient information has been updated successfully",
        variant: "success"
      });
      
      // Log the event
      await db.logIncident(encounterId, 'Patient Details Updated');
    } catch (error) {
      console.error('Error saving patient data:', error);
      toast({
        title: "Save failed",
        description: "Could not save patient details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
    return (
      <div className="flex items-center justify-center h-64 p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-nhs-blue dark:text-nhs-light-blue">Patient Details</h1>
        <Button
          onClick={savePatientData}
          disabled={isSaving}
          className="bg-nhs-blue hover:bg-nhs-dark-blue text-white"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      
      {/* Special patient flags */}
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleUnknownPatientToggle}
          className={`flex items-center p-3 rounded-lg border shadow-sm transition-colors ${
            isUnknownPatient 
              ? 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200' 
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <UserCheck size={20} className="mr-2" />
          Unknown Patient
        </button>
        
        <button
          type="button"
          onClick={() => setIsMajorIncident(!isMajorIncident)}
          className={`flex items-center p-3 rounded-lg border shadow-sm transition-colors ${
            isMajorIncident 
              ? 'bg-red-100 dark:bg-red-900/60 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200' 
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <AlertTriangle size={20} className="mr-2" />
          Major Incident Casualty
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-nhs-blue dark:text-nhs-light-blue flex items-center">
          <UserCheck className="mr-2" size={20} />
          Demographics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name fields */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">First Name</label>
            <Input
              id="firstName"
              type="text"
              value={patientDetails.firstName || ''}
              onChange={(e) => setPatientDetails({...patientDetails, firstName: e.target.value})}
              className="w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Last Name</label>
            <Input
              id="lastName"
              type="text"
              value={patientDetails.lastName || ''}
              onChange={(e) => setPatientDetails({...patientDetails, lastName: e.target.value})}
              className="w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* DOB and Age */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Birth</label>
            <div className="relative">
              <Input
                id="dob"
                type="date"
                value={patientDetails.dateOfBirth ? new Date(patientDetails.dateOfBirth).toISOString().split('T')[0] : ''}
                onChange={handleDOBChange}
                className="w-full"
                disabled={isUnknownPatient}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Age</label>
            <div className="flex">
              <Input
                id="age"
                type="number"
                value={patientDetails.age || ''}
                onChange={(e) => setPatientDetails({...patientDetails, age: parseInt(e.target.value) || undefined})}
                className="w-full"
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
            <label htmlFor="sex" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sex</label>
            <select
              id="sex"
              value={patientDetails.sex || ''}
              onChange={(e) => setPatientDetails({...patientDetails, sex: e.target.value})}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-nhs-blue dark:focus:ring-nhs-light-blue focus:border-transparent transition-colors"
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
            <label htmlFor="nhsNumber" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">NHS Number</label>
            <NHSNumberInput 
              value={patientDetails.nhsNumber || ''}
              onChange={(value) => setPatientDetails({...patientDetails, nhsNumber: value})}
              disabled={isUnknownPatient}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-nhs-blue dark:text-nhs-light-blue flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address</label>
            <Input
              id="address"
              type="text"
              value={patientDetails.address || ''}
              onChange={(e) => setPatientDetails({...patientDetails, address: e.target.value})}
              className="w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* Contact Number */}
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contact Number</label>
            <Input
              id="contactNumber"
              type="tel"
              value={patientDetails.contactNumber || ''}
              onChange={(e) => setPatientDetails({...patientDetails, contactNumber: e.target.value})}
              className="w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* Next of Kin */}
          <div>
            <label htmlFor="nextOfKin" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Next of Kin</label>
            <Input
              id="nextOfKin"
              type="text"
              value={patientDetails.nextOfKin || ''}
              onChange={(e) => setPatientDetails({...patientDetails, nextOfKin: e.target.value})}
              className="w-full"
              disabled={isUnknownPatient}
            />
          </div>
          
          {/* Next of Kin Contact */}
          <div>
            <label htmlFor="nextOfKinContact" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Next of Kin Contact</label>
            <Input
              id="nextOfKinContact"
              type="tel"
              value={patientDetails.nextOfKinContact || ''}
              onChange={(e) => setPatientDetails({...patientDetails, nextOfKinContact: e.target.value})}
              className="w-full"
              disabled={isUnknownPatient}
            />
          </div>
        </div>
      </div>
      
      {/* Submit button (bottom) */}
      <div className="flex justify-end">
        <Button
          onClick={savePatientData}
          disabled={isSaving}
          className="bg-nhs-blue hover:bg-nhs-dark-blue text-white px-6 py-3"
          size="lg"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Patient Details'}
        </Button>
      </div>
    </div>
  );
};

export default PatientPage;
