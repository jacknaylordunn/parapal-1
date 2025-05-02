
import React from 'react';
import { Input } from '@/components/ui/input';
import { Check, AlertCircle } from 'lucide-react';

interface NHSNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Custom input component for NHS numbers with formatting and validation
 * NHS number format: XXX XXX XXXX (10 digits with spaces)
 */
export const NHSNumberInput: React.FC<NHSNumberInputProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  className = ""
}) => {
  // Format NHS number as user types (XXX XXX XXXX)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '');
    
    // Format with spaces (XXX XXX XXXX)
    let formatted = '';
    if (digitsOnly.length > 0) {
      formatted = digitsOnly.substring(0, 3);
      if (digitsOnly.length > 3) {
        formatted += ' ' + digitsOnly.substring(3, 6);
        if (digitsOnly.length > 6) {
          formatted += ' ' + digitsOnly.substring(6, 10);
        }
      }
    }
    
    // Truncate to 10 digits max
    const truncated = formatted.replace(/(\d{3} \d{3} \d{4}).+/, '$1');
    
    onChange(truncated);
  };
  
  // Validate NHS number using check digit algorithm
  const isValidNHSNumber = (nhsNumber: string): boolean => {
    // Extract only digits
    const digits = nhsNumber.replace(/\D/g, '');
    
    // NHS number must be 10 digits
    if (digits.length !== 10) return false;
    
    // Check digit validation (Modulus 11 algorithm)
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const checkDigit = 11 - remainder;
    
    // If check digit is 11, it's represented as 0
    const expectedCheckDigit = checkDigit === 11 ? 0 : checkDigit;
    
    return expectedCheckDigit === parseInt(digits[9]);
  };
  
  // Determine validation status for styling
  const isComplete = value.replace(/\D/g, '').length === 10;
  const isValid = isComplete && isValidNHSNumber(value);
  const isInvalid = isComplete && !isValid;
  
  return (
    <div className="space-y-2 relative">
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="NHS Number (XXX XXX XXXX)"
          className={`${className} pr-10 font-mono ${
            isValid ? 'border-green-500 dark:border-green-600 focus-visible:ring-green-500 dark:focus-visible:ring-green-600' : 
            isInvalid ? 'border-red-500 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-600' : 
            'border-input'
          }`}
          maxLength={12} // Allow for 10 digits plus 2 spaces
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? "nhs-number-error" : isValid ? "nhs-number-valid" : undefined}
        />
        
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400">
            <Check size={16} />
          </div>
        )}
        
        {isInvalid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 dark:text-red-400">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
      
      {isInvalid && (
        <p id="nhs-number-error" className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <AlertCircle size={12} />
          Invalid NHS number - please check and correct
        </p>
      )}
      
      {isValid && (
        <p id="nhs-number-valid" className="text-xs text-green-500 dark:text-green-400 flex items-center gap-1">
          <Check size={12} />
          Valid NHS number
        </p>
      )}
      
      {!isComplete && !isInvalid && value && (
        <p className="text-xs text-muted-foreground">
          NHS number should contain 10 digits
        </p>
      )}
    </div>
  );
};
