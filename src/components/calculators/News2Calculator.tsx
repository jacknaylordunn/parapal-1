
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface VitalSign {
  label: string;
  value: number | string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const News2Calculator = () => {
  const navigate = useNavigate();
  const [totalScore, setTotalScore] = useState<number>(0);
  const [clinicalRisk, setClinicalRisk] = useState<string>('');
  const [responseRequired, setResponseRequired] = useState<string>('');
  
  // Initialize vital signs with their scoring options
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([
    {
      label: 'Respiration Rate (breaths/min)',
      value: '',
      options: [
        { value: '0', label: '12-20', score: 0 },
        { value: '1', label: '9-11', score: 1 },
        { value: '2', label: '21-24', score: 2 },
        { value: '3', label: '≤8 or ≥25', score: 3 }
      ]
    },
    {
      label: 'Oxygen Saturation (%)',
      value: '',
      options: [
        { value: '0', label: '≥96', score: 0 },
        { value: '1', label: '94-95', score: 1 },
        { value: '2', label: '92-93', score: 2 },
        { value: '3', label: '≤91', score: 3 }
      ]
    },
    {
      label: 'Oxygen Supplementation',
      value: '',
      options: [
        { value: '0', label: 'Air', score: 0 },
        { value: '2', label: 'Oxygen', score: 2 }
      ]
    },
    {
      label: 'Systolic Blood Pressure (mmHg)',
      value: '',
      options: [
        { value: '0', label: '111-219', score: 0 },
        { value: '1', label: '101-110', score: 1 },
        { value: '2', label: '91-100', score: 2 },
        { value: '3', label: '≤90 or ≥220', score: 3 }
      ]
    },
    {
      label: 'Pulse Rate (beats/min)',
      value: '',
      options: [
        { value: '0', label: '51-90', score: 0 },
        { value: '1', label: '41-50 or 91-110', score: 1 },
        { value: '2', label: '111-130', score: 2 },
        { value: '3', label: '≤40 or ≥131', score: 3 }
      ]
    },
    {
      label: 'Consciousness Level',
      value: '',
      options: [
        { value: '0', label: 'Alert (A)', score: 0 },
        { value: '3', label: 'CVPU (C, V, P or U)', score: 3 }
      ]
    },
    {
      label: 'Temperature (°C)',
      value: '',
      options: [
        { value: '0', label: '36.1-38.0', score: 0 },
        { value: '1', label: '35.1-36.0 or 38.1-39.0', score: 1 },
        { value: '2', label: '≥39.1', score: 2 },
        { value: '3', label: '≤35.0', score: 3 }
      ]
    }
  ]);

  // Calculate the total score when any vital sign changes
  useEffect(() => {
    const calculateScore = () => {
      let score = 0;
      vitalSigns.forEach(vs => {
        const selectedOption = vs.options.find(opt => opt.value === vs.value);
        if (selectedOption) {
          score += selectedOption.score;
        }
      });
      return score;
    };

    const newScore = calculateScore();
    setTotalScore(newScore);

    // Determine clinical risk and response
    if (newScore === 0) {
      setClinicalRisk('Low');
      setResponseRequired('Routine monitoring');
    } else if (newScore >= 1 && newScore <= 4) {
      setClinicalRisk('Low');
      setResponseRequired('Inform registered nurse who must assess patient');
    } else if ((newScore >= 5 && newScore <= 6) || newScore === 3) {
      setClinicalRisk('Medium');
      setResponseRequired('Urgent response from clinician or team with competencies in acute illness');
    } else if (newScore >= 7) {
      setClinicalRisk('High');
      setResponseRequired('Emergency response - urgent assessment by a team with critical care competencies');
    }
  }, [vitalSigns]);

  // Handle selection change
  const handleChange = (value: string, index: number) => {
    const updatedVitalSigns = [...vitalSigns];
    updatedVitalSigns[index].value = value;
    setVitalSigns(updatedVitalSigns);
  };

  // Reset all values
  const handleReset = () => {
    const resetVitalSigns = vitalSigns.map(vs => ({
      ...vs,
      value: ''
    }));
    setVitalSigns(resetVitalSigns);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Get color based on risk level
  const getRiskColor = () => {
    switch (clinicalRisk) {
      case 'Low': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-amber-600 dark:text-amber-400';
      case 'High': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-1" size={16} />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">NEWS2 Score Calculator</CardTitle>
          <CardDescription>National Early Warning Score 2</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {vitalSigns.map((vs, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`vital-${index}`}>{vs.label}</Label>
              <Select value={vs.value.toString()} onValueChange={(value) => handleChange(value, index)}>
                <SelectTrigger id={`vital-${index}`}>
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  {vs.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} (Score: {option.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-xl">Total Score</h3>
              <p className="text-3xl font-bold text-nhs-blue">{totalScore}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-gray-500 dark:text-gray-400">Clinical Risk</h4>
                  <p className={`text-lg font-bold ${getRiskColor()}`}>{clinicalRisk || 'Not determined'}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-gray-500 dark:text-gray-400">Response Required</h4>
                  <p className="text-sm">{responseRequired || 'Complete all parameters'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          <Button onClick={() => navigate(-1)}>Done</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default News2Calculator;
