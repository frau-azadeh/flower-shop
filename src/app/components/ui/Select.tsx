import clsx from "clsx";
import React, { forwardRef, SelectHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string | FieldError;
  helperText?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, helperText, className, placeholder, ...props },
    ref,
  ) => {
    const err = typeof error === "string" ? error : error?.message;

    return (
      <div>
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}

        <select
          ref={ref}
          className={clsx(
            "w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm",
            "focus:outline-none focus:ring-2 transition-colors",
            err
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-primary",
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {!err && helperText && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
        {err && <p className="text-xs text-red-600">{err}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
