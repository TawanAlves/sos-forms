import pagarme from 'pagarme';
import { getServerEnv } from '@/config/environment';

export interface PaymentRequest {
  amount: number;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  cvv: string;
  installments: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  message?: string;
  error?: string;
}

interface PagarmeClient {
  transactions: {
    create(data: unknown): Promise<{
      id: string;
      status: string;
      amount: number;
    }>;
  };
}

class PagarmeService {
  private client: Promise<PagarmeClient> | null = null;

  private initClient() {
    if (!this.client) {
      // Inicializa o cliente do Pagar.me usando configuração centralizada com Zod
      const env = getServerEnv();
      this.client = pagarme.client.connect({ api_key: env.PAGARME_API_KEY }) as Promise<PagarmeClient>;
    }
    return this.client;
  }

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const client = await this.initClient();

      // Formata a data de expiração
      const [month, year] = paymentData.expiryDate.split('/');

      const transaction = await client.transactions.create({
        amount: paymentData.amount,
        payment_method: 'credit_card',
        installments: paymentData.installments,
        card_number: paymentData.cardNumber.replace(/\s/g, ''),
        card_cvv: paymentData.cvv,
        card_expiration_date: `${month}${year}`,
        card_holder_name: paymentData.holderName,
        customer: {
          external_id: Date.now().toString(),
          name: paymentData.customer.name,
          type: 'individual',
          country: 'br',
          email: paymentData.customer.email,
          phone_numbers: [paymentData.customer.phone],
          documents: [
            {
              type: 'cpf',
              number: paymentData.customer.document.replace(/\D/g, ''),
            },
          ],
        },
        billing: {
          name: paymentData.customer.name,
          address: {
            country: 'br',
            state: 'sp',
            city: 'São Paulo',
            neighborhood: 'Centro',
            street: 'Rua das Palmilhas',
            street_number: '123',
            zipcode: '01000000',
          },
        },
        items: [
          {
            id: '1',
            title: 'Palmilha Personalizada',
            unit_price: paymentData.amount,
            quantity: 1,
            tangible: true,
          },
        ],
      });

      return {
        success: transaction.status === 'paid',
        transactionId: transaction.id,
        status: transaction.status,
        message: transaction.status === 'paid'
          ? 'Pagamento aprovado com sucesso!'
          : 'Pagamento em processamento'
      };

    } catch (error: unknown) {
      console.error('Erro no pagamento:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'Erro interno no processamento do pagamento';

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  }

  validateCard(cardNumber: string): boolean {
    // Implementação básica do algoritmo de Luhn
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  validateCPF(cpf: string): boolean {
    const digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(digits[10]);
  }
}

export const pagarmeService = new PagarmeService();
