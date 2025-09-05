"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { PalmilhaPrescriptionData } from "@/types/form";

interface PalmilhaPrescriptionStepProps
  extends Omit<BaseStepProps<PalmilhaPrescriptionData>, "onUpdate"> {
  onDataChange: (data: PalmilhaPrescriptionData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

type PrescriptionOption = {
  value: PalmilhaPrescriptionData["selectedArea"];
  label: string;
  description: string;
  imagePath: string;
};

const prescriptionOptions: PrescriptionOption[] = [
  {
    value: "conforto",
    label: "Conforto",
    description: "Moldada - Uso diário",
    imagePath: "/assets/images/common/ConfortoMoldada.png",
  },
  {
    value: "antepe",
    label: "Antepé",
    description: "Correção específica",
    imagePath: "/assets/images/common/Antepe.png",
  },
  {
    value: "mediope",
    label: "Médiopé",
    description: "Correção específica",
    imagePath: "/assets/images/common/Mediope.png",
  },
  {
    value: "retrope",
    label: "Retropé",
    description: "Correção específica",
    imagePath: "/assets/images/common/Retropes.png",
  },
  {
    value: "finalizada",
    label: "Prescrição Finalizada",
    description: "Completa",
    imagePath: "/assets/images/common/PrescricaoFinalizada.svg",
  },
  {
    value: "dedos",
    label: "Dedos",
    description: "Completa",
    imagePath: "/assets/images/common/Dedo.png",
    //mudar imagem
    //add input para explicar correção e escolher ps shock e poron
  },
  {
    value: "sos",
    label: "SOS PALMILHAS (nós prescrevemos baseados nos dados enviados)",
    description: "Completa",
    imagePath: "/assets/images/common/logo.svg",
    //mudar imagem
    //tem mais 2 etapas, uma de perguntas
  },
];

export function PalmilhaPrescriptionStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: PalmilhaPrescriptionStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PalmilhaPrescriptionData, string>>
  >({});

  const handleAreaChange = (
    selectedArea: PalmilhaPrescriptionData["selectedArea"]
  ) => {
    onDataChange({
      ...data,
      selectedArea,
      corrections: [], // Reset corrections when changing area
    });

    // Remove erro quando o usuário faz uma seleção
    if (errors.selectedArea) {
      setErrors((prev) => ({
        ...prev,
        selectedArea: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PalmilhaPrescriptionData, string>> =
      {};

    if (!data.selectedArea) {
      newErrors.selectedArea = "Selecione uma área para prescrição";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && onNext) {
      onNext();
    }
  };

  const selectedOption = prescriptionOptions.find(
    (option) => option.value === data.selectedArea
  );

  return (
    <StepWrapper
      title="Prescrição de PALMILHAS"
      subtitle="Selecione a área para aplicar correções ou finalize a prescrição"
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-6">
        {/* Imagem de referência */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gray-50 rounded-lg p-4 shadow-md">
            <div className="relative w-full h-48">
              <Image
                src="/assets/images/common/ListaSolaDosPes.png"
                alt="Sola dos pés"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              📋 Use esta lista como referência para selecionar as áreas de
              correção
            </p>
          </div>
        </div>

        {/* Grid de opções de prescrição */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptionOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-xl border-2 transition-all hover:shadow-xl ${
                data.selectedArea === option.value
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handleAreaChange(option.value)}
            >
              {/* Header com radio button */}
              <div className="flex justify-end p-3 pb-0">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    data.selectedArea === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {data.selectedArea === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>

              {/* Imagem */}
              <div className="px-6 pb-4">
                <div className="relative w-full h-32 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={option.imagePath}
                    alt={option.label}
                    fill
                    className="object-contain p-2"
                    sizes="200px"
                  />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="px-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-600 text-center leading-tight">
                  {option.description}
                </p>
              </div>

              {/* Input hidden para acessibilidade */}
              <input
                type="radio"
                name="selectedArea"
                value={option.value}
                checked={data.selectedArea === option.value}
                onChange={() => handleAreaChange(option.value)}
                className="sr-only"
                aria-label={`${option.label} - ${option.description}`}
              />
            </div>
          ))}
        </div>

        {/* Erro de validação */}
        {errors.selectedArea && (
          <div className="text-center">
            <p className="text-sm text-red-600">{errors.selectedArea}</p>
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
                  Área Selecionada: {selectedOption.label}
                </h4>
                <p className="text-sm text-green-800">
                  {selectedOption.description}
                </p>
                {selectedOption.value === "finalizada" && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800">
                    ✓ Sua prescrição está completa e pronta para processamento.
                  </div>
                )}
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
                💡 Instruções de Prescrição:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Conforto/Moldada:</strong> Para casos sem
                  necessidade de correção específica
                </li>
                <li>
                  • <strong>Antepé:</strong> Correções na parte frontal do pé
                  (dedos e metatarsos)
                </li>
                <li>
                  • <strong>Médiopé:</strong> Correções na região central (arco
                  longitudinal)
                </li>
                <li>
                  • <strong>Retropés:</strong> Correções na parte posterior
                  (calcanhar e tornozelo)
                </li>
                <li>
                  • <strong>Prescrição Finalizada:</strong> Use quando já
                  definiu todas as correções
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span>←</span>
            <span>Voltar</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!data.selectedArea}
            className={`px-6 py-2 rounded-lg transition-colors ${
              data.selectedArea
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {data.selectedArea === "finalizada"
              ? "Finalizar Prescrição"
              : "Continuar"}
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
