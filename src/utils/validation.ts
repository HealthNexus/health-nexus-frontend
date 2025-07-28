// Validation utility library for E-Pharmacy application
export interface ValidationRule {
  validator: (value: unknown) => boolean | string;
  message: string;
  trigger?: 'blur' | 'change' | 'input';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PharmacyValidator {
  // Required field validation
  static required(message = 'This field is required'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      },
      message,
      trigger: 'blur'
    };
  }

  // Email validation
  static email(message = 'Please enter a valid email address'): ValidationRule {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true;
        return emailRegex.test(value.trim());
      },
      message,
      trigger: 'blur'
    };
  }

  // Phone number validation (international format)
  static phone(message = 'Please enter a valid phone number'): ValidationRule {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true;
        const cleaned = value.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleaned) && cleaned.length >= 10;
      },
      message,
      trigger: 'blur'
    };
  }

  // Credit card validation (Luhn algorithm)
  static creditCard(message = 'Please enter a valid credit card number'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true;
        const cleaned = value.replace(/\s/g, '');
        
        // Luhn algorithm
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
          let digit = parseInt(cleaned.charAt(i), 10);
          
          if (isEven) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }
          
          sum += digit;
          isEven = !isEven;
        }
        
        return sum % 10 === 0 && cleaned.length >= 13 && cleaned.length <= 19;
      },
      message,
      trigger: 'blur'
    };
  }

  // CVV validation
  static cvv(message = 'Please enter a valid CVV'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true;
        const cleaned = value.replace(/\s/g, '');
        return /^\d{3,4}$/.test(cleaned);
      },
      message,
      trigger: 'blur'
    };
  }

  // Expiry date validation (MM/YY format)
  static expiryDate(message = 'Please enter a valid expiry date (MM/YY)'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true;
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(value)) return false;
        
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const cardYear = parseInt(year, 10);
        const cardMonth = parseInt(month, 10);
        
        if (cardYear < currentYear) return false;
        if (cardYear === currentYear && cardMonth < currentMonth) return false;
        
        return true;
      },
      message,
      trigger: 'blur'
    };
  }

  // Quantity validation
  static quantity(min = 1, max = 999, message?: string): ValidationRule {
    return {
      validator: (value: unknown) => {
        const num = typeof value === 'number' ? value : Number(value);
        if (isNaN(num)) return false;
        return num >= min && num <= max;
      },
      message: message || `Quantity must be between ${min} and ${max}`,
      trigger: 'change'
    };
  }

  // Stock validation
  static stock(availableStock: number, message?: string): ValidationRule {
    return {
      validator: (value: unknown) => {
        const num = typeof value === 'number' ? value : Number(value);
        if (isNaN(num)) return false;
        return num <= availableStock;
      },
      message: message || `Only ${availableStock} item(s) available in stock`,
      trigger: 'change'
    };
  }

  // Minimum length validation
  static minLength(min: number, message?: string): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true;
        return value.trim().length >= min;
      },
      message: message || `Minimum ${min} characters required`,
      trigger: 'blur'
    };
  }

  // Maximum length validation
  static maxLength(max: number, message?: string): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true;
        return value.trim().length <= max;
      },
      message: message || `Maximum ${max} characters allowed`,
      trigger: 'input'
    };
  }

  // Address validation
  static address(message = 'Please enter a complete address'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return false;
        const trimmed = value.trim();
        // Basic address validation: should contain at least one number and be longer than 10 chars
        return trimmed.length >= 10 && /\d/.test(trimmed);
      },
      message,
      trigger: 'blur'
    };
  }

  // Name validation
  static fullName(message = 'Please enter a valid name'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return false;
        const trimmed = value.trim();
        // Name should be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes
        return trimmed.length >= 2 && /^[a-zA-Z\s\-']+$/.test(trimmed);
      },
      message,
      trigger: 'blur'
    };
  }

  // ZIP code validation
  static zipCode(message = 'Please enter a valid ZIP code'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return false;
        const cleaned = value.replace(/\s/g, '');
        // Support US ZIP codes (5 digits or 5+4 format)
        return /^\d{5}(-\d{4})?$/.test(cleaned);
      },
      message,
      trigger: 'blur'
    };
  }

  // Postal code validation (flexible for different formats)
  static postalCode(message = 'Please enter a valid postal code'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return false;
        const cleaned = value.replace(/\s/g, '');
        // Support various postal code formats (US ZIP, UK postcode, etc.)
        return /^[A-Z0-9]{3,10}$/i.test(cleaned);
      },
      message,
      trigger: 'blur'
    };
  }

  // Password strength validation
  static password(message = 'Password must be at least 8 characters with uppercase, lowercase, and number'): ValidationRule {
    return {
      validator: (value: unknown) => {
        if (typeof value !== 'string' || !value) return false;
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasMinLength = value.length >= 8;
        return hasUppercase && hasLowercase && hasNumber && hasMinLength;
      },
      message,
      trigger: 'blur'
    };
  }

  // Helper method for direct quantity validation (returns result object)
  static validateQuantity(value: number, min = 1, max = 999): { isValid: boolean; error: string } {
    if (typeof value !== 'number' || isNaN(value)) {
      return { isValid: false, error: 'Please enter a valid number' };
    }
    
    if (value < min) {
      return { isValid: false, error: `Minimum quantity is ${min}` };
    }
    
    if (value > max) {
      return { isValid: false, error: `Maximum quantity is ${max}` };
    }
    
    if (value % 1 !== 0) {
      return { isValid: false, error: 'Quantity must be a whole number' };
    }
    
    return { isValid: true, error: '' };
  }

  // Validate multiple rules
  static validateField(value: unknown, rules: ValidationRule[]): ValidationResult {
    const errors: string[] = [];
    
    for (const rule of rules) {
      const result = rule.validator(value);
      if (result === false || (typeof result === 'string' && result.length > 0)) {
        errors.push(typeof result === 'string' ? result : rule.message);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate entire form object
  static validateForm(data: Record<string, unknown>, rules: Record<string, ValidationRule[]>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};
    
    for (const [field, fieldRules] of Object.entries(rules)) {
      results[field] = this.validateField(data[field], fieldRules);
    }
    
    return results;
  }

  // Check if form is valid
  static isFormValid(validationResults: Record<string, ValidationResult>): boolean {
    return Object.values(validationResults).every(result => result.isValid);
  }

  // Get all form errors
  static getFormErrors(validationResults: Record<string, ValidationResult>): string[] {
    const errors: string[] = [];
    for (const result of Object.values(validationResults)) {
      errors.push(...result.errors);
    }
    return errors;
  }
}

// Error types for better type safety
interface ApiErrorResponse {
  status?: number;
  data?: {
    message?: string;
  };
}

interface ApiError {
  code?: string;
  message?: string;
  response?: ApiErrorResponse;
}

// Error handling utilities
export class ErrorHandler {
  // Handle API errors
  static handleApiError(error: unknown): string {
    if (!error) return 'An unknown error occurred';
    
    const apiError = error as ApiError;
    
    // Network errors
    if (apiError.code === 'NETWORK_ERROR' || !navigator.onLine) {
      return 'Network connection problem. Please check your internet connection and try again.';
    }
    
    // HTTP status codes
    if (apiError.response?.status) {
      switch (apiError.response.status) {
        case 400:
          return apiError.response.data?.message || 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Authentication required. Please log in and try again.';
        case 403:
          return 'Access denied. You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'Conflict with current state. Please refresh and try again.';
        case 422:
          return apiError.response.data?.message || 'Validation error. Please check your input.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error. Please try again later.';
        case 502:
        case 503:
        case 504:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return `Server error (${apiError.response.status}). Please try again later.`;
      }
    }
    
    // Timeout errors
    if (apiError.code === 'ECONNABORTED' || apiError.message?.includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.';
    }
    
    // Generic error fallback
    return apiError.message || 'An unexpected error occurred. Please try again.';
  }

  // Form validation error handling
  showFormErrors(errors: string[], quasar: { notify: (options: unknown) => void }): void {
    const errorMessage = errors.length === 1 
      ? errors[0]
      : `Please fix the following errors:\n• ${errors.join('\n• ')}`;
    
    quasar.notify({
      type: 'negative',
      message: errorMessage,
      position: 'center',
      timeout: 5000,
      multiLine: true,
      icon: 'error',
      actions: [
        { icon: 'close', color: 'white', round: true }
      ]
    });
  }

  showValidationSuccess(message: string, quasar: { notify: (options: unknown) => void }): void {
    quasar.notify({
      type: 'positive',
      message: message,
      position: 'bottom-right',
      timeout: 2000,
      icon: 'check_circle'
    });
  }

  // API error handling with user feedback
  handleAPIError(error: unknown): { message: string; shouldRetry: boolean } {
    const message = ErrorHandler.handleApiError(error);
    const apiError = error as ApiError;
    
    // Determine if retry is appropriate
    const shouldRetry = !apiError.response?.status || 
      apiError.response.status >= 500 || 
      apiError.response.status === 429 ||
      apiError.response.status === 408;
    
    return { message, shouldRetry };
  }

  // Retry mechanism
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: unknown;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        const apiError = error as ApiError;
        
        // Don't retry on client errors (4xx) except 408, 429
        if (apiError.response?.status && apiError.response.status >= 400 && apiError.response.status < 500) {
          if (apiError.response.status !== 408 && apiError.response.status !== 429) {
            throw error;
          }
        }
        
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  }

  // Debounce function for input validation
  static debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}

