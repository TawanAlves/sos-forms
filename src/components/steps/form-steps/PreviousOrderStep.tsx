"use client";

import React, { useState } from "react";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { PreviousOrderData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface PreviousOrderStepProps
  extends Omit<BaseStepProps<PreviousOrderData>, "onUpdate"> {
  onDataChange: (data: PreviousOrderData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function PreviousOrderStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: PreviousOrderStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PreviousOrderData, string>>
  >({});

  const handleOptionSelect = (isPreviousOrder: "yes" | "no") => {
    onDataChange({
      ...data,
      isPreviousOrder,
      // Limpa a descrição se escolher "Não"
      previousOrderDescription:
        isPreviousOrder === "no" ? "" : data.previousOrderDescription,
    });

    // Remove erro quando o usuário faz uma seleção
    if (errors.isPreviousOrder) {
      setErrors((prev) => ({
        ...prev,
        isPreviousOrder: undefined,
      }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    onDataChange({
      ...data,
      previousOrderDescription: value,
    });

    // Remove erro quando o usuário começa a digitar
    if (errors.previousOrderDescription) {
      setErrors((prev) => ({
        ...prev,
        previousOrderDescription: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PreviousOrderData, string>> = {};

    // Validação da seleção
    if (!data.isPreviousOrder) {
      newErrors.isPreviousOrder = "Por favor, selecione uma opção";
    }

    // Validação da descrição se "Sim" foi selecionado
    if (
      data.isPreviousOrder === "yes" &&
      !data.previousOrderDescription.trim()
    ) {
      newErrors.previousOrderDescription =
        "Descrição é obrigatória quando é uma cópia de pedido anterior";
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
      title="Pedido Anterior"
      subtitle="Esta pedido é referente à cópia exata de pedido anterior?"
    >
      <div className="space-y-6">
        {/* Opções Sim/Não */}
        <div className="space-y-4">
          {/* Opção Sim */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
              data.isPreviousOrder === "yes"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => handleOptionSelect("yes")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="isPreviousOrder"
                value="yes"
                checked={data.isPreviousOrder === "yes"}
                onChange={() => handleOptionSelect("yes")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 text-gray-900"
              />
              <span className="text-lg font-medium text-gray-900">Sim</span>
            </div>
          </div>

          {/* Opção Não */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
              data.isPreviousOrder === "no"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => handleOptionSelect("no")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="isPreviousOrder"
                value="no"
                checked={data.isPreviousOrder === "no"}
                onChange={() => handleOptionSelect("no")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 text-gray-900"
              />
              <span className="text-lg font-medium text-gray-900">Não</span>
            </div>
          </div>

          {/* Erro na seleção */}
          {errors.isPreviousOrder && (
            <p className="text-sm text-red-600">{errors.isPreviousOrder}</p>
          )}
        </div>

        {/* Área de texto - só aparece se "Sim" foi selecionado */}
        {data.isPreviousOrder === "yes" && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="previousOrderDescription"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Descreva abaixo as informações necessárias{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="previousOrderDescription"
                value={data.previousOrderDescription || ""}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-gray-900 ${
                  errors.previousOrderDescription
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Descreva as informações do pedido anterior que devem ser copiadas exatamente..."
              />
              {errors.previousOrderDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.previousOrderDescription}
                </p>
              )}
            </div>

            {/* Botões de navegação para quando "Sim" está selecionado */}
            <div className="flex justify-between pt-6">
              <Button isBack={true} onClick={onPrev} />{" "}
              <Button isBack={false} onClick={handleNext} />
            </div>
          </div>
        )}

        {/* Botões de navegação - Para quando "Não" está selecionado */}
        {data.isPreviousOrder === "no" && (
          <div className="flex justify-between pt-6">
            <Button isBack={true} onClick={onPrev} />
            <Button isBack={false} onClick={onNext} />
          </div>
        )}

        {/* Botão voltar para quando nada está selecionado */}
        {!data.isPreviousOrder && (
          <div className="flex justify-start pt-6">
            <button
              onClick={onPrev}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span>←</span>
              <span>Voltar</span>
            </button>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
