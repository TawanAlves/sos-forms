"use client";

// todo: apenas o bloco preto está disponivel, vamos deixar desable por enquanto

import React, { useState } from "react";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { BlockTypeData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface BlockTypeStepProps
  extends Omit<BaseStepProps<BlockTypeData>, "onUpdate"> {
  onDataChange: (data: BlockTypeData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

type BlockOption = {
  value: BlockTypeData["blockType"];
  label: string;
  description: string;
  additionalCost: boolean;
  density?: string;
};

const blockOptions: BlockOption[] = [
  {
    value: "black-40",
    label: "Preto",
    description: "Eva dureza 28 Shore A",
    additionalCost: false,
  },
  // {
  //   value: "ps-shock",
  //   label: "PS SHOCK",
  //   description: "+ valor adicional",
  //   additionalCost: true,
  // },
  // {
  //   value: "blue-40",
  //   label: "Azul",
  //   description: "densidade 40 + valor adicional",
  //   additionalCost: true,
  // },
  // {
  //   value: "viva-army",
  //   label: "Viva ARMY",
  //   description: "a confirmar + valor adicional",
  //   additionalCost: true,
  // },
  // {
  //   value: "viva-black-gray",
  //   label: "Viva Preto / Cinza",
  //   description: "a confirmar + valor adicional",
  //   additionalCost: true,
  // },
  // {
  //   value: "viva-purple-lilac",
  //   label: "Viva Roxo / Lilás",
  //   description: "a confirmar + valor adicional",
  //   additionalCost: true,
  // },
  // {
  //   value: "viva-red-yellow",
  //   label: "Viva Vermelho / Amarelo",
  //   description: "a confirmar + valor adicional",
  //   additionalCost: true,
  // },
  // {
  //   value: "viva-black",
  //   label: "Viva Black",
  //   description: "a confirmar + valor adicional",
  //   additionalCost: true,
  // },
  // {
  //   value: "viva-blue",
  //   label: "Viva Blue",
  //   description: "a confirmar + valor adicional",
  //   additionalCost: true,
  // },
];

export function BlockTypeStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: BlockTypeStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof BlockTypeData, string>>
  >({});

  const handleBlockChange = (blockType: BlockTypeData["blockType"]) => {
    onDataChange({
      ...data,
      blockType,
    });

    // Remove erro quando o usuário faz uma seleção
    if (errors.blockType) {
      setErrors((prev) => ({
        ...prev,
        blockType: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BlockTypeData, string>> = {};

    if (!data.blockType) {
      newErrors.blockType = "Selecione um tipo de bloco";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && onNext) {
      onNext();
    }
  };

  const selectedOption = blockOptions.find(
    (option) => option.value === data.blockType
  );

  return (
    <StepWrapper
      title="Tipos de Blocos (Fresadora)"
      subtitle="Selecione o Tipo de Bloco"
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-6">
        {/* Lista de opções de blocos */}
        <div className="space-y-3">
          {blockOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                data.blockType === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handleBlockChange(option.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Radio button */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      data.blockType === option.value
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {data.blockType === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {option.label}
                    </h3>
                    <p
                      className={`text-sm ${
                        option.additionalCost
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Badge de valor adicional */}
                {option.additionalCost && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      + Valor
                    </span>
                  </div>
                )}
              </div>

              {/* Input hidden para acessibilidade */}
              <input
                type="radio"
                name="blockType"
                value={option.value}
                checked={data.blockType === option.value}
                onChange={() => handleBlockChange(option.value)}
                className="sr-only text-gray-900"
                aria-label={`${option.label} - ${option.description}`}
              />
            </div>
          ))}
        </div>

        {/* Erro de validação */}
        {errors.blockType && (
          <div className="text-center">
            <p className="text-sm text-red-600">{errors.blockType}</p>
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
                  Bloco Selecionado: {selectedOption.label}
                </h4>
                <p className="text-sm text-green-800">
                  {selectedOption.additionalCost
                    ? `Este bloco possui valor adicional. ${selectedOption.description}`
                    : `Bloco padrão sem valor adicional. ${selectedOption.description}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informação importante */}
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
                💡 Importante:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Blocos com <strong>valor adicional</strong> terão custo
                  extra no orçamento final
                </li>
                <li>
                  • Opções <strong>&ldquo;a confirmar&rdquo;</strong> terão
                  disponibilidade verificada antes da produção
                </li>
                <li>
                  • A <strong>densidade</strong> indica a firmeza e durabilidade
                  do material
                </li>
                <li>
                  • Blocos da linha <strong>Viva</strong> oferecem tecnologia
                  avançada
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        {/* todo:Botão aqui */}
        <div className="flex justify-between pt-6">
          <Button isBack={true} onClick={onPrev} />
          <Button
            isBack={false}
            onClick={handleNext}
            disabled={!data.blockType}
          />
        </div>
      </div>
    </StepWrapper>
  );
}
