'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, required = false, helpText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="input-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <input
          ref={ref}
          className={`input-field ${error ? 'error' : ''} ${className}`}
          {...props}
        />

        {error && (
          <p className="error-message">{error}</p>
        )}

        {helpText && !error && (
          <p className="text-sm text-slate-500">{helpText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
