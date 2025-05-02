
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const QriskCalculator = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-1" size={16} />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">QRISK3 Calculator</CardTitle>
          <CardDescription>Cardiovascular Disease Risk Assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              QRISK3 Calculator Coming Soon
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              This calculator requires extensive patient data and will be available in a future update.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBack} className="w-full">Return to Calculators</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QriskCalculator;
