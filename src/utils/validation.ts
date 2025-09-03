/**
 * Validates email format using a comprehensive regex pattern
 * @param email - The email string to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim();
  
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // Additional validation rules
  const [localPart, domain] = trimmedEmail.split('@');
  
  // Check for consecutive dots in local part
  if (localPart.includes('..')) {
    return false;
  }
  
  // Check for leading or trailing dots in local part
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  
  return true;
}

/**
 * Validates that a string is not empty after trimming whitespace
 * @param value - The string to validate
 * @returns boolean indicating if string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates minimum length requirement for a string
 * @param value - The string to validate
 * @param minLength - Minimum required length
 * @returns boolean indicating if string meets minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return typeof value === 'string' && value.trim().length >= minLength;
}