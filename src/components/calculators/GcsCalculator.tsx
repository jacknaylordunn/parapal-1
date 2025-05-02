
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const GcsCalculator = () => {
  const navigate = useNavigate();
  const [eyeScore, setEyeScore] = useState<string>('');
  const [verbalScore, setVerbalScore] = useState<string>('');
  const [motorScore, setMotorScore] = useState<string>('');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [interpretation, setInterpretation] = useState<string>('');
  
  // Calculate total score and interpretation when any component changes
  useEffect(() => {
    const eye = parseInt(eyeScore) || 0;
    const verbal = parseInt(verbalScore) || 0;
    const motor = parseInt(motorScore) || 0;
    const total = eye + verbal + motor;
    
    setTotalScore(total);
    
    if (total === 0) {
      setInterpretation('Complete all parameters');
    } else if (total >= 13 && total <= 15) {
      setInterpretation('Minor brain injury (GCS 13-15)');
    } else if (total >= 9 && total <= 12) {
      setInterpretation('Moderate brain injury (GCS 9-12)');
    } else if (total >= 3 && total <= 8) {
      setInterpretation('Severe brain injury (GCS 3-8)');
    }
  }, [eyeScore, verbalScore, motorScore]);
  
  const handleReset = () => {
    setEyeScore('');
    setVerbalScore('');
    setMotorScore('');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // Get color based on score
  const getScoreColor = () => {
    if (totalScore >= 13) return 'text-green-600 dark:text-green-400';
    if (totalScore >= 9) return 'text-amber-600 dark:text-amber-400';
    if (totalScore >= 3) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };
  
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-1" size={16} />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Glasgow Coma Scale (GCS)</CardTitle>
          <CardDescription>Assessment of consciousness level in patients with brain injury</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Eye Opening Response */}
          <div className="space-y-2">
            <Label htmlFor="eye-response">Eye Opening Response</Label>
            <Select value={eyeScore} onValueChange={setEyeScore}>
              <SelectTrigger id="eye-response">
                <SelectValue placeholder="Select response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 - Spontaneous</SelectItem>
                <SelectItem value="3">3 - To verbal command</SelectItem>
                <SelectItem value="2">2 - To painful stimulus</SelectItem>
                <SelectItem value="1">1 - No response</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Verbal Response */}
          <div className="space-y-2">
            <Label htmlFor="verbal-response">Verbal Response</Label>
            <Select value={verbalScore} onValueChange={setVerbalScore}>
              <SelectTrigger id="verbal-response">
                <SelectValue placeholder="Select response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 - Oriented, converses normally</SelectItem>
                <SelectItem value="4">4 - Confused, disoriented</SelectItem>
                <SelectItem value="3">3 - Inappropriate words</SelectItem>
                <SelectItem value="2">2 - Incomprehensible sounds</SelectItem>
                <SelectItem value="1">1 - No response</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Motor Response */}
          <div className="space-y-2">
            <Label htmlFor="motor-response">Motor Response</Label>
            <Select value={motorScore} onValueChange={setMotorScore}>
              <SelectTrigger id="motor-response">
                <SelectValue placeholder="Select response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 - Obeys commands fully</SelectItem>
                <SelectItem value="5">5 - Localizes to noxious stimuli</SelectItem>
                <SelectItem value="4">4 - Withdraws from noxious stimuli</SelectItem>
                <SelectItem value="3">3 - Abnormal flexion</SelectItem>
                <SelectItem value="2">2 - Abnormal extension</SelectItem>
                <SelectItem value="1">1 - No response</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-xl">Total GCS Score</h3>
              <p className={`text-3xl font-bold ${getScoreColor()}`}>{totalScore || '0'}/15</p>
              
              <div className="p-3 border rounded-md mt-4">
                <h4 className="font-medium text-gray-500 dark:text-gray-400">Interpretation</h4>
                <p className="font-semibold">{interpretation}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="p-2 border rounded-md">
                  <h5 className="text-xs text-gray-500 dark:text-gray-400">Eyes (E)</h5>
                  <p className="font-bold">{eyeScore || '-'}</p>
                </div>
                <div className="p-2 border rounded-md">
                  <h5 className="text-xs text-gray-500 dark:text-gray-400">Verbal (V)</h5>
                  <p className="font-bold">{verbalScore || '-'}</p>
                </div>
                <div className="p-2 border rounded-md">
                  <h5 className="text-xs text-gray-500 dark:text-gray-400">Motor (M)</h5>
                  <p className="font-bold">{motorScore || '-'}</p>
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

export default GcsCalculator;
