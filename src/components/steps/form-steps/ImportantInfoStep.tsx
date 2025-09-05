"use client";

import { ImportantInfoData } from "@/types/form";
import { StepWrapper } from "../common/StepWrapper";
import { useState } from "react";
import { Button } from "../common/ButtonComp";

interface ImportantInfoStepProps {
  data: ImportantInfoData;
  onDataChange: (data: ImportantInfoData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function ImportantInfoStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false,
}: ImportantInfoStepProps) {
  const [localData, setLocalData] = useState<ImportantInfoData>(data);

  const handleChange = (field: keyof ImportantInfoData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  return (
    <StepWrapper
      title="Informação Importante"
      subtitle="Adicione informações complementares e escolha sobre a camada de PORON"
      icon="ℹ️"
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-8">
        {/* Pergunta 1 - Informações Adicionais */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="additionalInfo"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Descreva aqui informações importantes relevantes não descritos nos
              itens acima ou fique a vontade para acrescentar mais informações.{" "}
              <span className="text-red-500">*</span>
            </label>
          </div>

          <div>
            <textarea
              id="additionalInfo"
              rows={6}
              value={localData.additionalInfo}
              onChange={(e) => handleChange("additionalInfo", e.target.value)}
              placeholder="Digite aqui informações adicionais, observações especiais, ou qualquer detalhe importante que não foi mencionado anteriormente..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-gray-900 ${
                localData.additionalInfo.trim() === ""
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {localData.additionalInfo.trim() === "" && (
              <p className="mt-1 text-sm text-red-600">
                Este campo é obrigatório
              </p>
            )}
          </div>
        </div>

        {/* Pergunta 2 - Camada de PORON */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">
              Deseja adicionar uma camada de PORON em toda a superfície da
              palmilha? <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opção NÃO */}
            <button
              type="button"
              onClick={() => handleChange("addPoronLayer", "no")}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  localData.addPoronLayer === "no"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${
                    localData.addPoronLayer === "no"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }
                `}
                >
                  {localData.addPoronLayer === "no" && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-lg font-bold text-gray-900">NÃO</span>
              </div>
              <p className="text-sm text-gray-600">
                Palmilha sem camada adicional de PORON
              </p>
            </button>

            {/* Opção SIM */}
            <button
              type="button"
              onClick={() => handleChange("addPoronLayer", "yes")}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  localData.addPoronLayer === "yes"
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${
                    localData.addPoronLayer === "yes"
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }
                `}
                >
                  {localData.addPoronLayer === "yes" && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-lg font-bold text-gray-900">SIM</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Adicionar camada de PORON em toda a superfície
              </p>
              <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3">
                <p className="text-sm font-medium text-yellow-800">
                  Taxa adicional de R$ 80,50
                </p>
                <p className="text-xs text-yellow-700">
                  Valor será adicionado ao total da palmilha
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between pt-6">
          <Button isBack={true} onClick={onPrev} />
          <Button isBack={false} onClick={onNext} />
        </div>
      </div>
    </StepWrapper>
  );
}
