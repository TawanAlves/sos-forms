"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { SapatoInteiraData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface SapatoInteiraStepProps
  extends Omit<BaseStepProps<SapatoInteiraData>, "onUpdate"> {
  onDataChange: (data: SapatoInteiraData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

type CoverageOption = {
  value: SapatoInteiraData["coverageType"];
  label: string;
  imagePath: string;
};

const coverageOptions: CoverageOption[] = [
  {
    value: "cobertura-1",
    label: "Tecido Perfurado Preto Fosco",
    imagePath: "/assets/images/TecidoPerfuradoPretoFosco.png",
  },
  {
    value: "cobertura-2",
    label: "Tecido Perfurado Preto Brilhante",
    imagePath: "/assets/images/TecidoPerfuradoPretoBrilhante.png",
  },
  {
    value: "cobertura-3",
    label: "Tecido Perfurado Nude Fosco",
    imagePath: "/assets/images/TecidoPerfuradoNudeFosco.png",
  },
  {
    value: "cobertura-4",
    label: "Tecido Nude Perfurado Brilhante",
    imagePath: "/assets/images/TecidoNudePerfuradoBrilhante.png",
  },
];

export function Palmilha3x4Step({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: SapatoInteiraStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof SapatoInteiraData, string>>
  >({});

  const handleInputChange = (field: keyof SapatoInteiraData, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    });

    if (errors[field]) {
      // Remove erro quando o usuário faz alteração
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SapatoInteiraData, string>> = {};

    if (!data.quantity) {
      newErrors.quantity = "Selecione a quantidade de palmilhas";
    }

    if (!data.braSize) {
      newErrors.braSize = "Selecione a numeração BRA";
    }

    if (!data.measurements?.trim()) {
      newErrors.measurements = "Informe as medidas da palmilha";
    }
    // else if (data.measurements.trim().length < 5) {
    //   newErrors.measurements = "Medida deve ser mais detalhada (ex: 300x100x4)";
    // }

    if (!data.coverageType) {
      newErrors.coverageType = "Selecione um tipo de cobertura";
    }

    if (!data.nextAction) {
      newErrors.nextAction = "Selecione uma opção para continuar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && onNext) {
      onNext();
    }
  };

  // Gerar opções de quantidade (1 a 10)
  const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  // Gerar opções de numeração BRA (25 a 53)
  const braSizeOptions = Array.from({ length: 29 }, (_, i) => i + 25);

  return (
    <StepWrapper
      title="Especificações da Palmilha 3/4"
      subtitle="Configure as especificações para a palmilha selecionada"
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-8">
        {/* Pergunta 1: Quantidade */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Quantidade de Palmilhas (par){" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            id="quantity"
            value={data.quantity || ""}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.quantity
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <option value="">Selecione a quantidade</option>
            {quantityOptions.map((num) => (
              <option key={num} value={num.toString()}>
                {num} par{num > 1 ? "es" : ""}
              </option>
            ))}
          </select>
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        {/* Pergunta 2: Numeração BRA */}
        <div>
          <label
            htmlFor="braSize"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Numeração BRA - da Palmilha 3/4 (correspondente ao tamanho do sapato
            inteira) <span className="text-red-500">*</span>
          </label>
          <select
            id="braSize"
            value={data.braSize || ""}
            onChange={(e) => handleInputChange("braSize", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.braSize
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <option value="">Selecione a numeração</option>
            {braSizeOptions.map((size) => (
              <option key={size} value={size.toString()}>
                {size}
              </option>
            ))}
          </select>
          {errors.braSize && (
            <p className="mt-1 text-sm text-red-600">{errors.braSize}</p>
          )}
        </div>

        {/* Pergunta 3: Medidas */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Mensurar a distância do calcâneo até a cabeça do 1º metatarso (art.
            metatarso-falangiana) <span className="text-red-500">*</span>
          </label>
          {/* <p className="text-sm text-gray-600 mb-2">
            Comprimento X largura na região dos metatarsos X espessura
          </p> */}

          <div className="mb-4 flex justify-center gap-10">
            <div className="relative w-80 h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="/assets/images/palmilha-3x4.jpg"
                alt="Exemplo de medida da palmilha"
                fill
                className="object-contain p-2"
                sizes="320px"
              />
            </div>
            <div className="relative w-80 h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="/assets/images/palmilha-3x4.jpg"
                alt="Exemplo de medida da palmilha"
                fill
                className="object-contain p-2"
                sizes="320px"
              />
              <Image
                src="/assets/images/foot-palmilha-3x4.jpg"
                alt="foot-palmilha-3x4"
                fill
                className="object-contain p-2"
                sizes="320px"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="300"
                value={data.measurements?.split("x")[0] || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  const parts = data.measurements?.split("x") || ["", "", ""];
                  parts[0] = value;
                  handleInputChange("measurements", parts.join("x"));
                }}
                onKeyPress={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                  errors.measurements
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              <label className="block text-xs text-gray-500 mt-1 text-center">
                Distância
              </label>
            </div>
          </div>

          {errors.measurements && (
            <p className="mt-1 text-sm text-red-600">{errors.measurements}</p>
          )}
        </div>

        {/* Pergunta 4: Tipo de Cobertura */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">
            Tipo de Cobertura <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {coverageOptions.map((option) => (
              <div
                key={option.value}
                className={`relative cursor-pointer rounded-xl border-2 transition-all hover:shadow-xl ${
                  data.coverageType === option.value
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleInputChange("coverageType", option.value)}
              >
                {/* Header com radio button */}
                <div className="flex justify-end p-3 pb-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      data.coverageType === option.value
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {data.coverageType === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>

                {/* Imagem */}
                <div className="px-6 pb-4">
                  <div className="relative w-full h-40 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                    <Image
                      src={option.imagePath}
                      alt={option.label}
                      fill
                      className="object-contain p-3"
                      sizes="300px"
                    />
                  </div>
                </div>

                {/* Label */}
                <div className="px-6 pb-6">
                  <h4 className="text-sm font-bold text-gray-900 text-center leading-tight">
                    {option.label}
                  </h4>
                </div>

                {/* Input hidden para acessibilidade */}
                <input
                  type="radio"
                  name="coverageType"
                  value={option.value}
                  checked={data.coverageType === option.value}
                  onChange={() =>
                    handleInputChange("coverageType", option.value)
                  }
                  className="sr-only text-gray-900"
                  aria-label={option.label}
                />
              </div>
            ))}
          </div>

          {errors.coverageType && (
            <p className="mt-2 text-sm text-red-600">{errors.coverageType}</p>
          )}
        </div>

        {/* Pergunta 5: Próxima ação */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">
            Escolha uma opção <span className="text-red-500">*</span>
          </label>

          <div className="space-y-3">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                data.nextAction === "finalizadas"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handleInputChange("nextAction", "finalizadas")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    data.nextAction === "finalizadas"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {data.nextAction === "finalizadas" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Palmilhas Finalizadas
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ir para prescrição das peças podais
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                data.nextAction === "acrescentar"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handleInputChange("nextAction", "acrescentar")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    data.nextAction === "acrescentar"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {data.nextAction === "acrescentar" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  {/* Todo: apesar de ecolher esse, tá indo pro mesmo canto */}
                  <h4 className="text-lg font-bold text-gray-900">
                    Acrescentar outro tipo de Palmilhas
                  </h4>
                  <p className="text-sm text-gray-600">
                    Adicionar mais palmilhas ao pedido
                  </p>
                </div>
              </div>
            </div>
          </div>

          {errors.nextAction && (
            <p className="mt-2 text-sm text-red-600">{errors.nextAction}</p>
          )}
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
