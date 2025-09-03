import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../../src/utils/validation';

describe('isValidEmail', () => {
  it('should return true for valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user_name@example-domain.com',
      'a@b.co',
      'test.email.with+symbol@example.com',
      'user@subdomain.example.com'
    ];

    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it('should return false for invalid email addresses', () => {
    const invalidEmails = [
      '',
      'invalid-email',
      '@example.com',
      'user@',
      'user..name@example.com',
      'user@.com',
      'user name@example.com',
      'user@example.',
      '.user@example.com'
    ];

    invalidEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it('should handle edge cases correctly', () => {
    expect(isValidEmail('  test@example.com  ')).toBe(true); // trims whitespace
    expect(isValidEmail(null as any)).toBe(false); // null input
    expect(isValidEmail(undefined as any)).toBe(false); // undefined input
    expect(isValidEmail(123 as any)).toBe(false); // non-string input
  });
});