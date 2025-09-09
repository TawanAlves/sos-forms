"use client";

import React, { useState, useEffect } from "react";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { PaymentData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface PaymentStepProps
  extends Omit<BaseStepProps<PaymentData>, "onUpdate"> {
  onDataChange: (data: PaymentData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function PaymentStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: PaymentStepProps) {
  const [localData, setLocalData] = useState<PaymentData>(data);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentData, string>>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Sincronizar dados locais com props
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (
    field: keyof PaymentData,
    value: string | number | boolean
  ) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onDataChange(newData);

    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentData, string>> = {};

    if (!localData.paymentMethod) {
      newErrors.paymentMethod = "Selecione um método de pagamento";
    }

    if (
      localData.paymentMethod === "credit_card" ||
      localData.paymentMethod === "debit_card"
    ) {
      if (!localData.cardNumber.trim()) {
        newErrors.cardNumber = "Número do cartão é obrigatório";
      } else if (localData.cardNumber.replace(/\s/g, "").length < 13) {
        newErrors.cardNumber = "Número do cartão inválido";
      }

      if (!localData.cardHolderName.trim()) {
        newErrors.cardHolderName = "Nome do portador é obrigatório";
      }

      if (!localData.cardExpiryMonth) {
        newErrors.cardExpiryMonth = "Mês de vencimento é obrigatório";
      }

      if (!localData.cardExpiryYear) {
        newErrors.cardExpiryYear = "Ano de vencimento é obrigatório";
      }

      if (!localData.cardCvv.trim()) {
        newErrors.cardCvv = "CVV é obrigatório";
      } else if (localData.cardCvv.length < 3) {
        newErrors.cardCvv = "CVV inválido";
      }

      if (localData.installments < 1) {
        newErrors.installments = "Número de parcelas inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espaços
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    handleChange("cardNumber", formatted);
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Preparar dados para a API
      const paymentData = {
        paymentMethod: localData.paymentMethod,
        amount: 165.0, // Valor fixo por enquanto
        installments: localData.installments,
        customerData: {
          name: "Cliente Teste", // Será obtido dos dados do formulário
          email: "cliente@teste.com", // Será obtido dos dados do formulário
          phone: "+5511999999999",
        },
        cardData:
          localData.paymentMethod === "credit_card" ||
          localData.paymentMethod === "debit_card"
            ? {
                cardNumber: localData.cardNumber,
                cardHolderName: localData.cardHolderName,
                cardExpiryMonth: localData.cardExpiryMonth,
                cardExpiryYear: localData.cardExpiryYear,
                cardCvv: localData.cardCvv,
              }
            : null,
      };

      // Chamar API de pagamento
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        const updatedData = {
          ...localData,
          isPaid: true,
          paymentStatus: "paid" as const,
          transactionId: result.transaction.id,
        };

        setLocalData(updatedData);
        onDataChange(updatedData);

        if (onNext) {
          onNext();
        }
      } else {
        setErrors({
          paymentMethod:
            result.error || "Erro ao processar pagamento. Tente novamente.",
        });
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
      setErrors({
        paymentMethod: "Erro ao processar pagamento. Tente novamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { value: "credit_card", label: "Cartão de Crédito", icon: "💳" },
    { value: "debit_card", label: "Cartão de Débito", icon: "💳" },
    { value: "boleto", label: "Boleto Bancário", icon: "📄" },
    { value: "pix", label: "PIX", icon: "❖" },
  ];

  return (
    <StepWrapper
      title="Pagamento"
      subtitle="Escolha a forma de pagamento para finalizar seu pedido"
      icon="💳"
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-8">
        {/* Resumo do Pedido */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo do Pedido
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Palmilha Personalizada</span>
              <span className="font-medium">R$ 150,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frete</span>
              <span className="font-medium">R$ 15,00</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>R$ 165,00</span>
            </div>
          </div>
        </div>

        {/* Métodos de Pagamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Método de Pagamento
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.value}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                  localData.paymentMethod === method.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleChange("paymentMethod", method.value)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-gray-900">
                    {method.label}
                  </span>
                </div>
                {localData.paymentMethod === method.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
          )}
        </div>

        {/* Formulário do Cartão */}
        {(localData.paymentMethod === "credit_card" ||
          localData.paymentMethod === "debit_card") && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Dados do Cartão
            </h3>

            {/* Número do Cartão */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Número do Cartão <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cardNumber"
                value={localData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="0000 0000 0000 0000"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Nome do Portador */}
            <div>
              <label
                htmlFor="cardHolderName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome do Portador <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cardHolderName"
                value={localData.cardHolderName}
                onChange={(e) =>
                  handleChange("cardHolderName", e.target.value.toUpperCase())
                }
                placeholder="NOME COMO NO CARTÃO"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.cardHolderName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardHolderName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cardHolderName}
                </p>
              )}
            </div>

            {/* Validade e CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="cardExpiryMonth"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mês <span className="text-red-500">*</span>
                </label>
                <select
                  id="cardExpiryMonth"
                  value={localData.cardExpiryMonth}
                  onChange={(e) =>
                    handleChange("cardExpiryMonth", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.cardExpiryMonth
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Mês</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.cardExpiryMonth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardExpiryMonth}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardExpiryYear"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ano <span className="text-red-500">*</span>
                </label>
                <select
                  id="cardExpiryYear"
                  value={localData.cardExpiryYear}
                  onChange={(e) =>
                    handleChange("cardExpiryYear", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.cardExpiryYear ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Ano</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.cardExpiryYear && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardExpiryYear}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardCvv"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardCvv"
                  value={localData.cardCvv}
                  onChange={(e) =>
                    handleChange(
                      "cardCvv",
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  placeholder="000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.cardCvv ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cardCvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>
                )}
              </div>
            </div>

            {/* Parcelas */}
            {localData.paymentMethod === "credit_card" && (
              <div>
                <label
                  htmlFor="installments"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Parcelas <span className="text-red-500">*</span>
                </label>
                <select
                  id="installments"
                  value={localData.installments}
                  onChange={(e) =>
                    handleChange("installments", parseInt(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.installments ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const installments = i + 1;
                    const value = 165 / installments;
                    return (
                      <option key={installments} value={installments}>
                        {installments}x de R${" "}
                        {value.toFixed(2).replace(".", ",")} sem juros
                      </option>
                    );
                  })}
                </select>
                {errors.installments && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.installments}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Informações para Boleto/PIX */}
        {(localData.paymentMethod === "boleto" ||
          localData.paymentMethod === "pix") && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">
                {localData.paymentMethod === "boleto" ? "📄" : "⚡"}
              </span>
              <h3 className="text-lg font-semibold text-blue-900">
                {localData.paymentMethod === "boleto"
                  ? "Boleto Bancário"
                  : "PIX"}
              </h3>
            </div>
            <p className="text-blue-800">
              {localData.paymentMethod === "boleto"
                ? "Após confirmar o pedido, você receberá o boleto por e-mail. O prazo para pagamento é de 3 dias úteis."
                : "Após confirmar o pedido, você receberá o código PIX por e-mail. O pagamento é processado instantaneamente."}
            </p>
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="flex justify-between items-center pt-6 flex-wrap gap-3">
          <Button isBack={true} onClick={onPrev} disabled={isProcessing} />

          <div className="flex space-x-4 gap-3 flex-wrap">
            {/* Botão Salvar Especificações */}
            <button
              onClick={onSaveChanges}
              disabled={isSaving || isProcessing}
              className={`px-6 py-2 rounded-lg transition-colors border ${
                isSaving || isProcessing
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600 inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                "Salvar Especificações da Palmilha"
              )}
            </button>

            {/* Botão Finalizar Pagamento */}
            <button
              onClick={handleNext}
              disabled={isProcessing}
              className={`px-6 py-2 rounded-lg transition-colors min-w-[200px] ${
                isProcessing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processando...
                </>
              ) : (
                `Finalizar Pagamento - R$ 165,00`
              )}
            </button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
