import { NextResponse } from "next/server";
import {
  PagSeguroPaymentRequest,
  PagSeguroPaymentResponse,
  PagSeguroError,
  PagSeguroConfig,
  PagSeguroPaymentResult,
  PagSeguroCardData,
} from "@/types/pagseguro";

// Configuração do PagSeguro
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;
const PAGSEGURO_ENVIRONMENT = process.env.PAGSEGURO_ENVIRONMENT || "sandbox";
const PAGSEGURO_SIMULATION_MODE =
  process.env.PAGSEGURO_SIMULATION_MODE === "true" || !PAGSEGURO_TOKEN;

const getPagSeguroConfig = (): PagSeguroConfig => {
  const isProduction = PAGSEGURO_ENVIRONMENT === "production";

  return {
    apiUrl: isProduction
      ? "https://api.pagseguro.com"
      : "https://sandbox.api.pagseguro.com",
    token: PAGSEGURO_TOKEN || "",
    environment: PAGSEGURO_ENVIRONMENT as "sandbox" | "production",
  };
};

// Função para processar pagamento com cartão
async function processCardPayment(
  paymentData: PagSeguroCardData,
  amount: number,
  installments: number
): Promise<PagSeguroPaymentResult> {
  const config = getPagSeguroConfig();

  if (PAGSEGURO_SIMULATION_MODE) {
    console.log("Modo de simulação ativado - processando pagamento simulado");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      transaction: {
        id: `sim_${Date.now()}`,
        reference_id: `ref_${Date.now()}`,
        status: "PAID",
        created_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
        description: "Pagamento simulado",
        amount: {
          value: amount,
          currency: "BRL",
        },
        payment_method: {
          type:
            paymentData.number === "credit_card" ? "CREDIT_CARD" : "DEBIT_CARD",
          installments: installments,
          capture: true,
          card: {
            id: `card_${Date.now()}`,
            brand: "VISA",
            first_six_digits: paymentData.number.substring(0, 6),
            last_four_digits: paymentData.number.substring(
              paymentData.number.length - 4
            ),
            exp_month: paymentData.expMonth,
            exp_year: paymentData.expYear,
            holder: {
              name: paymentData.holderName,
            },
          },
        },
        charges: [
          {
            id: `charge_${Date.now()}`,
            status: "PAID",
            amount: {
              value: amount,
              currency: "BRL",
            },
            payment_method: {
              type:
                paymentData.number === "credit_card"
                  ? "CREDIT_CARD"
                  : "DEBIT_CARD",
              installments: installments,
            },
            created_at: new Date().toISOString(),
            paid_at: new Date().toISOString(),
          },
        ],
      },
    };
  }

  if (!PAGSEGURO_TOKEN) {
    return {
      success: false,
      error: {
        error_messages: [
          {
            code: "INVALID_TOKEN",
            description: "Token do PagSeguro não configurado",
          },
        ],
      },
    };
  }

  try {
    const paymentRequest: PagSeguroPaymentRequest = {
      reference_id: `sos_palmilhas_${Date.now()}`,
      description: "Palmilha Personalizada - SOS Palmilhas",
      amount: {
        value: amount,
        currency: "BRL",
      },
      payment_method: {
        type:
          paymentData.number === "credit_card" ? "CREDIT_CARD" : "DEBIT_CARD",
        installments: installments,
        capture: true,
        card: {
          number: paymentData.number.replace(/\s/g, ""),
          exp_month: paymentData.expMonth,
          exp_year: paymentData.expYear,
          security_code: paymentData.securityCode,
          holder: {
            name: paymentData.holderName,
          },
        },
      },
      notification_urls: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      ],
    };

    const response = await fetch(`${config.apiUrl}/charges`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        "x-api-version": "4.0",
      },
      body: JSON.stringify(paymentRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data as PagSeguroError,
      };
    }

    return {
      success: true,
      transaction: data as PagSeguroPaymentResponse,
    };
  } catch (error) {
    console.error("Erro ao processar pagamento com cartão:", error);
    return {
      success: false,
      error: {
        error_messages: [
          {
            code: "PROCESSING_ERROR",
            description: "Erro interno ao processar pagamento",
          },
        ],
      },
    };
  }
}

