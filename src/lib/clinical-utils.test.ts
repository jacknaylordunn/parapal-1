
import { describe, it, expect } from 'vitest';
import { calculateNEWS2, calculateGCS, calculateAge } from './clinical-utils';

describe('calculateNEWS2', () => {
  it('should calculate a low risk score correctly', () => {
    const result = calculateNEWS2(
      14, // RR
      97, // SpO2
      false, // not on oxygen
      120, // Systolic BP
      70, // HR
      'A', // Alert
      37 // Temp
    );
    
    expect(result.score).toBe(0);
    expect(result.riskLevel).toBe('Low');
  });
  
  it('should calculate a medium risk score correctly', () => {
    const result = calculateNEWS2(
      22, // RR - score 2
      93, // SpO2 - score 2
      true, // on oxygen - score 2
      112, // Systolic BP - score 0
      95, // HR - score 1
      'A', // Alert - score 0
      38.2 // Temp - score 1
    );
    
    expect(result.score).toBe(8);
    expect(result.riskLevel).toBe('High');
  });
  
  it('should handle missing values', () => {
    const result = calculateNEWS2(
      14, // RR
      97, // SpO2
      false, // not on oxygen
      undefined, // missing BP
      undefined, // missing HR
      undefined, // missing consciousness
      undefined // missing Temp
    );
    
    expect(result.score).toBe(0);
    expect(result.riskLevel).toBe('Low');
  });
});

describe('calculateGCS', () => {
  it('should calculate total GCS correctly', () => {
    expect(calculateGCS(4, 5, 6)).toBe(15); // E4V5M6 = 15
    expect(calculateGCS(3, 4, 5)).toBe(12); // E3V4M5 = 12
    expect(calculateGCS(1, 1, 3)).toBe(5);  // E1V1M3 = 5
  });
  
  it('should return undefined if any component is missing', () => {
    expect(calculateGCS(4, 5, undefined)).toBe(undefined);
    expect(calculateGCS(undefined, 4, 5)).toBe(undefined);
    expect(calculateGCS(3, undefined, 5)).toBe(undefined);
  });
});

describe('calculateAge', () => {
  it('should calculate age correctly', () => {
    const today = new Date();
    
    // Test with a birthdate exactly 30 years ago
    const date30YearsAgo = new Date(today);
    date30YearsAgo.setFullYear(today.getFullYear() - 30);
    expect(calculateAge(date30YearsAgo)).toBe(30);
    
    // Test with a birthdate where the birthday hasn't occurred yet this year
    const dateWithUpcomingBirthday = new Date(today);
    dateWithUpcomingBirthday.setFullYear(today.getFullYear() - 25);
    if (today.getMonth() === 0) { // If current month is January
      dateWithUpcomingBirthday.setMonth(11); // Set to December
    } else {
      dateWithUpcomingBirthday.setMonth(today.getMonth() - 1); // Set to previous month
    }
    expect(calculateAge(dateWithUpcomingBirthday)).toBe(24);
  });
  
  it('should handle null or undefined dates', () => {
    expect(calculateAge(null)).toBe(undefined);
    expect(calculateAge(undefined)).toBe(undefined);
  });
});
