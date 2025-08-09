import clsx from "clsx";
import { Loader2 } from "lucide-react";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline" | "danger" | "success" | "ghost";
  icon?: ReactNode;
  size?: "xs" | "md" | "lg" | "icon";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = "md",
  variant = "primary",
  icon,
  disabled,
  loading = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-disabled={loading || disabled}
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // Variants
          "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary":
            variant === "primary",
          "bg-transparent text-primary border border-primary hover:bg-outline-hover focus-visible:ring-primary":
            variant === "outline",
          "bg-danger text-white hover:bg-danger-hover focus-visible:ring-danger":
            variant === "danger",
          "bg-success text-white hover:bg-success-hover focus-visible:ring-success":
            variant === "success",
          "bg-transparent text-inherit hover:bg-transparent hover:text-primary focus:ring-primary":
            variant === "ghost",

          // Sizes
          "h-8 px-3 text-xs": size === "xs",
          "h-10 px-4 text-sm": size === "md",
          "h-12 px-6 text-base": size === "lg",
          "w-12 h-12 p-0": size === "icon",
        },
        className,
      )}
    >
      {loading ? (
        <Loader2
          className={clsx(
            size === "xs" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6",
            "animate-spin",
          )}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default Button;
