import React, { InputHTMLAttributes, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  showStrengthIndicator?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className = "",
      sizeClass = "h-11 px-4 py-3 pr-12",
      fontClass = "text-sm font-normal",
      rounded = "rounded-2xl",
      showStrengthIndicator = false,
      value,
      onChange,
      ...args
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Password strength calculation
    const getPasswordStrength = (password: string) => {
      if (!password) return { score: 0, text: "", color: "" };
      
      let score = 0;
      const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };

      score = Object.values(checks).filter(Boolean).length;

      const strengthLevels = [
        { score: 0, text: "", color: "" },
        { score: 1, text: "Rất yếu", color: "text-red-500" },
        { score: 2, text: "Yếu", color: "text-orange-500" },
        { score: 3, text: "Trung bình", color: "text-yellow-500" },
        { score: 4, text: "Mạnh", color: "text-blue-500" },
        { score: 5, text: "Rất mạnh", color: "text-green-500" },
      ];

      return strengthLevels[score] || strengthLevels[0];
    };

    const passwordStrength = showStrengthIndicator ? getPasswordStrength(value as string || "") : null;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${rounded} ${fontClass} ${sizeClass} ${className}`}
          {...args}
        />
        
        {/* Eye icon toggle */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>

        {/* Password strength indicator */}
        {showStrengthIndicator && value && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Độ mạnh mật khẩu:
              </span>
              <span className={`text-xs font-medium ${passwordStrength?.color}`}>
                {passwordStrength?.text}
              </span>
            </div>
            
            {/* Strength bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  passwordStrength?.score === 1 ? 'bg-red-500 w-1/5' :
                  passwordStrength?.score === 2 ? 'bg-orange-500 w-2/5' :
                  passwordStrength?.score === 3 ? 'bg-yellow-500 w-3/5' :
                  passwordStrength?.score === 4 ? 'bg-blue-500 w-4/5' :
                  passwordStrength?.score === 5 ? 'bg-green-500 w-full' :
                  'w-0'
                }`}
              />
            </div>

            {/* Requirements checklist */}
            <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="grid grid-cols-1 gap-1">
                <div className={`flex items-center ${(value as string)?.length >= 8 ? 'text-green-600' : 'text-neutral-400'}`}>
                  <span className="mr-1">{(value as string)?.length >= 8 ? '✓' : '○'}</span>
                  Ít nhất 8 ký tự
                </div>
                <div className={`flex items-center ${/[a-z]/.test(value as string || '') ? 'text-green-600' : 'text-neutral-400'}`}>
                  <span className="mr-1">{/[a-z]/.test(value as string || '') ? '✓' : '○'}</span>
                  Chữ thường (a-z)
                </div>
                <div className={`flex items-center ${/[A-Z]/.test(value as string || '') ? 'text-green-600' : 'text-neutral-400'}`}>
                  <span className="mr-1">{/[A-Z]/.test(value as string || '') ? '✓' : '○'}</span>
                  Chữ hoa (A-Z)
                </div>
                <div className={`flex items-center ${/\d/.test(value as string || '') ? 'text-green-600' : 'text-neutral-400'}`}>
                  <span className="mr-1">{/\d/.test(value as string || '') ? '✓' : '○'}</span>
                  Số (0-9)
                </div>
                <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(value as string || '') ? 'text-green-600' : 'text-neutral-400'}`}>
                  <span className="mr-1">{/[!@#$%^&*(),.?":{}|<>]/.test(value as string || '') ? '✓' : '○'}</span>
                  Ký tự đặc biệt (!@#$%...)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
