import { useState, useCallback } from 'react';
import { FormData } from '@/types/form';

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
  adminEmail?: boolean;
  userEmail?: boolean;
}

interface UseEmailReturn {
  sendEmail: (formData: FormData) => Promise<EmailResponse>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

/**
 * Hook personalizado para gerenciar o envio de e-mails
 */
export function useEmail(): UseEmailReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendEmail = useCallback(async (formData: FormData): Promise<EmailResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      const result: EmailResponse = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setError(null);
      } else {
        setError(result.error || 'Erro desconhecido ao enviar e-mail');
        setSuccess(false);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro de conexão';
      setError(errorMessage);
      setSuccess(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    sendEmail,
    isLoading,
    error,
    success,
    reset,
  };
}