// Form field state management
export interface FieldState {
  value: unknown;
  errors: string[];
  touched: boolean;
  validating: boolean;
}

export class FormStateManager {
  private fields: Map<string, FieldState> = new Map();
  private rules: Map<string, ValidationRule[]> = new Map();

  // Initialize field
  setField(name: string, initialValue: unknown = '', rules: ValidationRule[] = []): void {
    this.fields.set(name, {
      value: initialValue,
      errors: [],
      touched: false,
      validating: false
    });
    this.rules.set(name, rules);
  }

  // Update field value
  updateField(name: string, value: unknown): void {
    const field = this.fields.get(name);
    if (field) {
      field.value = value;
      field.touched = true;
      this.validateField(name);
    }
  }

  // Validate single field
  validateField(name: string): boolean {
    const field = this.fields.get(name);
    const rules = this.rules.get(name);
    
    if (!field || !rules) return true;
    
    const result = PharmacyValidator.validateField(field.value, rules);
    field.errors = result.errors;
    
    return result.isValid;
  }

  // Validate all fields
  validateAll(): boolean {
    let isValid = true;
    
    for (const [name] of this.fields) {
      if (!this.validateField(name)) {
        isValid = false;
      }
    }
    
    return isValid;
  }

  // Get field state
  getField(name: string): FieldState | undefined {
    return this.fields.get(name);
  }

  // Get all fields
  getAllFields(): Map<string, FieldState> {
    return new Map(this.fields);
  }

  // Reset form
  reset(): void {
    for (const [, field] of this.fields) {
      field.value = '';
      field.errors = [];
      field.touched = false;
      field.validating = false;
    }
  }

  // Get form data
  getData(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    for (const [name, field] of this.fields) {
      data[name] = field.value;
    }
    return data;
  }
}

export default PharmacyValidator;
