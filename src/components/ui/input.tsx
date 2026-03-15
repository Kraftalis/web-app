"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

/**
 * Input — reusable text input with label and error support.
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-blue-500"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {hint && !error && (
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
export type { InputProps };
