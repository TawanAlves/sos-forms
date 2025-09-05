// Interface para transação do Pagar.me
declare module 'pagarme' {
  interface Transaction {
    id: string;
    status: string;
    amount: number;
    payment_method?: string;
    installments?: number;
    boleto_url?: string;
    pix_qr_code?: string;
    pix_expiration_date?: string;
  }

  interface PagarmeClient {
    transactions: {
      create(data: unknown): Promise<Transaction>;
      find(params: { id: string }): Promise<Transaction>;
    };
  }

  interface Pagarme {
    client: {
      connect(config: { api_key: string }): Promise<PagarmeClient>;
    };
  }

  const pagarme: Pagarme;
  export = pagarme;
}
