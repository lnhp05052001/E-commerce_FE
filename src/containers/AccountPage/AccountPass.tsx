import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Label from "../../components/Label/Label";
import { changePassword } from "../../features/auth/authSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch } from "../../store";
import { UpdatePasswordForm } from "../../types/password.types";
import { 
  validatePassword, 
  getPasswordStrengthColor, 
  getPasswordStrengthText,
  getPasswordStrengthWidth,
  getPasswordStrengthBgColor
} from "../../utils/passwordValidation";
import CommonLayout from "./CommonLayout";

const AccountPass: FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    watch, 
    reset,
    setError,
    clearErrors
  } = useForm<UpdatePasswordForm>();
  
  const dispatch: AppDispatch = useDispatch();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const newPassword = watch('newPassword');
  const passwordValidation = newPassword ? validatePassword(newPassword) : null;
  const onSubmit = async (data: UpdatePasswordForm): Promise<void> => {
    try {
      // Clear previous errors
      clearErrors();
      
      // Validate new password
      const validation = validatePassword(data.newPassword);
      if (!validation.isValid) {
        setError('newPassword', { 
          type: 'manual', 
          message: validation.message 
        });
        return;
      }

      // Check password confirmation
      if (data.newPassword !== data.confirmPassword) {
        setError('confirmPassword', { 
          type: 'manual', 
          message: 'Xác nhận mật khẩu không khớp' 
        });
        return;
      }

      // Check if new password is same as current
      if (data.currentPassword === data.newPassword) {
        setError('newPassword', { 
          type: 'manual', 
          message: 'Mật khẩu mới phải khác mật khẩu hiện tại' 
        });
        return;
      }

      setLoading(true);

      await dispatch(changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })).unwrap();

      toast.success("Đổi mật khẩu thành công");
      reset(); // Reset form after success
      
    } catch (error: any) {
      console.error("Change password error:", error);
      
      // Handle specific error messages
      if (error.includes('Mật khẩu cũ không đúng') || error.includes('Mật khẩu hiện tại không chính xác')) {
        setError('currentPassword', { 
          type: 'manual', 
          message: 'Mật khẩu hiện tại không chính xác' 
        });
      } else {
        toast.error(error || "Đổi mật khẩu thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">
            Cập nhật mật khẩu
          </h2>
          
          <div className="flex justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl w-full space-y-6">
            {/* Current Password */}
            <div>
              <Label>Mật khẩu hiện tại</Label>
              <div className="relative mt-1.5">
                <Input 
                  type={showCurrentPassword ? "text" : "password"} 
                  {...register("currentPassword", { 
                    required: "Mật khẩu hiện tại là bắt buộc" 
                  })} 
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? 
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : 
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  }
                </button>
              </div>
              {errors.currentPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.currentPassword.message}
                </span>
              )}
            </div>

            {/* New Password */}
            <div>
              <Label>Mật khẩu mới</Label>
              <div className="relative mt-1.5">
                <Input 
                  type={showNewPassword ? "text" : "password"} 
                  {...register("newPassword", { 
                    required: "Mật khẩu mới là bắt buộc",
                    validate: (value) => {
                      const validation = validatePassword(value);
                      return validation.isValid || validation.message;
                    }
                  })} 
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? 
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : 
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  }
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordValidation && (
                <div className="mt-2">
                  <div className={`text-sm ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                    Độ mạnh: {getPasswordStrengthText(passwordValidation.strength)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthWidth(passwordValidation.strength)} ${getPasswordStrengthBgColor(passwordValidation.strength)}`}
                    />
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-2 text-xs space-y-1">
                    <div className={passwordValidation.requirements.minLength ? 'text-green-600' : 'text-red-500'}>
                      ✓ Ít nhất 8 ký tự
                    </div>
                    <div className={passwordValidation.requirements.hasUppercase ? 'text-green-600' : 'text-red-500'}>
                      ✓ Ít nhất 1 chữ hoa
                    </div>
                    <div className={passwordValidation.requirements.hasLowercase ? 'text-green-600' : 'text-red-500'}>
                      ✓ Ít nhất 1 chữ thường
                    </div>
                    <div className={passwordValidation.requirements.hasNumbers ? 'text-green-600' : 'text-red-500'}>
                      ✓ Ít nhất 1 số
                    </div>
                  </div>
                </div>
              )}
              
              {errors.newPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Xác nhận mật khẩu</Label>
              <div className="relative mt-1.5">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...register("confirmPassword", { 
                    required: "Xác nhận mật khẩu là bắt buộc",
                    validate: (value) => 
                      value === watch('newPassword') || "Xác nhận mật khẩu không khớp"
                  })} 
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : 
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <ButtonPrimary 
                type="submit" 
                disabled={loading || isSubmitting}
                loading={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </ButtonPrimary>
            </div>
          </form>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPass;
