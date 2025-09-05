"use client";

import { DedoPrescriptionData } from "@/types/form";
import { StepWrapper } from "../common/StepWrapper";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../common/ButtonComp";

interface DedoPrescriptionStepProps {
  data: DedoPrescriptionData;
  onDataChange: (data: DedoPrescriptionData) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function DedoPrescriptionStep({
  data,
  onDataChange,
  onNext,
  onPrev,
}: DedoPrescriptionStepProps) {
  const [localData, setLocalData] = useState<DedoPrescriptionData>(data);

  const handleChange = (
    field: keyof DedoPrescriptionData,
    value: string | string[]
  ) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  const handleReliefPointsChange = (material: string) => {
    // Permite selecionar apenas um material por vez
    if (localData.reliefPoints?.includes(material)) {
      // Se já está selecionado, remove (deseleciona)
      handleChange("reliefPoints", []);
    } else {
      // Se não está selecionado, substitui pela nova seleção
      handleChange("reliefPoints", [material]);
    }
  };

  const isValid = () => {
    return localData.correction;
  };

  return (
    <StepWrapper
      title="Prescrição Dedo"
      subtitle="Configure as prescrições específicas para a região do antepé"
      icon="🦶"
    >
      <div className="space-y-8">
        {/* todo: fazer frase da pergunta e do placeholder com Ia para ficar mais completo */}
        {/* Pergunta 6: Descrição dos materiais */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4">
            Explique aqui a sua correção
          </h3>
          <textarea
            value={localData.correction}
            onChange={(e) => handleChange("correction", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
            rows={4}
            placeholder="Explique aqui a sua correção."
          />
        </div>
        {/* Pergunta 5: Pontos de Alívio - CUT OUT - Depressão */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-6">
            Pontos de Alívio - CUT OUT - Depressão
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PORON */}
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="poron"
                name="reliefMaterial"
                checked={localData.reliefPoints?.includes("poron") || false}
                onChange={() => handleReliefPointsChange("poron")}
                className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
              />
              <div className="flex-1">
                <div className="mb-3">
                  <Image
                    src="/assets/images/common/PORON.png"
                    alt="PORON"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <label
                  htmlFor="poron"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  PORON
                </label>
              </div>
            </div>

            {/* PS SHOCK */}
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="ps-shock"
                name="reliefMaterial"
                checked={localData.reliefPoints?.includes("ps-shock") || false}
                onChange={() => handleReliefPointsChange("ps-shock")}
                className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
              />
              <div className="flex-1">
                <div className="mb-3">
                  <Image
                    src="/assets/images/common/PSSHOCK.png"
                    alt="PS SHOCK"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <label
                  htmlFor="ps-shock"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  PS SHOCK
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Pergunta 6: Descrição dos materiais */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4">
            Descreva aqui os locais para utilizar os materiais PORON ou PS SHOCK
            (Esquerdo ou Direito)
          </h3>
          <textarea
            value={localData.materialsDescription}
            onChange={(e) =>
              handleChange("materialsDescription", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
            rows={4}
            placeholder="Descreva os locais específicos onde devem ser aplicados os materiais PORON ou PS SHOCK, especificando se é para o pé esquerdo ou direito..."
          />
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button isBack={true} onClick={onPrev} />
          <Button isBack={false} onClick={onNext} disabled={!isValid()} />
        </div>
      </div>
    </StepWrapper>
  );
}
