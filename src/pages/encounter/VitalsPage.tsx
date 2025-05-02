import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, VitalSignReading } from '../../lib/db';
import { calculateNEWS2, calculateGCS } from '../../lib/clinical-utils';
import { Activity, Plus, Trash, Edit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalsPage = () => {
  const { id } = useParams<{ id: string }>();
  const encounterId = parseInt(id || '0');
  
  const [vitalSigns, setVitalSigns] = useState<VitalSignReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVitalsId, setEditingVitalsId] = useState<number | null>(null);
  
  // Load vitals on component mount
  useEffect(() => {
    const loadVitalSigns = async () => {
      if (!encounterId) return;
      
      try {
        const vitals = await db.vitalSigns
          .where('encounterId')
          .equals(encounterId)
          .reverse()
          .sortBy('timestamp');
        
        setVitalSigns(vitals);
      } catch (error) {
        console.error('Error loading vital signs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVitalSigns();
  }, [encounterId]);
  
  // Handle refreshing vitals data after add/edit/delete
  const refreshVitalSigns = async () => {
    if (!encounterId) return;
    
    try {
      const vitals = await db.vitalSigns
        .where('encounterId')
        .equals(encounterId)
        .reverse()
        .sortBy('timestamp');
      
      setVitalSigns(vitals);
    } catch (error) {
      console.error('Error refreshing vital signs:', error);
    }
  };
  
  // Handle editing a vital sign reading
  const handleEditVitals = (id: number) => {
    setEditingVitalsId(id);
    setShowAddModal(true);
  };
  
  // Handle deleting a vital sign reading
  const handleDeleteVitals = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vital signs reading?')) {
      return;
    }
    
    try {
      await db.vitalSigns.delete(id);
      await refreshVitalSigns();
    } catch (error) {
      console.error('Error deleting vital signs:', error);
    }
  };
  
  // Format chart data
  const chartData = vitalSigns
    .slice()
    .reverse()
    .map(reading => ({
      name: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      HeartRate: reading.heartRate,
      RespiratoryRate: reading.respiratoryRate,
      SpO2: reading.oxygenSaturation,
      SystolicBP: reading.systolicBP,
      NEWS2: reading.news2Score,
      timestamp: new Date(reading.timestamp).getTime() // For sorting
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vital Signs</h1>
        <button
          onClick={() => {
            setEditingVitalsId(null);
            setShowAddModal(true);
          }}
          className="bg-nhs-blue hover:bg-nhs-dark-blue text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Vitals
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center p-8">Loading vital signs...</div>
      ) : vitalSigns.length === 0 ? (
        <div className="clinical-card text-center p-8">
          <Activity size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No vital signs recorded yet.</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Click "Add Vitals" to record patient observations.</p>
        </div>
      ) : (
        <>
          {/* Latest NEWS2 Score */}
          {vitalSigns.length > 0 && vitalSigns[0].news2Score !== undefined && (
            <div className="clinical-card">
              <h2 className="text-lg font-medium mb-3">Latest NEWS2 Score</h2>
              <div className="flex items-center">
                <div className={`news2-score-indicator ${
                  vitalSigns[0].news2RiskLevel === 'Low' ? 'news2-low' :
                  vitalSigns[0].news2RiskLevel === 'Medium' ? 'news2-medium' : 'news2-high'
                }`}>
                  {vitalSigns[0].news2Score}
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">{vitalSigns[0].news2RiskLevel} Risk</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recorded at {new Date(vitalSigns[0].timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Vitals Table */}
          <div className="clinical-card overflow-auto">
            <h2 className="text-lg font-medium mb-3">Recorded Observations</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">HR</th>
                  <th className="p-3 text-left">RR</th>
                  <th className="p-3 text-left">SpO2</th>
                  <th className="p-3 text-left">BP</th>
                  <th className="p-3 text-left">Temp</th>
                  <th className="p-3 text-left">GCS</th>
                  <th className="p-3 text-left">NEWS2</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vitalSigns.map(reading => (
                  <tr key={reading.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{new Date(reading.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3">{reading.heartRate}</td>
                    <td className="p-3">{reading.respiratoryRate}</td>
                    <td className="p-3">
                      {reading.oxygenSaturation}%
                      {reading.isOnOxygen && <span className="ml-1 text-xs">(O₂)</span>}
                    </td>
                    <td className="p-3">
                      {reading.systolicBP}/{reading.diastolicBP}
                    </td>
                    <td className="p-3">{reading.temperature}°C</td>
                    <td className="p-3">{reading.gcsTotalScore}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        reading.news2RiskLevel === 'Low' ? 'news2-low' :
                        reading.news2RiskLevel === 'Medium' ? 'news2-medium' : 'news2-high'
                      }`}>
                        {reading.news2Score}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditVitals(reading.id!)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteVitals(reading.id!)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Charts */}
          {vitalSigns.length > 1 && (
            <div className="clinical-card">
              <h2 className="text-lg font-medium mb-3">Trends</h2>
              
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="HeartRate" stroke="#FF8370" name="Heart Rate" />
                    <Line yAxisId="left" type="monotone" dataKey="RespiratoryRate" stroke="#7367F0" name="Resp Rate" />
                    <Line yAxisId="left" type="monotone" dataKey="SpO2" stroke="#00CFE8" name="SpO2" />
                    <Line yAxisId="left" type="monotone" dataKey="SystolicBP" stroke="#28C76F" name="Systolic BP" />
                    <Line yAxisId="right" type="monotone" dataKey="NEWS2" stroke="#EA5455" name="NEWS2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Add/Edit Vitals Modal */}
      {showAddModal && (
        <AddVitalsModal
          encounterId={encounterId}
          editingVitalsId={editingVitalsId}
          onClose={() => {
            setShowAddModal(false);
            setEditingVitalsId(null);
          }}
          onSave={refreshVitalSigns}
        />
      )}
    </div>
  );
};

// Add/Edit Vitals Modal Component
const AddVitalsModal = ({ 
  encounterId, 
  editingVitalsId, 
  onClose, 
  onSave 
}: { 
  encounterId: number, 
  editingVitalsId: number | null, 
  onClose: () => void, 
  onSave: () => void 
}) => {
  const [formData, setFormData] = useState<Partial<VitalSignReading>>({
    encounterId,
    timestamp: new Date(),
    heartRate: undefined,
    respiratoryRate: undefined,
    oxygenSaturation: undefined,
    systolicBP: undefined,
    diastolicBP: undefined,
    temperature: undefined,
    bloodGlucose: undefined,
    isOnOxygen: false,
    oxygenDeliveryMethod: '',
    oxygenFlowRate: undefined,
    gcsEye: 4, // Default: Eyes Open
    gcsVerbal: 5, // Default: Oriented
    gcsMotor: 6, // Default: Obeys Commands
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Load existing vital sign data if editing
  useEffect(() => {
    const loadExistingVitals = async () => {
      if (!editingVitalsId) return;
      
      setIsLoading(true);
      try {
        const vitals = await db.vitalSigns.get(editingVitalsId);
        if (vitals) {
          setFormData(vitals);
        }
      } catch (error) {
        console.error('Error loading vital sign data for editing:', error);
        setErrorMessage('Failed to load data for editing');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExistingVitals();
  }, [editingVitalsId]);
  
  // Calculate GCS total score when components change
  useEffect(() => {
    const { gcsEye, gcsVerbal, gcsMotor } = formData;
    const totalGCS = calculateGCS(gcsEye, gcsVerbal, gcsMotor);
    
    setFormData(prev => ({
      ...prev,
      gcsTotalScore: totalGCS
    }));
  }, [formData.gcsEye, formData.gcsVerbal, formData.gcsMotor]);
  
  // Calculate NEWS2 score when required parameters change
  useEffect(() => {
    const { respiratoryRate, oxygenSaturation, isOnOxygen, systolicBP, heartRate, temperature } = formData;
    
    // Only calculate if we have the minimum required values
    if (respiratoryRate !== undefined && oxygenSaturation !== undefined && systolicBP !== undefined) {
      const consciousness = formData.gcsTotalScore === 15 ? 'A' : 'V'; // Simplified for demo
      const news2Result = calculateNEWS2(
        respiratoryRate,
        oxygenSaturation,
        isOnOxygen,
        systolicBP,
        heartRate,
        consciousness,
        temperature
      );
      
      setFormData(prev => ({
        ...prev,
        news2Score: news2Result.score,
        news2RiskLevel: news2Result.riskLevel
      }));
    }
  }, [
    formData.respiratoryRate,
    formData.oxygenSaturation,
    formData.isOnOxygen,
    formData.systolicBP,
    formData.heartRate,
    formData.gcsTotalScore,
    formData.temperature
  ]);
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value)
      });
      return;
    }
    
    // Handle other inputs
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle saving the vital signs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);
    
    try {
      if (editingVitalsId) {
        // Update existing record - removed the lastUpdated property since it's not in the interface
        await db.vitalSigns.update(editingVitalsId, {
          ...formData
        });
      } else {
        // Add new record
        await db.vitalSigns.add(formData as VitalSignReading);
      }
      
      // Log the event
      await db.logIncident(
        encounterId,
        editingVitalsId ? 'Vital Signs Updated' : 'Vital Signs Recorded'
      );
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving vital signs:', error);
      setErrorMessage('Failed to save vital signs');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full">
          <p className="text-center">Loading vital sign data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingVitalsId ? 'Edit Vital Signs' : 'Record Vital Signs'}
        </h2>
        
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Timestamp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="timestamp" className="block text-sm font-medium mb-1">
                Date and Time
              </label>
              <input
                id="timestamp"
                name="timestamp"
                type="datetime-local"
                value={formData.timestamp ? new Date(formData.timestamp).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                className="clinical-input w-full"
                required
              />
            </div>
          </div>
          
          {/* Primary Vitals */}
          <div className="clinical-card">
            <h3 className="text-lg font-medium mb-3">Primary Observations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Heart Rate */}
              <div>
                <label htmlFor="heartRate" className="block text-sm font-medium mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  value={formData.heartRate ?? ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                  min="0"
                  max="300"
                />
              </div>
              
              {/* Respiratory Rate */}
              <div>
                <label htmlFor="respiratoryRate" className="block text-sm font-medium mb-1">
                  Respiratory Rate (bpm)
                </label>
                <input
                  id="respiratoryRate"
                  name="respiratoryRate"
                  type="number"
                  value={formData.respiratoryRate ?? ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                  min="0"
                  max="100"
                />
              </div>
              
              {/* Oxygen Saturation */}
              <div>
                <label htmlFor="oxygenSaturation" className="block text-sm font-medium mb-1">
                  SpO2 (%)
                </label>
                <input
                  id="oxygenSaturation"
                  name="oxygenSaturation"
                  type="number"
                  value={formData.oxygenSaturation ?? ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                  min="0"
                  max="100"
                />
              </div>
              
              {/* Blood Pressure */}
              <div>
                <label htmlFor="systolicBP" className="block text-sm font-medium mb-1">
                  Systolic BP (mmHg)
                </label>
                <input
                  id="systolicBP"
                  name="systolicBP"
                  type="number"
                  value={formData.systolicBP ?? ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                  min="0"
                  max="300"
                />
              </div>
              
              <div>
                <label htmlFor="diastolicBP" className="block text-sm font-medium mb-1">
                  Diastolic BP (mmHg)
                </label>
                <input
                  id="diastolicBP"
                  name="diastolicBP"
                  type="number"
                  value={formData.diastolicBP ?? ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                  min="0"
                  max="200"
                />
              </div>
              
              {/* Temperature */}
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium mb-1">
                  Temperature (°C)
                </label>
                <input
                  id="temperature"
                  name="temperature"
                  type="number"
                  value={formData.temperature ?? ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                  min="25"
                  max="45"
                  step="0.1"
                />
              </div>
            </div>
          </div>
          
          {/* Oxygen */}
          <div className="clinical-card">
            <h3 className="text-lg font-medium mb-3">Oxygen Therapy</h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnOxygen"
                  checked={formData.isOnOxygen}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Patient on supplemental oxygen</span>
              </label>
            </div>
            
            {formData.isOnOxygen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="oxygenDeliveryMethod" className="block text-sm font-medium mb-1">
                    Delivery Method
                  </label>
                  <select
                    id="oxygenDeliveryMethod"
                    name="oxygenDeliveryMethod"
                    value={formData.oxygenDeliveryMethod || ''}
                    onChange={handleInputChange}
                    className="clinical-input w-full"
                  >
                    <option value="">Select method</option>
                    <option value="Nasal Cannula">Nasal Cannula</option>
                    <option value="Simple Face Mask">Simple Face Mask</option>
                    <option value="Non-Rebreather">Non-Rebreather Mask</option>
                    <option value="Venturi Mask">Venturi Mask</option>
                    <option value="BVM">BVM</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="oxygenFlowRate" className="block text-sm font-medium mb-1">
                    Flow Rate (L/min)
                  </label>
                  <input
                    id="oxygenFlowRate"
                    name="oxygenFlowRate"
                    type="number"
                    value={formData.oxygenFlowRate ?? ''}
                    onChange={handleInputChange}
                    className="clinical-input w-full"
                    min="0"
                    max="25"
                    step="0.5"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Glasgow Coma Scale */}
          <div className="clinical-card">
            <h3 className="text-lg font-medium mb-3">Glasgow Coma Scale</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Eye Response */}
              <div>
                <label htmlFor="gcsEye" className="block text-sm font-medium mb-1">
                  Eye Response
                </label>
                <select
                  id="gcsEye"
                  name="gcsEye"
                  value={formData.gcsEye}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                >
                  <option value={1}>1 - No eye opening</option>
                  <option value={2}>2 - Eye opening to pain</option>
                  <option value={3}>3 - Eye opening to verbal command</option>
                  <option value={4}>4 - Eyes open spontaneously</option>
                </select>
              </div>
              
              {/* Verbal Response */}
              <div>
                <label htmlFor="gcsVerbal" className="block text-sm font-medium mb-1">
                  Verbal Response
                </label>
                <select
                  id="gcsVerbal"
                  name="gcsVerbal"
                  value={formData.gcsVerbal}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                >
                  <option value={1}>1 - No verbal response</option>
                  <option value={2}>2 - Incomprehensible sounds</option>
                  <option value={3}>3 - Inappropriate words</option>
                  <option value={4}>4 - Confused</option>
                  <option value={5}>5 - Oriented</option>
                </select>
              </div>
              
              {/* Motor Response */}
              <div>
                <label htmlFor="gcsMotor" className="block text-sm font-medium mb-1">
                  Motor Response
                </label>
                <select
                  id="gcsMotor"
                  name="gcsMotor"
                  value={formData.gcsMotor}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                >
                  <option value={1}>1 - No motor response</option>
                  <option value={2}>2 - Extension to pain</option>
                  <option value={3}>3 - Flexion to pain</option>
                  <option value={4}>4 - Withdrawal from pain</option>
                  <option value={5}>5 - Localizing pain</option>
                  <option value={6}>6 - Obeys commands</option>
                </select>
              </div>
              
              {/* Total GCS Score */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">
                  Total GCS Score
                </label>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-center">
                  <span className="text-2xl font-bold">
                    {formData.gcsTotalScore}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                      / 15
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Parameters */}
          <div className="clinical-card">
            <h3 className="text-lg font-medium mb-3">Additional Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Glucose */}
              <div>
                <label htmlFor="bloodGlucose" className="block text-sm font-medium mb-1">
                  Blood Glucose (mmol/L)
                </label>
                <input
                  id="bloodGlucose"
                  name="bloodGlucose"
                  type="number"
                  value={formData.bloodGlucose ?? ''}
                  onChange={handleInputChange}
                  className="clinical-input w-full"
                  min="0"
                  max="40"
                  step="0.1"
                />
              </div>
            </div>
          </div>
          
          {/* NEWS2 Score (calculated) */}
          {formData.news2Score !== undefined && (
            <div className="clinical-card">
              <h3 className="text-lg font-medium mb-3">NEWS2 Score</h3>
              
              <div className="flex items-center">
                <div className={`news2-score-indicator ${
                  formData.news2RiskLevel === 'Low' ? 'news2-low' :
                  formData.news2RiskLevel === 'Medium' ? 'news2-medium' : 'news2-high'
                }`}>
                  {formData.news2Score}
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">{formData.news2RiskLevel} Risk</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.news2RiskLevel === 'Low' && 'Monitor 12 hourly or as indicated'}
                    {formData.news2RiskLevel === 'Medium' && 'Urgent assessment required'}
                    {formData.news2RiskLevel === 'High' && 'Immediate clinical assessment needed'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-nhs-blue hover:bg-nhs-dark-blue text-white rounded-md font-medium"
            >
              {isSaving ? 'Saving...' : editingVitalsId ? 'Update Vitals' : 'Save Vitals'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VitalsPage;
