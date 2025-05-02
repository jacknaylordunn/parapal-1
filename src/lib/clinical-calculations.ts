
/**
 * Clinical calculation utilities for ParaPal
 * Contains functions for NEWS2 score, GCS, etc.
 */

/**
 * Calculate NEWS2 (National Early Warning Score 2)
 * According to Royal College of Physicians guidelines
 */
export function calculateNEWS2(
  respiratoryRate?: number,
  oxygenSaturation?: number, 
  systolicBP?: number,
  heartRate?: number,
  temperature?: number,
  consciousnessLevel?: string,
  isOnOxygen?: boolean
): { score: number; riskLevel: 'Low' | 'Medium' | 'High'; clinicalResponse: string } {
  // Default values
  let score = 0;
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let clinicalResponse = 'Routine monitoring';

  // Check if we have enough data to calculate a score
  const hasRequiredData = respiratoryRate !== undefined && 
    oxygenSaturation !== undefined &&
    systolicBP !== undefined &&
    heartRate !== undefined &&
    temperature !== undefined &&
    consciousnessLevel !== undefined;

  if (!hasRequiredData) {
    return { score: 0, riskLevel: 'Low', clinicalResponse: 'Insufficient data' };
  }

  // Respiratory Rate
  if (respiratoryRate !== undefined) {
    if (respiratoryRate <= 8) score += 3;
    else if (respiratoryRate >= 9 && respiratoryRate <= 11) score += 1;
    else if (respiratoryRate >= 12 && respiratoryRate <= 20) score += 0;
    else if (respiratoryRate >= 21 && respiratoryRate <= 24) score += 2;
    else if (respiratoryRate >= 25) score += 3;
  }

  // Oxygen Saturation
  // Scale 1 (for patients without hypercapnic respiratory failure)
  if (oxygenSaturation !== undefined) {
    if (oxygenSaturation <= 91) score += 3;
    else if (oxygenSaturation >= 92 && oxygenSaturation <= 93) score += 2;
    else if (oxygenSaturation >= 94 && oxygenSaturation <= 95) score += 1;
    else if (oxygenSaturation >= 96) score += 0;
  }

  // Supplemental Oxygen
  if (isOnOxygen) {
    score += 2;
  }

  // Systolic Blood Pressure
  if (systolicBP !== undefined) {
    if (systolicBP <= 90) score += 3;
    else if (systolicBP >= 91 && systolicBP <= 100) score += 2;
    else if (systolicBP >= 101 && systolicBP <= 110) score += 1;
    else if (systolicBP >= 111 && systolicBP <= 219) score += 0;
    else if (systolicBP >= 220) score += 3;
  }

  // Pulse Rate
  if (heartRate !== undefined) {
    if (heartRate <= 40) score += 3;
    else if (heartRate >= 41 && heartRate <= 50) score += 1;
    else if (heartRate >= 51 && heartRate <= 90) score += 0;
    else if (heartRate >= 91 && heartRate <= 110) score += 1;
    else if (heartRate >= 111 && heartRate <= 130) score += 2;
    else if (heartRate >= 131) score += 3;
  }

  // Temperature
  if (temperature !== undefined) {
    if (temperature <= 35.0) score += 3;
    else if (temperature >= 35.1 && temperature <= 36.0) score += 1;
    else if (temperature >= 36.1 && temperature <= 38.0) score += 0;
    else if (temperature >= 38.1 && temperature <= 39.0) score += 1;
    else if (temperature >= 39.1) score += 2;
  }

  // Consciousness Level (AVPU)
  if (consciousnessLevel === 'A') {
    score += 0; // Alert
  } else {
    score += 3; // V (Voice), P (Pain), or U (Unresponsive)
  }

  // Calculate risk level and clinical response
  if (score >= 7) {
    riskLevel = 'High';
    clinicalResponse = 'Urgent clinical review needed';
  } else if (score >= 5 || score === 3 /* for any individual parameter */) {
    riskLevel = 'Medium';
    clinicalResponse = 'Prompt clinical review needed';
  } else if (score >= 1) {
    riskLevel = 'Low';
    clinicalResponse = 'Routine monitoring';
  }

  return { score, riskLevel, clinicalResponse };
}

/**
 * Calculate total GCS (Glasgow Coma Scale) score
 * Range: 3-15 (3 being worst, 15 being normal)
 */
export function calculateGCS(eye?: number, verbal?: number, motor?: number): number | null {
  if (eye === undefined || verbal === undefined || motor === undefined) {
    return null;
  }
  
  return eye + verbal + motor;
}

/**
 * Map GCS score to AVPU scale for NEWS2 calculation
 * A: Alert (GCS 15)
 * V: Voice (GCS 13-14)
 * P: Pain (GCS 9-12)
 * U: Unresponsive (GCS ≤8)
 */
export function mapGCSToAVPU(gcsTotal?: number): 'A' | 'V' | 'P' | 'U' {
  if (!gcsTotal) return 'U';
  
  if (gcsTotal === 15) return 'A';
  if (gcsTotal >= 13) return 'V';
  if (gcsTotal >= 9) return 'P';
  return 'U';
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth Date of birth
 * @returns Age in years, or undefined if date is invalid
 */
export function calculateAgeFromDOB(dateOfBirth?: Date | string): number | undefined {
  if (!dateOfBirth) return undefined;
  
  try {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    
    // Check if date is valid
    if (isNaN(dob.getTime())) return undefined;
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // If birthday hasn't occurred yet this year, subtract one
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return undefined;
  }
}
