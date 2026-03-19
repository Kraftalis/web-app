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
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-600"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
export type { InputProps };
