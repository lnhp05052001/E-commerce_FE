// TypeScript interfaces for password functionality

export interface UpdatePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
  strength: 'weak' | 'medium' | 'strong';
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
  };
}

export interface PasswordUpdateRequest {
  oldPassword: string;
  newPassword: string;
}

export interface PasswordUpdateResponse {
  status: 'success' | 'error';
  message: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
}
