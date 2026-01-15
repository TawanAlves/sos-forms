import nodemailer from "nodemailer";
import { getServerEnv } from "@/config/environment";
import { FormData } from "@/types/form";

// Função auxiliar para formatar tamanho de arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Serviço de envio de e-mails usando Nodemailer
 * Configurado para usar SMTP com autenticação segura
 */
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const env = getServerEnv();

    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE, // true para 465, false para outras portas
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  /**
   * Verifica se a conexão SMTP está funcionando
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Erro na verificação da conexão SMTP:", error);
      return false;
    }
  }

  /**
   * Envia e-mail de confirmação do formulário para o administrador
   */
  async sendFormConfirmationEmail(formData: FormData): Promise<boolean> {
    try {
      // console.log('Iniciando envio de e-mail para administrador...');
      const env = getServerEnv();
      // console.log('Configurações SMTP carregadas:', {
      //   host: env.SMTP_HOST,
      //   port: env.SMTP_PORT,
      //   user: env.SMTP_USER,
      //   adminEmail: env.ADMIN_EMAIL
      // });

      // console.log('Gerando conteúdo do e-mail...');
      const emailContent = this.generateFormEmailContent(formData);
      // console.log('Conteúdo do e-mail gerado com sucesso, tamanho:', emailContent.length);

      const mailOptions = {
        from: `"SOS Palmilhas" <${env.SMTP_USER}>`,
        to: env.ADMIN_EMAIL,
        subject: "Novo Formulário de Prescrição - SOS Palmilhas",
        html: emailContent,
        text: this.generatePlainTextContent(formData),
      };

      // console.log("Enviando e-mail...");
      await this.transporter.sendMail(mailOptions);
      // console.log("E-mail enviado com sucesso para o administrador");
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail para o administrador:", error);
      return false;
    }
  }

  /**
   * Envia e-mail de confirmação para o usuário
   */
  async sendUserConfirmationEmail(formData: FormData): Promise<boolean> {
    try {
      const env = getServerEnv();

      // Verifica se o usuário forneceu um e-mail
      if (!formData.clientData?.email) {
        // console.log(
        //   "Usuário não forneceu e-mail, pulando envio de confirmação"
        // );
        return true; // Não é um erro, apenas não há e-mail para enviar
      }

      const userEmailContent = this.generateUserEmailContent(formData);

      const mailOptions = {
        from: `"SOS Palmilhas" <${env.SMTP_USER}>`,
        to: formData.clientData.email,
        subject: "Confirmação do Seu Pedido - SOS Palmilhas",
        html: userEmailContent,
        text: this.generateUserPlainTextContent(formData),
      };

      await this.transporter.sendMail(mailOptions);
      // console.log("E-mail de confirmação enviado com sucesso para o usuário");
      return true;
    } catch (error) {
      console.error(
        "Erro ao enviar e-mail de confirmação para o usuário:",
        error
      );
      return false;
    }
  }

  /**
   * Envia ambos os e-mails (administrador e usuário)
   */
  async sendAllEmails(formData: FormData): Promise<{
    adminEmail: boolean;
    userEmail: boolean;
    success: boolean;
  }> {
    try {
      // console.log("Iniciando envio de e-mails...");
      // console.log("Dados do formulário:", {
      //   clientEmail: formData.clientData?.email,
      //   clientName: formData.clientData?.professionalName,
      //   personalName: formData.clientData?.professionalName,
      // });

      // Envia e-mail para o administrador
      // console.log("Enviando e-mail para administrador...");
      const adminEmailSent = await this.sendFormConfirmationEmail(formData);
      // console.log("E-mail do administrador enviado:", adminEmailSent);

      // Envia e-mail para o usuário
      // console.log("Enviando e-mail para usuário...");
      const userEmailSent = await this.sendUserConfirmationEmail(formData);
      // console.log("E-mail do usuário enviado:", userEmailSent);

      const success = adminEmailSent && userEmailSent;
      // console.log("Resultado final:", {
      //   adminEmailSent,
      //   userEmailSent,
      //   success,
      // });

      return {
        adminEmail: adminEmailSent,
        userEmail: userEmailSent,
        success,
      };
    } catch (error) {
      console.error("Erro ao enviar e-mails:", error);
      return {
        adminEmail: false,
        userEmail: false,
        success: false,
      };
    }
  }

  /**
   * Função auxiliar para acessar propriedades de forma segura
   */
  private safeGet<T>(
    obj: unknown,
    path: string,
    defaultValue: T = "Não informado" as T
  ): T {
    try {
      const keys = path.split(".");
      let result: unknown = obj;
      for (const key of keys) {
        if (result === null || result === undefined) {
          return defaultValue;
        }
        result = (result as Record<string, unknown>)[key];
      }
      return result !== null && result !== undefined
        ? (result as T)
        : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Gera o conteúdo HTML do e-mail
   */
  private generateFormEmailContent(formData: FormData): string {
    const formatValue = (value: unknown): string => {
      if (value === null || value === undefined || value === "")
        return "Não informado";
      if (Array.isArray(value))
        return value.length > 0 ? value.join(", ") : "Não informado";
      if (typeof value === "boolean") return value ? "Sim" : "Não";

      // Traduzir valores de string para português
      const stringValue = String(value).toLowerCase();
      if (stringValue === "yes") return "Sim";
      if (stringValue === "no") return "Não";
      if (stringValue === "true") return "Sim";
      if (stringValue === "false") return "Não";

      return String(value);
    };

    // const formatArray = (arr: unknown[]): string => {
    //   return arr && arr.length > 0 ? arr.join(', ') : 'Não informado';
    // };

    const formatNavicularMeasurement = (value: unknown): string => {
      if (value === null || value === undefined || value === "")
        return "Não informado";
      const stringValue = String(value);
      // Se já contém 'cm', retorna como está
      if (stringValue.includes("cm")) return stringValue;
      // Se é um número, adiciona 'cm'
      if (!isNaN(Number(stringValue))) return `${stringValue}cm`;
      return stringValue;
    };

    // Dados seguros usando safeGet
    const clientName = this.safeGet(formData, "clientData.professionalName");
    const clientEmail = this.safeGet(formData, "clientData.email");
    const clientWhatsapp = this.safeGet(formData, "clientData.whatsapp");
    const prescriptionType = this.safeGet(
      formData,
      "prescription.prescriptionType"
    );
    const isPreviousOrder = this.safeGet(
      formData,
      "previousOrder.isPreviousOrder"
    );
    const previousOrderDesc = this.safeGet(
      formData,
      "previousOrder.previousOrderDescription"
    );
    const orderConfirmed = this.safeGet(formData, "finalize.orderConfirmed");
    const orderNumber = this.safeGet(formData, "finalize.orderNumber");

    // Dados adicionais do formulário
    const navicularRightSitting = this.safeGet(
      formData,
      "navicularMeasurement.rightFootSitting"
    );
    const navicularRightStanding = this.safeGet(
      formData,
      "navicularMeasurement.rightFootStanding"
    );
    const navicularLeftSitting = this.safeGet(
      formData,
      "navicularMeasurement.leftFootSitting"
    );
    const navicularLeftStanding = this.safeGet(
      formData,
      "navicularMeasurement.leftFootStanding"
    );
    const manualPrescription = this.safeGet(
      formData,
      "prescriptionSummary.manualPrescription"
    );
    const printingModel = this.safeGet(formData, "printingModel.modelType");
    const blockType = this.safeGet(formData, "blockType.blockType");
    const insoleType = this.safeGet(formData, "insoleRequest.insoleType");
    const selectedArea = this.safeGet(
      formData,
      "palmilhaPrescription.selectedArea"
    );
    const additionalInfo = this.safeGet(
      formData,
      "importantInfo.additionalInfo"
    );
    const addPoronLayer = this.safeGet(formData, "importantInfo.addPoronLayer");
    const uploadedFiles = this.safeGet(formData, "files.uploadedFileInfo", []);
    const wantToReview = this.safeGet(formData, "files.wantToReview");

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Formulário - SOS Palmilhas</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid #2563eb; }
          .section h3 { margin-top: 0; color: #2563eb; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #6b7280; }
          .footer { text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Novo Formulário de Prescrição</h1>
            <p>Sistema SOS Palmilhas</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>👤 Dados do Cliente</h3>
              <div class="field">
                <span class="label">Nome Profissional:</span>
                <span class="value">${formatValue(clientName)}</span>
              </div>
              <div class="field">
                <span class="label">E-mail:</span>
                <span class="value">${formatValue(clientEmail)}</span>
              </div>
              <div class="field">
                <span class="label">WhatsApp:</span>
                <span class="value">${formatValue(clientWhatsapp)}</span>
              </div>
            </div>

            <div class="section">
              <h3>🩺 Tipo de Prescrição</h3>
              <div class="field">
                <span class="label">Tipo:</span>
                <span class="value">${formatValue(prescriptionType)}</span>
              </div>
            </div>

            <div class="section">
              <h3>📋 Pedido Anterior</h3>
              <div class="field">
                <span class="label">É pedido anterior?</span>
                <span class="value">${formatValue(isPreviousOrder)}</span>
              </div>
              ${previousOrderDesc && previousOrderDesc !== "Não informado"
        ? `
              <div class="field">
                <span class="label">Descrição:</span>
                <span class="value">${formatValue(previousOrderDesc)}</span>
              </div>
              `
        : ""
      }
            </div>

            ${navicularRightSitting !== "Não informado" ||
        navicularLeftSitting !== "Não informado"
        ? `
            <div class="section">
              <h3>👣 Medidas Naviculares</h3>
              <div class="field">
                <span class="label">Pé Direito (Sentado):</span>
                <span class="value">${formatNavicularMeasurement(
          navicularRightSitting
        )}</span>
              </div>
              <div class="field">
                <span class="label">Pé Direito (Em Pé):</span>
                <span class="value">${formatNavicularMeasurement(
          navicularRightStanding
        )}</span>
              </div>
              <div class="field">
                <span class="label">Pé Esquerdo (Sentado):</span>
                <span class="value">${formatNavicularMeasurement(
          navicularLeftSitting
        )}</span>
              </div>
              <div class="field">
                <span class="label">Pé Esquerdo (Em Pé):</span>
                <span class="value">${formatNavicularMeasurement(
          navicularLeftStanding
        )}</span>
              </div>
            </div>
            `
        : ""
      }

            ${manualPrescription !== "Não informado"
        ? `
            <div class="section">
              <h3>📝 Resumo da Prescrição</h3>
              <div class="field">
                <span class="label">Prescrição Manual:</span>
                <span class="value">${formatValue(manualPrescription)}</span>
              </div>
            </div>
            `
        : ""
      }

            ${printingModel !== "Não informado"
        ? `
            <div class="section">
              <h3>🖨️ Modelo de Impressão</h3>
              <div class="field">
                <span class="label">Tipo de Modelo:</span>
                <span class="value">${formatValue(printingModel)}</span>
              </div>
            </div>
            `
        : ""
      }

            ${blockType !== "Não informado"
        ? `
            <div class="section">
              <h3>🧱 Tipo de Bloco</h3>
              <div class="field">
                <span class="label">Tipo de Bloco:</span>
                <span class="value">${formatValue(blockType)}</span>
              </div>
            </div>
            `
        : ""
      }

            ${insoleType !== "Não informado"
        ? `
            <div class="section">
              <h3>🦶 Solicitação de Palmilhas</h3>
              <div class="field">
                <span class="label">Tipo de Palmilha:</span>
                <span class="value">${formatValue(insoleType)}</span>
              </div>
            </div>
            `
        : ""
      }

            ${selectedArea !== "Não informado"
        ? `
            <div class="section">
              <h3>🩺 Prescrição de Palmilhas</h3>
              <div class="field">
                <span class="label">Área Selecionada:</span>
                <span class="value">${formatValue(selectedArea)}</span>
              </div>
            </div>
            `
        : ""
      }

            ${additionalInfo !== "Não informado" ||
        addPoronLayer !== "Não informado"
        ? `
            <div class="section">
              <h3>ℹ️ Informações Importantes</h3>
              ${additionalInfo !== "Não informado"
          ? `
              <div class="field">
                <span class="label">Informações Adicionais:</span>
                <span class="value">${formatValue(additionalInfo)}</span>
              </div>
              `
          : ""
        }
              ${addPoronLayer !== "Não informado"
          ? `
              <div class="field">
                <span class="label">Adicionar Camada de Poron:</span>
                <span class="value">${formatValue(addPoronLayer)}</span>
              </div>
              `
          : ""
        }
            </div>
            `
        : ""
      }

            ${uploadedFiles && uploadedFiles.length > 0
        ? `
            <div class="section">
              <h3>📁 Arquivos</h3>
              <div class="field">
                <span class="label">Arquivos Enviados:</span>
                <span class="value">${uploadedFiles.length} arquivo(s)</span>
              </div>
              <div class="field">
                <span class="label">Deseja Revisar:</span>
                <span class="value">${formatValue(wantToReview)}</span>
              </div>
              <div class="field">
                <span class="label">Links para Download:</span>
                <div class="value">
                  ${uploadedFiles
          .map(
            (file: Record<string, unknown>) => `
                    <div style="margin-bottom: 8px;">
                      <a href="${process.env.NEXT_PUBLIC_BASE_URL ||
              "http://localhost:3000"
              }${file.url}" 
                         style="color: #2563eb; text-decoration: underline; font-weight: 500;">
                        📎 ${file.originalName} (${formatFileSize(
                Number(file.size)
              )})
                      </a>
                    </div>
                  `
          )
          .join("")}
                </div>
              </div>
            </div>
            `
        : ""
      }

            <div class="section">
              <h3>✅ Finalização</h3>
              <div class="field">
                <span class="label">Pedido Confirmado:</span>
                <span class="value">${formatValue(orderConfirmed)}</span>
              </div>
              ${orderNumber && orderNumber !== "Não informado"
        ? `
              <div class="field">
                <span class="label">Número do Pedido:</span>
                <span class="value">${formatValue(orderNumber)}</span>
              </div>
              `
        : ""
      }
            </div>
          </div>
          
          <div class="footer">
            <p>Obrigado por escolher a SOS Palmilhas!</p>
            <p><strong>SOS Palmilhas - Especialistas em palmilhas personalizadas</strong></p>
            <p>📧 licenciados@sospalmilha.com.br | 📱(11) 97870‑2088</p>
            <p>Data e hora: ${new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Gera o conteúdo em texto plano do e-mail
   */
  private generatePlainTextContent(formData: FormData): string {
    const formatValue = (value: unknown): string => {
      if (value === null || value === undefined || value === "")
        return "Não informado";
      if (Array.isArray(value))
        return value.length > 0 ? value.join(", ") : "Não informado";
      if (typeof value === "boolean") return value ? "Sim" : "Não";

      // Traduzir valores de string para português
      const stringValue = String(value).toLowerCase();
      if (stringValue === "yes") return "Sim";
      if (stringValue === "no") return "Não";
      if (stringValue === "true") return "Sim";
      if (stringValue === "false") return "Não";

      return String(value);
    };

    const formatNavicularMeasurement = (value: unknown): string => {
      if (value === null || value === undefined || value === "")
        return "Não informado";
      const stringValue = String(value);
      // Se já contém 'cm', retorna como está
      if (stringValue.includes("cm")) return stringValue;
      // Se é um número, adiciona 'cm'
      if (!isNaN(Number(stringValue))) return `${stringValue}cm`;
      return stringValue;
    };

    let content = "NOVO FORMULÁRIO DE PRESCRIÇÃO - SOS PALMILHAS\n";
    content += "================================================\n\n";

    content += "DADOS DO CLIENTE:\n";
    content += `Nome Profissional: ${formatValue(
      this.safeGet(formData, "clientData.professionalName")
    )}\n`;
    content += `E-mail: ${formatValue(
      this.safeGet(formData, "clientData.email")
    )}\n`;
    content += `WhatsApp: ${formatValue(
      this.safeGet(formData, "clientData.whatsapp")
    )}\n\n`;

    content += "TIPO DE PRESCRIÇÃO:\n";
    content += `Tipo: ${formatValue(
      this.safeGet(formData, "prescription.prescriptionType")
    )}\n\n`;

    content += "PEDIDO ANTERIOR:\n";
    content += `É pedido anterior: ${formatValue(
      this.safeGet(formData, "previousOrder.isPreviousOrder")
    )}\n`;
    const previousDesc = this.safeGet(
      formData,
      "previousOrder.previousOrderDescription"
    );
    if (previousDesc && previousDesc !== "Não informado") {
      content += `Descrição: ${formatValue(previousDesc)}\n`;
    }
    content += "\n";

    // Medidas Naviculares
    const navRightSitting = this.safeGet(
      formData,
      "navicularMeasurement.rightFootSitting"
    );
    const navRightStanding = this.safeGet(
      formData,
      "navicularMeasurement.rightFootStanding"
    );
    const navLeftSitting = this.safeGet(
      formData,
      "navicularMeasurement.leftFootSitting"
    );
    const navLeftStanding = this.safeGet(
      formData,
      "navicularMeasurement.leftFootStanding"
    );

    if (
      navRightSitting !== "Não informado" ||
      navLeftSitting !== "Não informado"
    ) {
      content += "MEDIDAS NAVICULARES:\n";
      content += `Pé Direito (Sentado): ${formatNavicularMeasurement(
        navRightSitting
      )}\n`;
      content += `Pé Direito (Em Pé): ${formatNavicularMeasurement(
        navRightStanding
      )}\n`;
      content += `Pé Esquerdo (Sentado): ${formatNavicularMeasurement(
        navLeftSitting
      )}\n`;
      content += `Pé Esquerdo (Em Pé): ${formatNavicularMeasurement(
        navLeftStanding
      )}\n\n`;
    }

    // Resumo da Prescrição
    const manualPrescription = this.safeGet(
      formData,
      "prescriptionSummary.manualPrescription"
    );
    if (manualPrescription !== "Não informado") {
      content += "RESUMO DA PRESCRIÇÃO:\n";
      content += `Prescrição Manual: ${formatValue(manualPrescription)}\n\n`;
    }

    // Modelo de Impressão
    const printingModel = this.safeGet(formData, "printingModel.modelType");
    if (printingModel !== "Não informado") {
      content += "MODELO DE IMPRESSÃO:\n";
      content += `Tipo de Modelo: ${formatValue(printingModel)}\n\n`;
    }

    // Tipo de Bloco
    const blockType = this.safeGet(formData, "blockType.blockType");
    if (blockType !== "Não informado") {
      content += "TIPO DE BLOCO:\n";
      content += `Tipo de Bloco: ${formatValue(blockType)}\n\n`;
    }

    // Solicitação de Palmilhas
    const insoleType = this.safeGet(formData, "insoleRequest.insoleType");
    if (insoleType !== "Não informado") {
      content += "SOLICITAÇÃO DE PALMILHAS:\n";
      content += `Tipo de Palmilha: ${formatValue(insoleType)}\n\n`;
    }

    // Prescrição de Palmilhas
    const selectedArea = this.safeGet(
      formData,
      "palmilhaPrescription.selectedArea"
    );
    if (selectedArea !== "Não informado") {
      content += "PRESCRIÇÃO DE PALMILHAS:\n";
      content += `Área Selecionada: ${formatValue(selectedArea)}\n\n`;
    }

    // Informações Importantes
    const additionalInfo = this.safeGet(
      formData,
      "importantInfo.additionalInfo"
    );
    const addPoronLayer = this.safeGet(formData, "importantInfo.addPoronLayer");
    if (
      additionalInfo !== "Não informado" ||
      addPoronLayer !== "Não informado"
    ) {
      content += "INFORMAÇÕES IMPORTANTES:\n";
      if (additionalInfo !== "Não informado") {
        content += `Informações Adicionais: ${formatValue(additionalInfo)}\n`;
      }
      if (addPoronLayer !== "Não informado") {
        content += `Adicionar Camada de Poron: ${formatValue(addPoronLayer)}\n`;
      }
      content += "\n";
    }

    // Arquivos
    const uploadedFiles = this.safeGet(formData, "files.uploadedFileInfo", []);
    const wantToReview = this.safeGet(formData, "files.wantToReview");
    if (uploadedFiles && uploadedFiles.length > 0) {
      content += "ARQUIVOS:\n";
      content += `Arquivos Enviados: ${uploadedFiles.length} arquivo(s)\n`;
      content += `Deseja Revisar: ${formatValue(wantToReview)}\n`;
      content += "Links para Download:\n";
      uploadedFiles.forEach((file: Record<string, unknown>) => {
        content += `- ${file.originalName} (${formatFileSize(
          Number(file.size)
        )})\n`;
        content += `  URL: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }${file.url}\n`;
      });
      content += "\n";
    }

    content += `Data e hora: ${new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })}\n`;

    return content;
  }

  /**
   * Gera o conteúdo HTML do e-mail para o usuário
   */
  private generateUserEmailContent(formData: FormData): string {
    const clientName = this.safeGet(formData, "clientData.professionalName");
    // const clientEmail = this.safeGet(formData, 'clientData.email');
    const orderNumber = this.safeGet(formData, "finalize.orderNumber");

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação do Pedido - SOS Palmilhas</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid #2563eb; }
          .section h3 { margin-top: 0; color: #2563eb; }
          .footer { text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Pedido Confirmado!</h1>
            <p>SOS Palmilhas - Confirmação do Seu Pedido</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Olá ${clientName}!</h3>
              <p>Seu pedido foi recebido com sucesso e está sendo processado.</p>
              ${orderNumber && orderNumber !== "Não informado"
        ? `
              <p><strong>Número do pedido:</strong> ${orderNumber}</p>
              `
        : ""
      }
              <p>Em breve entraremos em contato para mais informações sobre o seu pedido.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Obrigado por escolher a SOS Palmilhas!</p>
            <p><strong>SOS Palmilhas - Especialistas em palmilhas personalizadas</strong></p>
            <p>📧 licenciados@sospalmilha.com.br | 📱 (11) 97870‑2088</p>
            <p>Data e hora: ${new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Gera o conteúdo em texto plano do e-mail para o usuário
   */
  private generateUserPlainTextContent(formData: FormData): string {
    const clientName = this.safeGet(formData, "clientData.professionalName");
    const orderNumber = this.safeGet(formData, "finalize.orderNumber");

    let content = "PEDIDO CONFIRMADO - SOS PALMILHAS\n";
    content += "====================================\n\n";

    content += `Olá ${clientName}!\n\n`;
    content += "Seu pedido foi recebido com sucesso e está sendo processado.\n";

    if (orderNumber && orderNumber !== "Não informado") {
      content += `Número do pedido: ${orderNumber}\n`;
    }

    content +=
      "\nEm breve entraremos em contato para mais informações sobre o seu pedido.\n\n";
    content += "Obrigado por escolher a SOS Palmilhas!\n";
    content += `Data e hora: ${new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })}\n`;

    return content;
  }
}

// Instância única do serviço
export const emailService = new EmailService();
