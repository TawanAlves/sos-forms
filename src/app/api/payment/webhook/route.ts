import { NextResponse } from 'next/server';
import { PagSeguroPaymentResponse } from '@/types/pagseguro';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verificar se é uma notificação válida do PagSeguro
    if (!body.id || !body.type) {
      return NextResponse.json({
        error: 'Notificação inválida'
      }, { status: 400 });
    }

    // Processar notificação de pagamento
    if (body.type === 'PAYMENT') {
      const paymentData: PagSeguroPaymentResponse = body.data;

      console.log('Webhook PagSeguro - Pagamento recebido:', {
        id: paymentData.id,
        status: paymentData.status,
        amount: paymentData.amount,
        reference_id: paymentData.reference_id
      });

      // Implementar lógica futuras como:
      // - Enviar e-mail de confirmação

      if (paymentData.status === 'PAID') {
        console.log('Pagamento confirmado:', paymentData.id);
        // Implementar lógica de confirmação
      } else if (paymentData.status === 'CANCELLED' || paymentData.status === 'FAILED') {
        console.log('Pagamento cancelado/falhou:', paymentData.id);
        // Implementar lógica de cancelamento
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processado com sucesso'
    });

  } catch (error) {
    console.error('Erro no webhook PagSeguro:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function GET() {
  // request: Request
  // Endpoint para verificar se o webhook está funcionando
  return NextResponse.json({
    success: true,
    message: 'Webhook PagSeguro ativo',
    timestamp: new Date().toISOString()
  });
}
