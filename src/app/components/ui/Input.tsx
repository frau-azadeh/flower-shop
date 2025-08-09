import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import React, { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | FieldError | null;
  helperText?: string;
  icon?: ReactNode;
  togglePassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, type = "text", togglePassword = false, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = togglePassword && type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className={clsx("text-sm font-medium", error ? "text-red-600" : "text-gray-700")}>
            {label}
          </label>
        )}

        <div className="relative">
          {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}

          <input
            ref={ref}
            type={inputType}
            {...props}
            className={clsx(
              "w-full rounded-lg border text-sm px-3 py-2 focus:outline-none focus:ring-2 transition-colors",
              icon && "pr-10",
              isPassword && "pr-10",
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
              className
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
        {error && <p className="text-xs text-red-600">{typeof error === "string" ? error : error?.message}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
