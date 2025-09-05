import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      amount,
      cardNumber,
      holderName,
      expiryDate,
      cvv,
      installments = 1,
      customer
    } = body;

    // Validar dados básicos
    if (!amount || !cardNumber || !holderName || !expiryDate || !cvv || !customer) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Simular processamento de pagamento
    // Em produção, use o pagarmeService.processPayment(body)

    // Simular delay do processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular aprovação/rejeição baseado no número do cartão
    const isApproved = !cardNumber.includes('0000');

    if (isApproved) {
      return NextResponse.json({
        success: true,
        transactionId: `txn_${Date.now()}`,
        status: 'paid',
        installments,
        message: 'Pagamento aprovado com sucesso!'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Cartão recusado. Tente outro cartão.'
      });
    }

  } catch (error) {
    console.error('Erro na API de pagamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
