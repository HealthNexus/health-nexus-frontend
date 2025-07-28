// Tests for validation utilities
import { PharmacyValidator } from '../../utils/validation';

describe('Pharmacy Validation', () => {
  describe('validateQuantity', () => {
    it('should validate valid quantities', () => {
      const result = PharmacyValidator.validateQuantity(5, 1, 10);
      expect(result.isValid).to.be.true;
      expect(result.error).to.equal('');
    });

    it('should reject quantities below minimum', () => {
      const result = PharmacyValidator.validateQuantity(0, 1, 10);
      expect(result.isValid).to.be.false;
      expect(result.error).to.contain('Minimum quantity is 1');
    });

    it('should reject quantities above maximum', () => {
      const result = PharmacyValidator.validateQuantity(15, 1, 10);
      expect(result.isValid).to.be.false;
      expect(result.error).to.contain('Maximum quantity is 10');
    });

    it('should reject non-integer quantities', () => {
      const result = PharmacyValidator.validateQuantity(5.5, 1, 10);
      expect(result.isValid).to.be.false;
      expect(result.error).to.contain('whole number');
    });

    it('should reject invalid number types', () => {
      const result = PharmacyValidator.validateQuantity(NaN, 1, 10);
      expect(result.isValid).to.be.false;
      expect(result.error).to.contain('valid number');
    });

    it('should handle boundary values correctly', () => {
      // Test minimum boundary
      let result = PharmacyValidator.validateQuantity(1, 1, 10);
      expect(result.isValid).to.be.true;

      // Test maximum boundary
      result = PharmacyValidator.validateQuantity(10, 1, 10);
      expect(result.isValid).to.be.true;
    });
  });

  describe('required validation rule', () => {
    it('should validate non-empty strings', () => {
      const rule = PharmacyValidator.required();
      expect(rule.validator('test')).to.be.true;
    });

    it('should reject empty strings', () => {
      const rule = PharmacyValidator.required();
      expect(rule.validator('')).to.be.false;
      expect(rule.validator('   ')).to.be.false; // whitespace only
    });

    it('should reject null and undefined', () => {
      const rule = PharmacyValidator.required();
      expect(rule.validator(null)).to.be.false;
      expect(rule.validator(undefined)).to.be.false;
    });

    it('should validate non-empty arrays', () => {
      const rule = PharmacyValidator.required();
      expect(rule.validator(['item'])).to.be.true;
      expect(rule.validator([])).to.be.false;
    });
  });

  describe('email validation rule', () => {
    it('should validate correct email formats', () => {
      const rule = PharmacyValidator.email();
      expect(rule.validator('test@example.com')).to.be.true;
      expect(rule.validator('user.name+tag@domain.co.uk')).to.be.true;
    });

    it('should reject invalid email formats', () => {
      const rule = PharmacyValidator.email();
      expect(rule.validator('invalid-email')).to.be.false;
      expect(rule.validator('@domain.com')).to.be.false;
      expect(rule.validator('test@')).to.be.false;
      expect(rule.validator('test.domain.com')).to.be.false;
    });

    it('should accept empty values (optional validation)', () => {
      const rule = PharmacyValidator.email();
      expect(rule.validator('')).to.be.true;
      expect(rule.validator(null)).to.be.true;
    });
  });

  describe('phone validation rule', () => {
    it('should validate correct phone formats', () => {
      const rule = PharmacyValidator.phone();
      expect(rule.validator('+1234567890')).to.be.true;
      expect(rule.validator('1234567890')).to.be.true;
      expect(rule.validator('+1 (234) 567-8900')).to.be.true;
    });

    it('should reject invalid phone formats', () => {
      const rule = PharmacyValidator.phone();
      expect(rule.validator('123')).to.be.false; // too short
      expect(rule.validator('abc1234567890')).to.be.false; // contains letters
      expect(rule.validator('+1234567890123456789')).to.be.false; // too long
    });

    it('should accept empty values (optional validation)', () => {
      const rule = PharmacyValidator.phone();
      expect(rule.validator('')).to.be.true;
    });
  });

  describe('quantity validation rule', () => {
    it('should validate quantities within range', () => {
      const rule = PharmacyValidator.quantity(1, 10);
      expect(rule.validator(5)).to.be.true;
      expect(rule.validator(1)).to.be.true;
      expect(rule.validator(10)).to.be.true;
    });

    it('should reject quantities outside range', () => {
      const rule = PharmacyValidator.quantity(1, 10);
      expect(rule.validator(0)).to.be.false;
      expect(rule.validator(11)).to.be.false;
      expect(rule.validator(-5)).to.be.false;
    });

    it('should reject non-numeric values', () => {
      const rule = PharmacyValidator.quantity(1, 10);
      expect(rule.validator('abc')).to.be.false;
      expect(rule.validator(null)).to.be.false;
    });
  });

  describe('stock validation rule', () => {
    it('should validate quantities against available stock', () => {
      const rule = PharmacyValidator.stock(50);
      expect(rule.validator(25)).to.be.true;
      expect(rule.validator(50)).to.be.true;
      expect(rule.validator(1)).to.be.true;
    });

    it('should reject quantities exceeding stock', () => {
      const rule = PharmacyValidator.stock(50);
      expect(rule.validator(51)).to.be.false;
      expect(rule.validator(100)).to.be.false;
    });

    it('should handle zero stock', () => {
      const rule = PharmacyValidator.stock(0);
      expect(rule.validator(1)).to.be.false;
      expect(rule.validator(0)).to.be.true;
    });
  });

  describe('address validation rule', () => {
    it('should validate complete addresses', () => {
      const rule = PharmacyValidator.address();
      expect(rule.validator('123 Main Street, City, State 12345')).to.be.true;
      expect(rule.validator('456 Oak Ave, Apt 2B, Somewhere, ST 54321')).to.be.true;
    });

    it('should reject incomplete addresses', () => {
      const rule = PharmacyValidator.address();
      expect(rule.validator('123')).to.be.false; // too short
      expect(rule.validator('')).to.be.false;
      expect(rule.validator('   ')).to.be.false;
    });
  });

  describe('fullName validation rule', () => {
    it('should validate complete names', () => {
      const rule = PharmacyValidator.fullName();
      expect(rule.validator('John Doe')).to.be.true;
      expect(rule.validator('Mary Jane Smith')).to.be.true;
      expect(rule.validator('Jean-Paul Pierre')).to.be.true;
    });

    it('should reject incomplete names', () => {
      const rule = PharmacyValidator.fullName();
      expect(rule.validator('John')).to.be.false; // single name
      expect(rule.validator('J')).to.be.false; // too short
      expect(rule.validator('')).to.be.false;
    });
  });

  describe('validateField helper', () => {
    it('should validate field with multiple rules', () => {
      const rules = [
        PharmacyValidator.required('Field is required'),
        PharmacyValidator.email('Invalid email')
      ];

      // Valid email
      let result = PharmacyValidator.validateField('test@example.com', rules);
      expect(result.isValid).to.be.true;
      expect(result.errors).to.be.empty;

      // Invalid email
      result = PharmacyValidator.validateField('invalid-email', rules);
      expect(result.isValid).to.be.false;
      expect(result.errors).to.include('Invalid email');

      // Empty field
      result = PharmacyValidator.validateField('', rules);
      expect(result.isValid).to.be.false;
      expect(result.errors).to.include('Field is required');
    });
  });

  describe('validateForm helper', () => {
    it('should validate entire form', () => {
      const formData = {
        email: 'test@example.com',
        phone: '+1234567890',
        quantity: 5
      };

      const rules = {
        email: [PharmacyValidator.email()],
        phone: [PharmacyValidator.phone()],
        quantity: [PharmacyValidator.quantity(1, 10)]
      };

      const results = PharmacyValidator.validateForm(formData, rules);
      
      expect(results.email.isValid).to.be.true;
      expect(results.phone.isValid).to.be.true;
      expect(results.quantity.isValid).to.be.true;
      expect(PharmacyValidator.isFormValid(results)).to.be.true;
    });

    it('should identify form validation errors', () => {
      const formData = {
        email: 'invalid-email',
        phone: '123',
        quantity: 15
      };

      const rules = {
        email: [PharmacyValidator.email()],
        phone: [PharmacyValidator.phone()],
        quantity: [PharmacyValidator.quantity(1, 10)]
      };

      const results = PharmacyValidator.validateForm(formData, rules);
      
      expect(results.email.isValid).to.be.false;
      expect(results.phone.isValid).to.be.false;
      expect(results.quantity.isValid).to.be.false;
      expect(PharmacyValidator.isFormValid(results)).to.be.false;

      const errors = PharmacyValidator.getFormErrors(results);
      expect(errors).to.have.length(3);
    });
  });
});
