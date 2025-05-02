
/**
 * Clinical calculation utilities for ParaPal
 * All calculations based on UK JRCALC/NHS guidelines
 */

// NEWS2 Score calculation
// Based on Royal College of Physicians NEWS2 guidelines
export const calculateNEWS2 = (
  respiratoryRate?: number,
  oxygenSaturation?: number,
  isOnOxygen: boolean = false,
  systolicBP?: number,
  heartRate?: number,
  consciousness?: string, // A, V, P, or U (AVPU scale)
  temperature?: number
): { score: number; riskLevel: string } => {
  let score = 0;
  
  // Respiratory rate
  if (respiratoryRate !== undefined) {
    if (respiratoryRate <= 8) score += 3;
    else if (respiratoryRate >= 9 && respiratoryRate <= 11) score += 1;
    else if (respiratoryRate >= 12 && respiratoryRate <= 20) score += 0;
    else if (respiratoryRate >= 21 && respiratoryRate <= 24) score += 2;
    else if (respiratoryRate >= 25) score += 3;
  }

  // Oxygen saturation
  if (oxygenSaturation !== undefined) {
    if (oxygenSaturation <= 91) score += 3;
    else if (oxygenSaturation >= 92 && oxygenSaturation <= 93) score += 2;
    else if (oxygenSaturation >= 94 && oxygenSaturation <= 95) score += 1;
    else if (oxygenSaturation >= 96) score += 0;
  }

  // Supplemental oxygen
  if (isOnOxygen) score += 2;

  // Systolic blood pressure
  if (systolicBP !== undefined) {
    if (systolicBP <= 90) score += 3;
    else if (systolicBP >= 91 && systolicBP <= 100) score += 2;
    else if (systolicBP >= 101 && systolicBP <= 110) score += 1;
    else if (systolicBP >= 111 && systolicBP <= 219) score += 0;
    else if (systolicBP >= 220) score += 3;
  }

  // Pulse rate
  if (heartRate !== undefined) {
    if (heartRate <= 40) score += 3;
    else if (heartRate >= 41 && heartRate <= 50) score += 1;
    else if (heartRate >= 51 && heartRate <= 90) score += 0;
    else if (heartRate >= 91 && heartRate <= 110) score += 1;
    else if (heartRate >= 111 && heartRate <= 130) score += 2;
    else if (heartRate >= 131) score += 3;
  }

  // Consciousness (AVPU)
  if (consciousness) {
    if (consciousness === 'A') score += 0;
    else score += 3; // V, P, or U
  }

  // Temperature
  if (temperature !== undefined) {
    if (temperature <= 35.0) score += 3;
    else if (temperature >= 35.1 && temperature <= 36.0) score += 1;
    else if (temperature >= 36.1 && temperature <= 38.0) score += 0;
    else if (temperature >= 38.1 && temperature <= 39.0) score += 1;
    else if (temperature >= 39.1) score += 2;
  }

  // Determine risk level
  let riskLevel = 'Low';
  if (score >= 7) {
    riskLevel = 'High';
  } else if (score >= 5) {
    riskLevel = 'Medium';
  } else if (score >= 0) {
    riskLevel = 'Low';
  }

  return { score, riskLevel };
};

// Calculate GCS (Glasgow Coma Scale)
export const calculateGCS = (
  eyeResponse?: number,
  verbalResponse?: number,
  motorResponse?: number
): number | undefined => {
  if (eyeResponse === undefined || verbalResponse === undefined || motorResponse === undefined) {
    return undefined;
  }
  
  return eyeResponse + verbalResponse + motorResponse;
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: Date | undefined | null): number | undefined => {
  if (!dateOfBirth) return undefined;
  
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
};

// PLACEHOLDER: Paediatric drug dose calculation
export const calculatePaediatricDose = (
  drugName: string,
  weight: number,
  ageInYears?: number
): { dose: string; volume: string; concentration: string; notes: string } => {
  // This is a placeholder function
  // In a real implementation, this would contain accurate dosing based on JRCALC/BNFc
  return {
    dose: `${weight} kg × Standard dose factor`,
    volume: 'Calculate based on concentration',
    concentration: 'See JRCALC guidelines',
    notes: 'PLACEHOLDER: Actual dosing calculations require clinical validation'
  };
};