// Função para processar pagamento PIX
async function processPixPayment(
  amount: number
): Promise<PagSeguroPaymentResult> {
  const config = getPagSeguroConfig();

  if (PAGSEGURO_SIMULATION_MODE) {
    console.log("Modo de simulação ativado - processando PIX simulado");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      transaction: {
        id: `pix_sim_${Date.now()}`,
        reference_id: `ref_${Date.now()}`,
        status: "PENDING",
        created_at: new Date().toISOString(),
        description: "Pagamento PIX simulado",
        amount: {
          value: amount,
          currency: "BRL",
        },
        payment_method: {
          type: "PIX",
          pix: {
            qr_code:
              "00020126580014br.gov.bcb.pix0136aae2196b-10f1-4b1f-9f59-6763b2c3b45652040000530398654041.005802BR5913SOS Palmilhas6009SAO PAULO62070503***6304",
            qr_code_text:
              "00020126580014br.gov.bcb.pix0136aae2196b-10f1-4b1f-9f59-6763b2c3b45652040000530398654041.005802BR5913SOS Palmilhas6009SAO PAULO62070503***6304",
            expiration_date: new Date(
              Date.now() + 30 * 60 * 1000
            ).toISOString(), // 30 minutos
          },
        },
        charges: [
          {
            id: `pix_charge_${Date.now()}`,
            status: "PENDING",
            amount: {
              value: amount,
              currency: "BRL",
            },
            payment_method: {
              type: "PIX",
            },
            created_at: new Date().toISOString(),
          },
        ],
      },
      pixData: {
        qrCode:
          "00020126580014br.gov.bcb.pix0136aae2196b-10f1-4b1f-9f59-6763b2c3b45652040000530398654041.005802BR5913SOS Palmilhas6009SAO PAULO62070503***6304",
        qrCodeText:
          "00020126580014br.gov.bcb.pix0136aae2196b-10f1-4b1f-9f59-6763b2c3b45652040000530398654041.005802BR5913SOS Palmilhas6009SAO PAULO62070503***6304",
        expirationDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    };
  }

  if (!PAGSEGURO_TOKEN) {
    return {
      success: false,
      error: {
        error_messages: [
          {
            code: "INVALID_TOKEN",
            description: "Token do PagSeguro não configurado",
          },
        ],
      },
    };
  }

  try {
    const paymentRequest: PagSeguroPaymentRequest = {
      reference_id: `sos_palmilhas_pix_${Date.now()}`,
      description: "Palmilha Personalizada - SOS Palmilhas (PIX)",
      amount: {
        value: amount,
        currency: "BRL",
      },
      payment_method: {
        type: "PIX",
      },
      notification_urls: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      ],
    };

    const response = await fetch(`${config.apiUrl}/charges`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        "x-api-version": "4.0",
      },
      body: JSON.stringify(paymentRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data as PagSeguroError,
      };
    }

    const transaction = data as PagSeguroPaymentResponse;

    return {
      success: true,
      transaction,
      pixData: transaction.payment_method.pix
        ? {
            qrCode: transaction.payment_method.pix.qr_code,
            qrCodeText: transaction.payment_method.pix.qr_code_text,
            expirationDate: transaction.payment_method.pix.expiration_date,
          }
        : undefined,
    };
  } catch (error) {
    console.error("Erro ao processar pagamento PIX:", error);
    return {
      success: false,
      error: {
        error_messages: [
          {
            code: "PROCESSING_ERROR",
            description: "Erro interno ao processar pagamento PIX",
          },
        ],
      },
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      paymentMethod,
      cardData,
      amount,
      customerData,
      installments = 1,
    } = body as {
      paymentMethod: string;
      cardData: PagSeguroCardData;
      amount: number;
      customerData: { name: string; email: string; phone: string };
      installments: number;
    };

    if (!paymentMethod || !amount || !customerData) {
      return NextResponse.json(
        {
          error: "Dados obrigatórios não fornecidos",
        },
        { status: 400 }
      );
    }

    // Validar parcelamento (máximo 3x sem juros)
    if (installments > 3) {
      return NextResponse.json(
        {
          error: "Parcelamento máximo de 3x sem juros",
        },
        { status: 400 }
      );
    }

    let result: PagSeguroPaymentResult;

    if (paymentMethod === "pix") {
      result = await processPixPayment(amount);
    } else if (
      paymentMethod === "credit_card" ||
      paymentMethod === "debit_card"
    ) {
      if (!cardData) {
        return NextResponse.json(
          {
            error: "Dados do cartão obrigatórios",
          },
          { status: 400 }
        );
      }
      result = await processCardPayment(cardData, amount, installments);
    } else {
      return NextResponse.json(
        {
          error: "Método de pagamento não suportado",
        },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Erro no processamento do pagamento",
          details: result.error?.error_messages || ["Erro desconhecido"],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
      pixData: result.pixData,
      message: PAGSEGURO_SIMULATION_MODE
        ? "Pagamento simulado com sucesso"
        : "Pagamento processado com sucesso",
    });
  } catch (error) {
    console.error("Erro na API de pagamento:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transaction_id");

    if (!transactionId) {
      return NextResponse.json(
        {
          error: "ID da transação obrigatório",
        },
        { status: 400 }
      );
    }

    if (PAGSEGURO_SIMULATION_MODE) {
      return NextResponse.json({
        success: true,
        transaction: {
          id: transactionId,
          status: "PAID",
          amount: { value: 16500, currency: "BRL" },
          message: "Transação simulada",
        },
      });
    }

    const config = getPagSeguroConfig();

    if (!PAGSEGURO_TOKEN) {
      return NextResponse.json(
        {
          error: "Token do PagSeguro não configurado",
        },
        { status: 500 }
      );
    }

    const response = await fetch(`${config.apiUrl}/charges/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "x-api-version": "4.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erro ao consultar transação",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      transaction: data,
    });
  } catch (error) {
    console.error("Erro ao consultar transação:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
