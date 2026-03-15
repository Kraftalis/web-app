"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";

/**
 * Select — styled dropdown select component.
 */

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, id, className = "", ...props },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2 pr-8 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-blue-500"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
export type { SelectProps, SelectOption };
