"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { NavicularMeasurementData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface FootMeasurementsStepProps
  extends Omit<BaseStepProps<NavicularMeasurementData>, "onUpdate"> {
  onDataChange: (data: NavicularMeasurementData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function FootMeasurementsStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: FootMeasurementsStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof NavicularMeasurementData, string>>
  >({});

  const handleInputChange = (
    field: keyof NavicularMeasurementData,
    value: string
  ) => {
    // Remove caracteres não numéricos e permite apenas números e vírgula/ponto
    const cleanValue = value.replace(/[^0-9.,]/g, "").replace(",", ".");

    onDataChange({
      ...data,
      [field]: cleanValue,
    });

    // Remove erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateMeasurement = (value: string): boolean => {
    if (!value.trim()) return false;
    // [ALTERAÇÃO] Alterado para máximo 2 dígitos conforme solicitado
    if (value.length > 3) return false; // Máximo 2 dígitos
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 10; // Valores razoáveis entre 0 e 10 cm
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NavicularMeasurementData, string>> =
      {};

    // Validação pé direito sentado
    if (!validateMeasurement(data.rightFootSitting)) {
      newErrors.rightFootSitting = "Medida obrigatória (0-10 cm, máximo 2 dígitos)";
    }

    // Validação pé direito em pé
    if (!validateMeasurement(data.rightFootStanding)) {
      newErrors.rightFootStanding = "Medida obrigatória (0-10 cm, máximo 2 dígitos)";
    }

    // Validação pé esquerdo sentado
    if (!validateMeasurement(data.leftFootSitting)) {
      newErrors.leftFootSitting = "Medida obrigatória (0-10 cm, máximo 2 dígitos)";
    }

    // Validação pé esquerdo em pé
    if (!validateMeasurement(data.leftFootStanding)) {
      newErrors.leftFootStanding = "Medida obrigatória (0-10 cm, máximo 2 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && onNext) {
      onNext();
    }
  };

  const calculateDifference = (sitting: string, standing: string): string => {
    const sittingNum = parseFloat(sitting);
    const standingNum = parseFloat(standing);

    if (isNaN(sittingNum) || isNaN(standingNum)) return "-";

    const difference = Math.abs(sittingNum - standingNum);
    return `${difference.toFixed(1)} cm`;
  };

  const getDifferenceStatus = (
    sitting: string,
    standing: string
  ): "normal" | "attention" | "neutral" => {
    const sittingNum = parseFloat(sitting);
    const standingNum = parseFloat(standing);

    if (isNaN(sittingNum) || isNaN(standingNum)) return "neutral";

    const difference = Math.abs(sittingNum - standingNum);

    if (difference <= 1.0) return "normal";
    return "attention";
  };

  return (
    <StepWrapper
      title="Medição Navicular"
      subtitle="Mensure a altura do solo até o navicular na posição sentada e solicite ao paciente que fique em pé e meça novamente. Calcule a distância entre os pontos nas duas posições (sentado e em pé). Valor de normalidade: 1,0 cm."
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-8">
        {/* Imagem explicativa da medição */}
        <div className="bg-gray-100 rounded-lg p-4 text-center flex">
          <div className="relative w-full h-64 rounded overflow-hidden">
            <Image
              src="/assets/images/common/passo4.png"
              alt="Imagem explicativa da medição navicular"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-full h-64 rounded overflow-hidden">
            <Image
              src="/assets/images/common/passo5.png"
              alt="Imagem explicativa da medição navicular"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Pé Direito */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            PÉ DIREITO
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pé direito sentado */}
            <div>
              <label
                htmlFor="rightFootSitting"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                PÉ DIREITO - SENTADO <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Distância em centímetros do Navicular ao solo (sentado) - Imagem
                A
              </p>
              <div className="relative">
                <input
                  type="text"
                  id="rightFootSitting"
                  value={data.rightFootSitting || ""}
                  onChange={(e) =>
                    handleInputChange("rightFootSitting", e.target.value)
                  }
                  maxLength={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                    errors.rightFootSitting
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-3 text-gray-500 text-sm">
                  cm
                </span>
              </div>
              {errors.rightFootSitting && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.rightFootSitting}
                </p>
              )}
            </div>

            {/* Pé direito em pé */}
            <div>
              <label
                htmlFor="rightFootStanding"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                PÉ DIREITO - EM PÉ <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Distância em centímetros do Navicular ao solo (em pé) - Imagem B
              </p>
              <div className="relative">
                <input
                  type="text"
                  id="rightFootStanding"
                  value={data.rightFootStanding || ""}
                  onChange={(e) =>
                    handleInputChange("rightFootStanding", e.target.value)
                  }
                  maxLength={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                    errors.rightFootStanding
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-3 text-gray-500 text-sm">
                  cm
                </span>
              </div>
              {errors.rightFootStanding && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.rightFootStanding}
                </p>
              )}
            </div>
          </div>

          {/* Diferença pé direito */}
          {data.rightFootSitting && data.rightFootStanding && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Diferença (Pé Direito):
                </span>
                <span
                  className={`text-sm font-semibold ${
                    getDifferenceStatus(
                      data.rightFootSitting,
                      data.rightFootStanding
                    ) === "normal"
                      ? "text-green-600"
                      : getDifferenceStatus(
                          data.rightFootSitting,
                          data.rightFootStanding
                        ) === "attention"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {calculateDifference(
                    data.rightFootSitting,
                    data.rightFootStanding
                  )}
                  {getDifferenceStatus(
                    data.rightFootSitting,
                    data.rightFootStanding
                  ) === "normal" && " ✓ Normal"}
                  {getDifferenceStatus(
                    data.rightFootSitting,
                    data.rightFootStanding
                  ) === "attention" && " ⚠ Acima do normal"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pé Esquerdo */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            PÉ ESQUERDO
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pé esquerdo sentado */}
            <div>
              <label
                htmlFor="leftFootSitting"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                PÉ ESQUERDO - SENTADO <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Distância em centímetros do Navicular ao solo (sentado) - Imagem
                A
              </p>
              <div className="relative">
                <input
                  type="text"
                  id="leftFootSitting"
                  value={data.leftFootSitting || ""}
                  onChange={(e) =>
                    handleInputChange("leftFootSitting", e.target.value)
                  }
                  maxLength={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                    errors.leftFootSitting
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-3 text-gray-500 text-sm">
                  cm
                </span>
              </div>
              {errors.leftFootSitting && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.leftFootSitting}
                </p>
              )}
            </div>

            {/* Pé esquerdo em pé */}
            <div>
              <label
                htmlFor="leftFootStanding"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                PÉ ESQUERDO - EM PÉ <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Distância em centímetros do Navicular ao solo (em pé) - Imagem B
              </p>
              <div className="relative">
                <input
                  type="text"
                  id="leftFootStanding"
                  value={data.leftFootStanding || ""}
                  onChange={(e) =>
                    handleInputChange("leftFootStanding", e.target.value)
                  }
                  maxLength={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                    errors.leftFootStanding
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-3 text-gray-500 text-sm">
                  cm
                </span>
              </div>
              {errors.leftFootStanding && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.leftFootStanding}
                </p>
              )}
            </div>
          </div>

          {/* Diferença pé esquerdo */}
          {data.leftFootSitting && data.leftFootStanding && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Diferença (Pé Esquerdo):
                </span>
                <span
                  className={`text-sm font-semibold ${
                    getDifferenceStatus(
                      data.leftFootSitting,
                      data.leftFootStanding
                    ) === "normal"
                      ? "text-green-600"
                      : getDifferenceStatus(
                          data.leftFootSitting,
                          data.leftFootStanding
                        ) === "attention"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {calculateDifference(
                    data.leftFootSitting,
                    data.leftFootStanding
                  )}
                  {getDifferenceStatus(
                    data.leftFootSitting,
                    data.leftFootStanding
                  ) === "normal" && " ✓ Normal"}
                  {getDifferenceStatus(
                    data.leftFootSitting,
                    data.leftFootStanding
                  ) === "attention" && " ⚠ Acima do normal"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Informação sobre normalidade */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Valor de normalidade: 1,0 cm
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Diferenças maiores que 1,0 cm podem indicar alterações no arco
                plantar.
              </p>
            </div>
          </div>
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
