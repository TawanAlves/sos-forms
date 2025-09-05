'use client';

import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar validação de formulários nas steps
 */
export function useStepValidation<T extends Record<string, unknown>>(
  initialData: T,
  validationRules: Partial<Record<keyof T, (value: unknown) => string | null>>
) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = useCallback((field: keyof T, value: unknown): string | null => {
    const rule = validationRules[field];
    return rule ? rule(value) : null;
  }, [validationRules]);

  const validateAll = useCallback((data: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const key = field as keyof T;
      const error = validateField(key, data[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField]);

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateAll,
    clearError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
}
