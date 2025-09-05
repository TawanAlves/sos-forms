"use client";

import React, { useState } from "react";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { InsoleRequestData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface InsoleRequestStepProps
  extends Omit<BaseStepProps<InsoleRequestData>, "onUpdate"> {
  onDataChange: (data: InsoleRequestData) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

type InsoleOption = {
  value: InsoleRequestData["insoleType"];
  label: string;
  description: string;
  icon: string;
};

const insoleOptions: InsoleOption[] = [
  {
    value: "sapato-inteira",
    label: "SAPATO (inteira)",
    description: "Palmilha completa para sapatos sociais e formais",
    icon: "👞",
  },
  {
    value: "tenis",
    label: "TÊNIS",
    description: "Palmilha para calçados esportivos e casuais",
    icon: "👟",
  },
  {
    value: "sapato-3-4",
    label: "SAPATO (3/4)",
    description: "Palmilha parcial para sapatos, cobrindo 3/4 do pé",
    icon: "👠",
  },
  {
    value: "chinelo-sandalia",
    label: "Chinelo / Sandália",
    description: "Palmilha para calçados abertos e casuais",
    icon: "🩴",
  },
  {
    value: "chuteira",
    label: "CHUTEIRA",
    description: "Palmilha específica para calçados esportivos com travas",
    icon: "⚽",
  },
];

export function InsoleRequestStep({
  data,
  onDataChange,
  onNext,
  onPrev,
}: InsoleRequestStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof InsoleRequestData, string>>
  >({});

  const handleInsoleChange = (insoleType: InsoleRequestData["insoleType"]) => {
    onDataChange({
      ...data,
      insoleType,
    });

    // Remove erro quando o usuário faz uma seleção
    if (errors.insoleType) {
      setErrors((prev) => ({
        ...prev,
        insoleType: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InsoleRequestData, string>> = {};

    if (!data.insoleType) {
      newErrors.insoleType = "Selecione um tipo de palmilha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && onNext) {
      onNext();
    }
  };

  const selectedOption = insoleOptions.find(
    (option) => option.value === data.insoleType
  );

  return (
    <StepWrapper
      title="Solicitações de Palmilhas"
      subtitle="Selecione o Tipo de Palmilha"
    >
      <div className="space-y-6">
        {/* Grid de opções de palmilhas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insoleOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                data.insoleType === option.value
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handleInsoleChange(option.value)}
            >
              {/* Radio button */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    data.insoleType === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {data.insoleType === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>

              {/* Ícone */}
              <div className="text-center mb-4">
                <span className="text-4xl">{option.icon}</span>
              </div>

              {/* Conteúdo */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>

              {/* Input hidden para acessibilidade */}
              <input
                type="radio"
                name="insoleType"
                value={option.value}
                checked={data.insoleType === option.value}
                onChange={() => handleInsoleChange(option.value)}
                className="sr-only text-gray-900"
                aria-label={`${option.label} - ${option.description}`}
              />
            </div>
          ))}
        </div>

        {/* Erro de validação */}
        {errors.insoleType && (
          <div className="text-center">
            <p className="text-sm text-red-600">{errors.insoleType}</p>
          </div>
        )}

        {/* Informações sobre a seleção */}
        {selectedOption && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-green-900 mb-1">
                  Tipo Selecionado: {selectedOption.label}
                </h4>
                <p className="text-sm text-green-800">
                  {selectedOption.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informações importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-2">
                💡 Informações importantes:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>SAPATO (inteira):</strong> Cobertura completa do pé,
                  ideal para sapatos fechados
                </li>
                <li>
                  • <strong>SAPATO (3/4):</strong> Cobertura parcial, não
                  interfere nos dedos do pé
                </li>
                <li>
                  • <strong>TÊNIS:</strong> Especialmente desenvolvida para
                  atividades esportivas
                </li>
                <li>
                  • <strong>Chinelo/Sandália:</strong> Adaptada para calçados
                  abertos e ventilados
                </li>
                <li>
                  • <strong>CHUTEIRA:</strong> Resistente e adequada para
                  esportes com impacto
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          {" "}
          <Button isBack={true} onClick={onPrev} />
          <Button
            isBack={false}
            onClick={handleNext}
            disabled={!data.insoleType}
          />
        </div>
      </div>
    </StepWrapper>
  );
}
