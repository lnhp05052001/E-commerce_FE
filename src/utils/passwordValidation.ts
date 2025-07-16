import { PasswordValidationResult } from '../types/password.types';

export const validatePassword = (password: string): PasswordValidationResult => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Check minimum requirements
  if (!requirements.minLength) {
    return {
      isValid: false,
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
      strength: 'weak',
      requirements
    };
  }

  if (!requirements.hasUppercase) {
    return {
      isValid: false,
      message: 'Mật khẩu phải có ít nhất một chữ cái viết hoa',
      strength: 'weak',
      requirements
    };
  }

  if (!requirements.hasLowercase) {
    return {
      isValid: false,
      message: 'Mật khẩu phải có ít nhất một chữ cái viết thường',
      strength: 'weak',
      requirements
    };
  }

  if (!requirements.hasNumbers) {
    return {
      isValid: false,
      message: 'Mật khẩu phải có ít nhất một số',
      strength: 'weak',
      requirements
    };
  }

  // Calculate strength based on requirements met
  const requirementsMet = Object.values(requirements).filter(Boolean).length;
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (requirementsMet >= 5 && password.length >= 12) {
    strength = 'strong';
  } else if (requirementsMet >= 4 && password.length >= 8) {
    strength = 'medium';
  }

  return {
    isValid: true,
    message: 'Mật khẩu hợp lệ',
    strength,
    requirements
  };
};

export const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'strong': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export const getPasswordStrengthText = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'Yếu';
    case 'medium': return 'Trung bình';
    case 'strong': return 'Mạnh';
    default: return '';
  }
};

export const getPasswordStrengthWidth = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'w-1/3';
    case 'medium': return 'w-2/3';
    case 'strong': return 'w-full';
    default: return 'w-0';
  }
};

export const getPasswordStrengthBgColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'strong': return 'bg-green-500';
    default: return 'bg-gray-300';
  }
};
