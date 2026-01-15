"use client";

import { FinalizeData, FormData } from "@/types/form";
import { StepWrapper } from "../common/StepWrapper";
import { useState } from "react";
import { useEmail } from "@/hooks/useEmail";

interface FinalizeStepProps {
  data: FinalizeData;
  formData: FormData;
  onDataChange: (data: FinalizeData) => void;
  onPrev?: () => void;
}

export function FinalizeStep({
  data,
  formData,
  onDataChange,
  onPrev,
}: FinalizeStepProps) {
  const [localData, setLocalData] = useState<FinalizeData>(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    sendEmail,
    isLoading: isEmailLoading,
    error: emailError,
    success: emailSuccess,
    reset: resetEmail,
  } = useEmail();

  const handleChange = (field: keyof FinalizeData, value: boolean | string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  const handleFinalizeOrder = async () => {
    setIsSubmitting(true);
    resetEmail(); // Reset do estado do e-mail

    try {
      // Simula processamento do pedido
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Gera número do pedido
      const orderNumber = `SOS-${Date.now().toString().slice(-6)}`;

      // Atualiza ambos os campos de uma vez
      const newData = {
        ...localData,
        orderNumber: orderNumber,
        orderConfirmed: true,
      };
      setLocalData(newData);
      onDataChange(newData);

      // Envia e-mail para o administrador
      const emailResult = await sendEmail(formData);

      if (!emailResult.success) {
        console.error("Erro ao enviar e-mail:", emailResult.error);
      }

      // Aqui você pode adicionar a lógica para enviar os dados para o backend
      // console.log('Dados do pedido:', formData);
      // console.log('Número do pedido:', orderNumber);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (localData.orderConfirmed && localData.orderNumber) {
    return (
      <StepWrapper
        title="Pedido Finalizado com Sucesso!"
        subtitle="Seu pedido foi processado e enviado com sucesso"
        icon="✅"
      >
        <div className="space-y-8 text-center">
          {/* Confirmação de Sucesso */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Pedido Confirmado!
            </h2>
            <p className="text-lg text-green-700 mb-4">
              Número do pedido:{" "}
              <span className="font-bold">{localData.orderNumber}</span>
            </p>
            <p className="text-sm text-green-600">
              Você receberá uma confirmação por email e WhatsApp em breve.
            </p>
          </div>

          {/* Status dos E-mails */}
          <div
            className={`border rounded-lg p-6 ${
              emailSuccess
                ? "bg-green-50 border-green-200 text-green-700"
                : emailError
                ? "bg-red-50 border-red-200 text-red-700"
                : isEmailLoading
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <h3 className="text-lg font-bold mb-4">
              {emailSuccess
                ? "📧 E-mails Enviados com Sucesso!"
                : emailError
                ? "❌ Erro no Envio dos E-mails"
                : isEmailLoading
                ? "📧 Enviando E-mails..."
                : "📧 Status dos E-mails"}
            </h3>

            {isEmailLoading && (
              <div className="flex items-center space-x-3 text-blue-700">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Enviando e-mails de confirmação...</span>
              </div>
            )}

            {emailSuccess && (
              <div className="text-green-700 space-y-3">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>
                    E-mail enviado para o administrador (admin@admin.com)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>
                    E-mail de confirmação enviado para você (
                    {formData.clientData.email})
                  </span>
                </div>
                <p className="text-sm mt-3 p-3 bg-green-100 rounded-lg">
                  <strong>Importante:</strong> Verifique sua caixa de entrada e
                  pasta de spam para receber a confirmação do seu pedido.
                </p>
              </div>
            )}

            {emailError && (
              <div className="text-red-700">
                <p>❌ Erro ao enviar e-mails: {emailError}</p>
                <p className="text-sm mt-2">
                  O pedido foi processado, mas houve um problema no envio das
                  notificações.
                </p>
              </div>
            )}
          </div>

          {/* Resumo Rápido */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              Resumo do Pedido
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">Cliente:</span>
                <p>{formData.clientData.professionalName || "Não informado"}</p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <p>{formData.clientData.email || "Não informado"}</p>
              </div>
              <div>
                <span className="font-medium">Tipo de Palmilha:</span>
                <p>
                  {formData.insoleRequest.insoleType === "sapato-inteira"
                    ? "Sapato Inteira"
                    : formData.insoleRequest.insoleType === "tenis"
                    ? "Tênis"
                    : formData.insoleRequest.insoleType === "sapato-3-4"
                    ? "Sapato 3/4"
                    : formData.insoleRequest.insoleType === "chinelo-sandalia"
                    ? "Chinelo/Sandália"
                    : formData.insoleRequest.insoleType === "chuteira"
                    ? "Chuteira"
                    : "Não informado"}
                </p>
              </div>
              <div>
                <span className="font-medium">Arquivos Enviados:</span>
                <p>{formData.files.uploadedFiles.length} arquivo(s)</p>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📋 Próximos Passos
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">1.</span>
                <span>Nossa equipe analisará sua prescrição e medidas</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">2.</span>
                <span>
                  Entraremos em contato via WhatsApp para confirmar detalhes
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">3.</span>
                <span>
                  Iniciaremos a produção da sua palmilha personalizada
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">4.</span>
                <span>Você receberá informações sobre prazo de entrega</span>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              📞 Precisa de Ajuda?
            </h3>
            <p className="text-sm text-yellow-800 mb-3">
              Nossa equipe está disponível para esclarecer dúvidas sobre seu
              pedido.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                onClick={() => {
                  window.open(
                    `https://wa.me/5511999999999?text=Olá! Tenho dúvidas sobre o pedido ${localData.orderNumber}`,
                    "_blank"
                  );
                }}
              >
                💬 WhatsApp
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                onClick={() => {
                  window.location.href = `mailto:licenciados@sospalmilha.com.br?subject=Pedido ${localData.orderNumber}`;
                }}
              >
                📧 Email
              </button>
            </div>
          </div>

          {/* Botão Novo Pedido */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium"
            >
              🆕 Fazer Novo Pedido
            </button>
          </div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Finalizar pedido"
      subtitle="Confirme e finalize seu pedido de palmilhas personalizadas"
      icon="🏁"
    >
      <div className="space-y-8">
        {/* Resumo Final */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            📝 Resumo do Seu Pedido
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Cliente:</span>
                <p className="text-gray-900">
                  {formData.clientData.professionalName || "Não informado"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">
                  {formData.clientData.email || "Não informado"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">WhatsApp:</span>
                <p className="text-gray-900">
                  {formData.clientData.whatsapp || "Não informado"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">
                  Tipo de Palmilha:
                </span>
                <p className="text-gray-900">
                  {formData.insoleRequest.insoleType === "sapato-inteira"
                    ? "Sapato Inteira"
                    : formData.insoleRequest.insoleType === "tenis"
                    ? "Tênis"
                    : formData.insoleRequest.insoleType === "sapato-3-4"
                    ? "Sapato 3/4"
                    : formData.insoleRequest.insoleType === "chinelo-sandalia"
                    ? "Chinelo/Sandália"
                    : formData.insoleRequest.insoleType === "chuteira"
                    ? "Chuteira"
                    : "Não informado"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Modelo de Impressão:
                </span>
                <p className="text-gray-900">
                  {formData.printingModel.modelType === "cnc"
                    ? "Fresadora CNC"
                    : formData.printingModel.modelType === "printer3d"
                    ? "Impressora 3D"
                    : "Não informado"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Arquivos Enviados:
                </span>
                <p className="text-gray-900">
                  {formData.files.uploadedFiles.length} arquivo(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Arquivos */}
        {formData.files.uploadedFiles.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📎 Arquivos Anexados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.files.uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white p-3 rounded border"
                >
                  <div className="text-xl">
                    {file.type.startsWith("image/")
                      ? "🖼️"
                      : file.type === "application/pdf"
                      ? "📄"
                      : file.type.startsWith("video/")
                      ? "🎥"
                      : "📁"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações Importantes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">
            ⚠️ Informações Importantes
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span>
                Após a confirmação, nossa equipe analisará sua prescrição
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span>
                Entraremos em contato via WhatsApp para confirmar detalhes
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span>O prazo de produção será informado após a análise</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span>Mantenha seu WhatsApp disponível para contato</span>
            </li>
          </ul>
        </div>

        {/* Confirmação Final */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="final-confirmation"
              checked={localData.orderConfirmed}
              onChange={(e) => handleChange("orderConfirmed", e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
            />
            <div>
              <label
                htmlFor="final-confirmation"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                Confirmo que todas as informações estão corretas e autorizo o
                processamento do pedido <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Ao confirmar, você autoriza nossa equipe a iniciar o processo de
                produção baseado nas informações fornecidas.
              </p>
            </div>
          </div>
        </div>

        {/* Navegação */}

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-3 rounded-lg font-medium transition-colors
                     text-gray-600 bg-gray-100 hover:bg-gray-200
                     flex items-center space-x-2"
          >
            <span>←</span>
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={handleFinalizeOrder}
            disabled={!localData.orderConfirmed || isSubmitting}
            className="px-8 py-3 rounded-lg font-medium transition-colors
                     text-white bg-gradient-to-r from-green-500 to-green-600
                     hover:from-green-600 hover:to-green-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processando...</span>
              </>
            ) : (
              <>
                <span>Confirmar Pedido</span>
                <span>🚀</span>
              </>
            )}
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
