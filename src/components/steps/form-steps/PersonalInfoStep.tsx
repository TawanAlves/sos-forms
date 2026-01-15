"use client";

import React, { useState } from "react";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { ClientData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface PersonalInfoStepProps
  extends Omit<BaseStepProps<ClientData>, "onUpdate"> {
  onDataChange: (data: ClientData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function PersonalInfoStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  // onSaveChanges,
  // isSaving = false,
}: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof ClientData, string>>
  >({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWhatsapp = (whatsapp: string): boolean => {
    // Remove todos os caracteres não numéricos
    const numbersOnly = whatsapp.replace(/\D/g, "");
    // Deve ter 11 dígitos (DDD + 9 dígitos do número)
    return numbersOnly.length === 11;
  };

  const formatWhatsapp = (value: string): string => {
    // Remove tudo que não é número
    const numbersOnly = value.replace(/\D/g, "");

    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else if (numbersOnly.length <= 7) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    } else {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(
        2,
        7
      )}-${numbersOnly.slice(7, 11)}`;
    }
  };

  const handleInputChange = (field: keyof ClientData, value: string) => {
    let processedValue = value;

    // Aplica formatação para WhatsApp
    if (field === "whatsapp") {
      processedValue = formatWhatsapp(value);
    }

    onDataChange({
      ...data,
      [field]: processedValue,
    });

    // Remove erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientData, string>> = {};

    // Validação do email
    if (!data.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "E-mail inválido";
    }

    // Validação do nome profissional
    if (!data.professionalName.trim()) {
      newErrors.professionalName =
        "Nome do Profissional/Consultório é obrigatório";
    } else if (data.professionalName.trim().length < 2) {
      newErrors.professionalName = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validação do WhatsApp
    if (!data.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else if (!validateWhatsapp(data.whatsapp)) {
      newErrors.whatsapp = "WhatsApp deve ter formato válido (DDD + 9 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && onNext) {
      onNext();
    }
  };

  return (
    <StepWrapper
      title="Dados do cliente"
      subtitle="Preencha com os seus dados corretamente"
      showUnsavedChangesNotification={hasUnsavedChanges}
    >
      <div className="space-y-6">
        {/* E-mail */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={data.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.email
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Nome do Profissional/Consultório */}
        <div>
          <label
            htmlFor="professionalName"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Nome do Profissional / Consultório{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="professionalName"
            value={data.professionalName || ""}
            onChange={(e) =>
              handleInputChange("professionalName", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.professionalName
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Dr. João Silva / Clínica Exemplo"
          />
          {errors.professionalName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.professionalName}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label
            htmlFor="whatsapp"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Seu Contato WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="whatsapp"
            value={data.whatsapp || ""}
            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.whatsapp
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          {errors.whatsapp && (
            <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Formato: DDD + número (ex: 11999999999)
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          <Button isBack={true} onClick={onPrev} />
          <Button isBack={false} onClick={handleNext} />
        </div>
      </div>
    </StepWrapper>
  );
}
