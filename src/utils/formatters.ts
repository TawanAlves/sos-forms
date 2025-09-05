/**
 * Utilitários para formatação de inputs
 */

export const formatters = {
  /**
   * Formatar CPF (000.000.000-00)
   */
  cpf: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  /**
   * Formatar telefone ((11) 99999-9999)
   */
  phone: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },

  /**
   * Formatar CEP (00000-000)
   */
  cep: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
  },

  /**
   * Formatar apenas números
   */
  numbersOnly: (value: string): string => {
    return value.replace(/\D/g, '');
  },

  /**
   * Formatar valor monetário (R$ 0,00)
   */
  currency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  },

  /**
   * Formatar data (DD/MM/AAAA)
   */
  date: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  },
};

/**
 * Validadores comuns
 */
export const validators = {
  /**
   * Validar email
   */
  email: (value: string): string | null => {
    if (!value) return 'Email é obrigatório';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido';
    return null;
  },

  /**
   * Validar CPF
   */
  cpf: (value: string): string | null => {
    if (!value) return 'CPF é obrigatório';
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) return 'CPF deve ter 11 dígitos';
    // Validação básica de CPF (pode ser expandida)
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
      return 'CPF deve estar no formato 000.000.000-00';
    }
    return null;
  },

  /**
   * Validar telefone
   */
  phone: (value: string): string | null => {
    if (!value) return 'Telefone é obrigatório';
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) return 'Telefone deve ter pelo menos 10 dígitos';
    return null;
  },

  /**
   * Validar campo obrigatório
   */
  required: (fieldName: string) => (value: unknown): string | null => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} é obrigatório`;
    }
    return null;
  },

  /**
   * Validar valor numérico mínimo
   */
  minValue: (min: number, fieldName: string) => (value: unknown): string | null => {
    const num = Number(value);
    if (isNaN(num) || num < min) {
      return `${fieldName} deve ser pelo menos ${min}`;
    }
    return null;
  },

  /**
   * Validar tamanho mínimo de string
   */
  minLength: (min: number, fieldName: string) => (value: unknown): string | null => {
    const str = String(value || '');
    if (str.length < min) {
      return `${fieldName} deve ter pelo menos ${min} caracteres`;
    }
    return null;
  },
};
