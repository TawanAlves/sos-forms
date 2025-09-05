import { NextResponse } from "next/server";
import pagarme from "pagarme";

// Configurações do Pagar.me
const PAGARME_API_KEY = process.env.PAGARME_API_KEY;
// const PAGARME_ENCRYPTION_KEY = process.env.PAGARME_ENCRYPTION_KEY;
const PAGARME_SIMULATION_MODE = process.env.PAGARME_SIMULATION_MODE === 'true' || !PAGARME_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      paymentMethod,
      cardData,
      amount,
      customerData,
      installments = 1,
    } = body;

    // Validar dados obrigatórios
    if (!paymentMethod || !amount || !customerData) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    // console.log('API Key configurada:', !!PAGARME_API_KEY);
    // console.log('Modo de simulação:', PAGARME_SIMULATION_MODE);

    if (PAGARME_SIMULATION_MODE) {
      // console.log('Modo de simulação ativado - processando pagamento simulado');

      // Simular processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        transaction: {
          id: `sim_${Date.now()}`,
          status: "paid",
          amount: Math.round(amount * 100),
          payment_method: paymentMethod,
          installments: installments,
          message: "Pagamento simulado com sucesso",
        },
      });
    }

    // Validar API key antes de conectar
    if (!PAGARME_API_KEY || !PAGARME_API_KEY.startsWith("ak_")) {
      console.error("API key inválida:", PAGARME_API_KEY);
      return NextResponse.json(
        { error: "Configuração de pagamento inválida" },
        { status: 500 }
      );
    }

    // Conectar com Pagar.me
    const client = await pagarme.client.connect({ api_key: PAGARME_API_KEY });

    let transactionData: Record<string, unknown> = {
      amount: Math.round(amount * 100), // Converter para centavos
      customer: {
        external_id: `customer_${Date.now()}`,
        name: customerData.name,
        type: "individual",
        country: "br",
        email: customerData.email,
        documents: [
          {
            type: "cpf",
            number: customerData.cpf || "00000000000", // CPF padrão para teste
          },
        ],
        phone_numbers: [customerData.phone || "+5511999999999"],
      },
      items: [
        {
          id: "palmilha_personalizada",
          title: "Palmilha Personalizada",
          unit_price: Math.round(amount * 100),
          quantity: 1,
          tangible: true,
        },
      ],
    };

    // Configurar método de pagamento
    switch (paymentMethod) {
      case "credit_card":
      case "debit_card":
        if (!cardData) {
          return NextResponse.json(
            { error: "Dados do cartão não fornecidos" },
            { status: 400 }
          );
        }

        transactionData = {
          ...transactionData,
          payment_method: "credit_card",
          card_number: cardData.cardNumber.replace(/\s/g, ""),
          card_holder_name: cardData.cardHolderName,
          card_expiration_date: `${cardData.cardExpiryMonth}${cardData.cardExpiryYear}`,
          card_cvv: cardData.cardCvv,
          installments: installments,
          capture: true,
        };
        break;

      case "boleto":
        transactionData = {
          ...transactionData,
          payment_method: "boleto",
        };
        break;

      case "pix":
        transactionData = {
          ...transactionData,
          payment_method: "pix",
        };
        break;

      default:
        return NextResponse.json(
          { error: "Método de pagamento não suportado" },
          { status: 400 }
        );
    }

    // Criar transação
    const transaction = await client.transactions.create(transactionData);

    // Retornar resposta baseada no status da transação
    if (transaction.status === "paid" || transaction.status === "processing") {
      return NextResponse.json({
        success: true,
        transaction: {
          id: transaction.id,
          status: transaction.status,
          amount: transaction.amount,
          payment_method: transaction.payment_method,
          installments: transaction.installments,
          boleto_url: transaction.boleto_url,
          pix_qr_code: transaction.pix_qr_code,
          pix_expiration_date: transaction.pix_expiration_date
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Falha no processamento do pagamento",
          transaction: {
            id: transaction.id,
            status: transaction.status,
          },
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro no processamento do pagamento:", error);

    // Tratar erros específicos do Pagar.me
    if ((error as Record<string, unknown>).response) {
      const errorData = (error as Record<string, unknown>).response as Record<string, unknown>;
      return NextResponse.json({
        success: false,
        error: errorData.message || 'Erro no processamento do pagamento',
        details: errorData.errors
      }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// Endpoint para consultar status de transação
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transaction_id");

    if (!transactionId) {
      return NextResponse.json(
        { error: "ID da transação não fornecido" },
        { status: 400 }
      );
    }

    // Validar API key antes de conectar
    if (!PAGARME_API_KEY || !PAGARME_API_KEY.startsWith("ak_")) {
      return NextResponse.json(
        { error: "Configuração de pagamento inválida" },
        { status: 500 }
      );
    }

    const client = await pagarme.client.connect({ api_key: PAGARME_API_KEY });
    const transaction = await client.transactions.find({ id: transactionId });

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        payment_method: transaction.payment_method,
        installments: transaction.installments,
        boleto_url: transaction.boleto_url,
        pix_qr_code: transaction.pix_qr_code,
        pix_expiration_date: transaction.pix_expiration_date
      }
    });
  } catch (error) {
    console.error("Erro ao consultar transação:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao consultar transação",
      },
      { status: 500 }
    );
  }
}
