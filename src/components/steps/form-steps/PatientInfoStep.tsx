"use client";

import React, { useState } from "react";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { PatientData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface PatientInfoStepProps
  extends Omit<BaseStepProps<PatientData>, "onUpdate"> {
  onDataChange: (data: PatientData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function PatientInfoStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: PatientInfoStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PatientData, string>>
  >({});



  const handleInputChange = (field: keyof PatientData, value: string) => {
    let processedValue = value;

    
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
    const newErrors: Partial<Record<keyof PatientData, string>> = {};
    
    if (!data) return false;


    // Validação do nome profissional
    if (!data.patientName.trim()) {
      newErrors.patientName =
        "Nome do Profissional/Consultório é obrigatório";
    } else if (data.patientName.trim().length < 2) {
      newErrors.patientName = "Nome deve ter pelo menos 2 caracteres";
    }

     if (!data.patienteWeight.trim()) {
      newErrors.patienteWeight =
        "Nome do Profissional/Consultório é obrigatório";
    } else if (data.patienteWeight.trim().length < 2) {
      newErrors.patienteWeight = "Nome deve ter pelo menos 2 caracteres";
    }


     if (!data.patienteHeight.trim()) {
      newErrors.patienteHeight =
        "Nome do Profissional/Consultório é obrigatório";
    } else if (data.patienteHeight.trim().length < 2) {
      newErrors.patienteHeight = "Nome deve ter pelo menos 2 caracteres";
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
      title="Dados do Paciente"
      subtitle="Preencha com os seus dados corretamente"
      showUnsavedChangesNotification={hasUnsavedChanges}
    >
      <div className="space-y-6">

        {/* Nome do Paciente */}
        <div>
          <label
            htmlFor="patientName"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Nome do Paciente{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="patientName"
            value={data.patientName || ""}
            onChange={(e) =>
              handleInputChange("patientName", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.patientName
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="João Silva"
          />
          {errors.patientName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.patientName}
            </p>
          )}
        </div>

{/* Altura do Paciente */}
           <div>
          <label
            htmlFor="patienteHeight"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Altura do Paciente{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="patienteHeight"
            value={data.patienteHeight || ""}
            onChange={(e) =>
              handleInputChange("patienteHeight", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.patienteHeight
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="173cm"
          />
          {errors.patienteHeight && (
            <p className="mt-1 text-sm text-red-600">
              {errors.patienteHeight}
            </p>
          )}
        </div>


        {/*  Peso do Paciente */}

           <div>
          <label
            htmlFor="patienteWeight"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Peso do Paciente{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="patienteWeight"
            value={data.patienteWeight || ""}
            onChange={(e) =>
              handleInputChange("patienteWeight", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.patienteWeight
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="75kg"
          />
          {errors.patienteWeight && (
            <p className="mt-1 text-sm text-red-600">
              {errors.patienteWeight}
            </p>
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
