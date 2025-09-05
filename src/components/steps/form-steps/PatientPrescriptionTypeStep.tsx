"use client";

import React from "react";
import Image from "next/image";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { PrescriptionData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface PatientPrescriptionTypeStepProps
  extends Omit<BaseStepProps<PrescriptionData>, "onUpdate"> {
  onDataChange: (data: PrescriptionData) => void;
  onNext?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function PatientPrescriptionTypeStep({
  data,
  onDataChange,
  onNext,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: PatientPrescriptionTypeStepProps) {
  const handleOptionSelect = (prescriptionType: "self" | "team") => {
    onDataChange({
      ...data,
      prescriptionType,
    });
  };

  return (
    <StepWrapper 
      title="Prescrição" 
      subtitle="Escolha o tipo de Prescrição"
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-6">
        {/* Opção 1: Prescreva você mesmo */}
        <div
          className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-md ${
            data.prescriptionType === "self"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => handleOptionSelect("self")}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Prescreva você mesmo
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Você mesmo irá prescrever com base em suas necessidades
              </p>
            </div>
            <div className="ml-4 flex items-center">
              {/* Imagem para "Prescreva você mesmo" */}
              <div className="mb-4 relative w-full h-32">
                <Image
                  src="/assets/images/common/voceMesmo.png"
                  alt="Você mesmo prescreve"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Radio button */}
              <div className="ml-6">
                <input
                  type="radio"
                  name="prescriptionType"
                  value="self"
                  checked={data.prescriptionType === "self"}
                  onChange={() => handleOptionSelect("self")}
                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opção 2: Nossa equipe irá prescrever */}
        <div
          className={`relative rounded-lg border-2 p-6 transition-all opacity-50 cursor-not-allowed ${"border-gray-300 bg-gray-100"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-500">
                Nossa equipe irá prescrever
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Nossa equipe irá prescrever baseado nas informações enviadas
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  Valor adicional de R$ 100,00
                </span>
              </div>
            </div>
            <div className="ml-4 flex items-center">
              {/* Imagem para "Nossa equipe irá prescrever" */}
              <div className="h-20 w-20 rounded-xl overflow-hidden relative bg-gray-100 shadow-md border border-gray-300">
                <Image
                  src="/assets/images/common/equipePrescreve.png"
                  alt="Nossa equipe irá prescrever"
                  fill
                  className="object-contain p-2 opacity-50"
                />
              </div>
              {/* Radio button */}
              <div className="ml-6">
                <input
                  type="radio"
                  name="prescriptionType"
                  value="team"
                  checked={false}
                  disabled
                  className="h-5 w-5 text-gray-400 border-gray-300 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botão Continuar - só aparece se uma opção foi selecionada */}
        {data.prescriptionType && (
          <div className="flex justify-end pt-6">
            {data.prescriptionType && (
              <div className="flex justify-end pt-6">
                <Button isBack={false} onClick={onNext} />
              </div>
            )}
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
