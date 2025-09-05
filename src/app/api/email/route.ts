import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email";
import { FormData } from "@/types/form";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log('Dados recebidos na API:', JSON.stringify(body, null, 2));

    const formData: FormData = body.formData;

    // Validar dados básicos
    if (!formData || !formData.clientData || !formData.clientData.email) {
      // console.log('Dados do formulário incompletos:', {
      //   hasFormData: !!formData,
      //   hasClientData: !!formData?.clientData,
      //   hasEmail: !!formData?.clientData?.email
      // });
      return NextResponse.json(
        { success: false, error: "Dados do formulário incompletos" },
        { status: 400 }
      );
    }

    // Verificar conexão SMTP
    const isConnected = await emailService.verifyConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: "Erro na configuração do servidor de e-mail" },
        { status: 500 }
      );
    }

    // Enviar ambos os e-mails (administrador e usuário)
    const emailResult = await emailService.sendAllEmails(formData);

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "E-mails enviados com sucesso",
        adminEmail: emailResult.adminEmail,
        userEmail: emailResult.userEmail,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao enviar e-mails",
          adminEmail: emailResult.adminEmail,
          userEmail: emailResult.userEmail,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro na API de e-mail:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para testar a conexão SMTP
 */
export async function GET() {
  try {
    const isConnected = await emailService.verifyConnection();

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "Conexão SMTP funcionando corretamente",
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Erro na conexão SMTP" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao testar conexão SMTP:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
