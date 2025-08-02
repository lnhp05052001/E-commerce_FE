import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import PasswordInput from "../../shared/Input/PasswordInput";

export interface PageResetPasswordProps {
    className?: string;
}

interface ResetPasswordForm {
    password: string;
    confirmPassword: string;
}

// Password validation function
const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push("Mật khẩu phải có ít nhất 1 chữ thường");
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push("Mật khẩu phải có ít nhất 1 chữ hoa");
    }
    
    if (!/\d/.test(password)) {
        errors.push("Mật khẩu phải có ít nhất 1 số");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");
    }
    
    return errors.length > 0 ? errors.join(". ") : true;
};

const PageResetPassword: FC<PageResetPasswordProps> = ({ className = "" }) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordForm>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const token = searchParams.get('token');

    const password = watch('password');

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            toast.error("Token không hợp lệ");
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Mật khẩu đã được đặt lại thành công");
                navigate("/login");
            } else {
                toast.error(result.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Failed to reset password", error);
            toast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={`nc-PageResetPassword ${className}`} data-nc-id="PageResetPassword">
                <div className="container mb-24 lg:mb-32">
                    <div className="max-w-md mx-auto space-y-6 text-center">
                        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Token không hợp lệ
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300">
                            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                        </p>
                        <Link 
                            to="/forgot-password" 
                            className="inline-block text-green-600 hover:text-green-700"
                        >
                            Gửi lại yêu cầu đặt lại mật khẩu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`nc-PageResetPassword ${className}`} data-nc-id="PageResetPassword">
            <title>Đặt lại mật khẩu || fashionFactory React Template</title>
            <div className="container mb-24 lg:mb-32">
                <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
                    Đặt lại mật khẩu
                </h2>
                <div className="max-w-md mx-auto space-y-6">
                    {/* FORM */}
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Mật khẩu mới *
                            </span>
                            <PasswordInput
                                placeholder="Nhập mật khẩu mới"
                                className="mt-1"
                                showStrengthIndicator={true}
                                {...register("password", { 
                                    required: "Mật khẩu là bắt buộc",
                                    validate: validatePassword
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </label>

                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Xác nhận mật khẩu mới *
                            </span>
                            <PasswordInput
                                placeholder="Nhập lại mật khẩu mới"
                                className="mt-1"
                                {...register("confirmPassword", { 
                                    required: "Xác nhận mật khẩu là bắt buộc",
                                    validate: (value) => 
                                        value === password || "Mật khẩu xác nhận không khớp"
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </label>

                        <ButtonPrimary type="submit" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </ButtonPrimary>
                    </form>

                    {/* ==== */}
                    <span className="block text-center text-neutral-700 dark:text-neutral-300">
                        Nhớ mật khẩu? {` `}
                        <Link className="text-green-600" to="/login">
                            Đăng nhập
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PageResetPassword;
