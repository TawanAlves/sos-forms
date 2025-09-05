"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { PrintingModelData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface CustomizationStepProps
  extends Omit<BaseStepProps<PrintingModelData>, "onUpdate"> {
  onDataChange: (data: PrintingModelData) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function CustomizationStep({
  data,
  onDataChange,
  onNext,
  onPrev,
}: CustomizationStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PrintingModelData, string>>
  >({});

  const handleModelChange = (modelType: "cnc" | "printer3d") => {
    onDataChange({
      ...data,
      modelType,
    });

    // Remove erro quando o usuário faz uma seleção
    if (errors.modelType) {
      setErrors((prev) => ({
        ...prev,
        modelType: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PrintingModelData, string>> = {};

    if (!data.modelType) {
      newErrors.modelType = "Selecione um modelo de impressão";
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
      title="Modelo de Impressão"
      subtitle="Escolha o modelo de Impressão 3D / Material da Palmilha"
    >
      <div className="space-y-6">
        {/* Opções de modelo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opção 1: Fresadora CNC */}
          <div
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              data.modelType === "cnc"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handleModelChange("cnc")}
          >
            {/* Radio button */}
            <div className="absolute top-4 right-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  data.modelType === "cnc"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {data.modelType === "cnc" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            {/* Imagem */}
            <div className="mb-4 flex justify-center">
              <div className="relative w-56 h-40 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/common/fresadoraCNC.png"
                  alt="Fresadora CNC"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 224px"
                />
              </div>
            </div>

            {/* Título e descrição */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fresadora CNC
              </h3>
              <p className="text-sm text-gray-600 mb-3">Material EVA</p>

              {/* Características */}
              <div className="text-left">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Características:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Material EVA de alta qualidade</li>
                  <li>• Precisão milimétrica</li>
                  <li>• Durabilidade superior</li>
                  <li>• Acabamento profissional</li>
                  <li>• Indicado para uso intenso</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Opção 2: Impressora 3D */}
          {/* <div
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              data.modelType === "printer3d"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handleModelChange("printer3d")}
          >
           --- Radio button --
            <div className="absolute top-4 right-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  data.modelType === "printer3d"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {data.modelType === "printer3d" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

           --- Imagem --
            <div className="mb-4 flex justify-center">
              <div className="relative w-56 h-40 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/common/impressora3D.png"
                  alt="Impressora 3D"
                  fill
                  className="object-contain p-2 grayscale"
                  sizes="(max-width: 768px) 100vw, 224px"
                />
              </div>
            </div>

           --- Título e descrição --
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                Impressora 3D
              </h3>
              <p className="text-sm text-gray-600 mb-3">Material TPU</p>

             --- Características --
              <div className="text-left">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Características:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Material TPU flexível</li>
                  <li>• Personalização avançada</li>
                  <li>• Estruturas complexas</li>
                  <li>• Flexibilidade otimizada</li>
                  <li>• Tecnologia de ponta</li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>

        {/* Erro de validação */}
        {errors.modelType && (
          <div className="text-center">
            <p className="text-sm text-red-600">{errors.modelType}</p>
          </div>
        )}

        {/* Informações sobre a escolha */}
        {data.modelType && (
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
                <h4 className="text-sm font-semibold text-green-900 mb-1">
                  {data.modelType === "cnc"
                    ? "Fresadora CNC Selecionada"
                    : "Impressora 3D Selecionada"}
                </h4>
                <p className="text-sm text-green-800">
                  {data.modelType === "cnc"
                    ? "Suas palmilhas serão produzidas em material EVA através de fresadora CNC, garantindo precisão e durabilidade."
                    : "Suas palmilhas serão produzidas em material TPU através de impressão 3D, oferecendo flexibilidade e personalização avançada."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          <Button isBack={true} onClick={onPrev} />
          <Button
            isBack={false}
            onClick={handleNext}
            disabled={!data.modelType}
          />
        </div>
      </div>
    </StepWrapper>
  );
}
