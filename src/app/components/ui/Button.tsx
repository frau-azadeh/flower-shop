import clsx from "clsx";
import { Loader2 } from "lucide-react";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "danger" | "success";
type Size = "xs" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: Variant;
  icon?: ReactNode;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-outline-hover focus-visible:ring-primary",
  success:
    "bg-success text-white hover:bg-success-hover focus-visible:ring-success",
  danger:
    "bg-danger text-white hover:bg-danger-hover focus-visible:ring-danger",
};

const sizeClasses: Record<Size, string> = {
  xs: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = "md",
  variant = "primary",
  icon,
  disabled,
  loading = false,
  fullWidth = false,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2
          className={clsx(
            "animate-spin",
            size === "xs" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
          )}
          aria-hidden="true"
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default Button;
