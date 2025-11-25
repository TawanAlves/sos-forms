// Tipos TypeScript para integração com PagSeguro API

export interface PagSeguroPaymentRequest {
  reference_id: string;
  description: string;
  amount: {
    value: number; // Valor em centavos
    currency: 'BRL';
  };
  payment_method: {
    type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';
    installments?: number;
    capture?: boolean;
    card?: {
      number: string;
      exp_month: string;
      exp_year: string;
      security_code: string;
      holder: {
        name: string;
      };
    };
  };
  notification_urls?: string[];
  metadata?: {
    [key: string]: string;
  };
}

export interface PagSeguroPaymentResponse {
  id: string;
  reference_id: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED' | 'FAILED';
  created_at: string;
  paid_at?: string;
  description: string;
  amount: {
    value: number;
    currency: string;
  };
  payment_method: {
    type: string;
    installments?: number;
    capture?: boolean;
    card?: {
      id: string;
      brand: string;
      first_six_digits: string;
      last_four_digits: string;
      exp_month: string;
      exp_year: string;
      holder: {
        name: string;
      };
    };
    pix?: {
      qr_code: string;
      qr_code_text: string;
      expiration_date: string;
    };
  };
  charges: Array<{
    id: string;
    status: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_method: {
      type: string;
      installments?: number;
    };
    created_at: string;
    paid_at?: string;
  }>;
  notification_urls?: string[];
  metadata?: {
    [key: string]: string;
  };
}

export interface PagSeguroError {
  error_messages: Array<{
    code: string;
    description: string;
    parameter_name?: string;
  }>;
}

export interface PagSeguroConfig {
  apiUrl: string;
  token: string;
  environment: 'sandbox' | 'production';
}

export interface PagSeguroCardData {
  number: string;
  expMonth: string;
  expYear: string;
  securityCode: string;
  holderName: string;
}

export interface PagSeguroPixData {
  qrCode: string;
  qrCodeText: string;
  expirationDate: string;
}

export interface PagSeguroPaymentResult {
  success: boolean;
  transaction?: PagSeguroPaymentResponse;
  error?: PagSeguroError;
  pixData?: PagSeguroPixData;
}
