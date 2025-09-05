"use client";

import { AntepePrescriptionData } from "@/types/form";
import { StepWrapper } from "../common/StepWrapper";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../common/ButtonComp";

interface AntepePrescriptionStepProps {
  data: AntepePrescriptionData;
  onDataChange: (data: AntepePrescriptionData) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function AntepePrescriptionStep({
  data,
  onDataChange,
  onNext,
  onPrev,
}: AntepePrescriptionStepProps) {
  const [localData, setLocalData] = useState<AntepePrescriptionData>(data);

  const handleChange = (
    field: keyof AntepePrescriptionData,
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
    return localData.rightFootPrescription && localData.leftFootPrescription;
  };

  return (
    <StepWrapper
      title="Prescrição Antepés"
      subtitle="Configure as prescrições específicas para a região do antepé"
      icon="🦶"
    >
      <div className="space-y-8">
        {/* Prescrição Pé Direito */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-6">
            Prescrição Pé Direito <span className="text-red-500">*</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BIC - Barra Infra Capital D */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                localData.rightFootPrescription === "bic-barra-infra-capital-d"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() =>
                handleChange(
                  "rightFootPrescription",
                  "bic-barra-infra-capital-d"
                )
              }
            >
              <div className="text-center">
                <div className="mb-3">
                  <Image
                    src="/assets/images/BIC-BarraInfraCapitalD.png"
                    alt="BIC - Barra Infra Capital D"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <p className="font-medium text-gray-900">
                  BIC - Barra Infra Capital D
                </p>
              </div>
            </div>

            {/* CUT OUT D */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                localData.rightFootPrescription === "cut-out-d"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleChange("rightFootPrescription", "cut-out-d")}
            >
              <div className="text-center">
                <div className="mb-3">
                  <Image
                    src="/assets/images/CUTOUTD.png"
                    alt="CUT OUT D"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <p className="font-medium text-gray-900">CUT OUT D</p>
              </div>
            </div>

            {/* Não se aplica */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                localData.rightFootPrescription === "nao-se-aplica"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() =>
                handleChange("rightFootPrescription", "nao-se-aplica")
              }
            >
              <div className="text-center py-8">
                <div className="text-2xl mb-2">❌</div>
                <p className="font-medium text-gray-900">Não se aplica</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pergunta 2: Peça podal Antepé D não encontrada */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Peça podal Antepé D não encontrada (descreva a peça)
          </h3>
          <textarea
            value={localData.rightFootCustomDescription}
            onChange={(e) =>
              handleChange("rightFootCustomDescription", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            rows={3}
            placeholder="Descreva aqui a peça específica para o pé direito..."
          />
        </div>

        {/* Prescrição Pé Esquerdo */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-6">
            Prescrição Pé Esquerdo <span className="text-red-500">*</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BIC - Barra Infra Capital E */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                localData.leftFootPrescription === "bic-barra-infra-capital-e"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
              onClick={() =>
                handleChange(
                  "leftFootPrescription",
                  "bic-barra-infra-capital-e"
                )
              }
            >
              <div className="text-center">
                <div className="mb-3">
                  <Image
                    src="/assets/images/BIC-BarraInfraCapitalE.png"
                    alt="BIC - Barra Infra Capital E"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <p className="font-medium text-gray-900">
                  BIC - Barra Infra Capital E
                </p>
              </div>
            </div>

            {/* CUT OUT E */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                localData.leftFootPrescription === "cut-out-e"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
              onClick={() => handleChange("leftFootPrescription", "cut-out-e")}
            >
              <div className="text-center">
                <div className="mb-3">
                  <Image
                    src="/assets/images/CUTOUTE.png"
                    alt="CUT OUT E"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <p className="font-medium text-gray-900">CUT OUT E</p>
              </div>
            </div>

            {/* Não se aplica */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                localData.leftFootPrescription === "nao-se-aplica"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
              onClick={() =>
                handleChange("leftFootPrescription", "nao-se-aplica")
              }
            >
              <div className="text-center py-8">
                <div className="text-2xl mb-2">❌</div>
                <p className="font-medium text-gray-900">Não se aplica</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pergunta 4: Peça podal Antepé E não encontrada */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Peça podal Antepé E não encontrada (descreva a peça)
          </h3>
          <textarea
            value={localData.leftFootCustomDescription}
            onChange={(e) =>
              handleChange("leftFootCustomDescription", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            rows={3}
            placeholder="Descreva aqui a peça específica para o pé esquerdo..."
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
