"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className={`
            flex items-center gap-3 p-3 border rounded-lg cursor-pointer
            transition-all duration-200
            ${props.checked
              ? "border-kemenag-green bg-kemenag-green/5"
              : "border-slate-300 hover:border-slate-400"
            }
            ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`
              w-5 h-5 rounded border-slate-300 text-kemenag-green
              focus:ring-2 focus:ring-kemenag-green focus:ring-offset-0
              ${className}
            `}
            {...props}
          />
          <span className="text-sm text-slate-700">{label}</span>
        </label>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
