'use client';

import React, { memo } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  helpText?: string;
}

/**
 * Универсальный компонент для полей формы с отображением ошибок
 */
function FormField({ 
  label, 
  error, 
  children, 
  required = false, 
  helpText 
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
      
      <div className="space-y-1">
        {children}
        
        {error && (
          <div className="flex items-start space-x-2">
            <svg 
              className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  mode?: 'add' | 'edit';
}

/**
 * Компонент input с встроенной поддержкой ошибок
 */
function FormInputComponent({ 
  label, 
  error, 
  helpText, 
  required, 
  className = '', 
  mode = 'add',
  ...inputProps 
}: FormInputProps) {
  const inputClassName = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    error ? 'border-red-500 bg-red-50' : 'border-border'
  } ${className}`;

  return (
    <FormField label={label} error={error} required={required} helpText={helpText}>
      <input
        {...inputProps}
        className={inputClassName}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputProps.id}-error` : undefined}
      />
    </FormField>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
  mode?: 'add' | 'edit';
}

/**
 * Компонент select с встроенной поддержкой ошибок
 */
function FormSelectComponent({ 
  label, 
  error, 
  helpText, 
  required, 
  className = '', 
  options,
  mode = 'add',
  ...selectProps 
}: FormSelectProps) {
  const selectClassName = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    error ? 'border-red-500 bg-red-50' : 'border-border'
  } ${className}`;

  return (
    <FormField label={label} error={error} required={required} helpText={helpText}>
      <select
        {...selectProps}
        className={selectClassName}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectProps.id}-error` : undefined}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

// Мемоизированные экспорты компонентов
export default memo(FormField);
export const FormInput = memo(FormInputComponent);
export const FormSelect = memo(FormSelectComponent);
