"use client";

import { SosPrescriptionData } from "@/types/form";
import { StepWrapper } from "../common/StepWrapper";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../common/ButtonComp";

interface SosPrescriptionStepProps {
  data: SosPrescriptionData;
  onDataChange: (data: SosPrescriptionData) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function SosPrescriptionStep({
  data,
  onDataChange,
  onNext,
  onPrev,
}: SosPrescriptionStepProps) {
  const [localData, setLocalData] = useState<SosPrescriptionData>(data);

  const handleChange = (
    field: keyof SosPrescriptionData,
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
      title="Prescrição SOS"
      subtitle="Configure as prescrições específicas para a região do antepé"
      icon="🦶"
    >
      <div className="space-y-8">
        {/* todo: fazer frase da pergunta e do placeholder com Ia para ficar mais completo */}
        {/* Pergunta 6: Descrição dos materiais */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-black mb-4">
            HD - Hipótese Diagnóstica
          </h3>
          <textarea
            value={localData.diagnosticHypothesis}
            onChange={(e) =>
              handleChange("diagnosticHypothesis", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-purple-500 text-black"
            rows={4}
            placeholder="Explique aqui a sua correção."
          />
        </div>

        {/* Pergunta 6: Descrição dos materiais */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-black mb-4">
            Queixa Principal
          </h3>
          <textarea
            value={localData.mainComplaint}
            onChange={(e) => handleChange("mainComplaint", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-purple-500 text-black"
            rows={4}
            placeholder="Explique aqui a sua correção."
          />
        </div>

        {/* Pergunta 6: Descrição dos materiais */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-black mb-4">
            Histórico do Paciente
          </h3>
          <textarea
            value={localData.patientHistory}
            onChange={(e) => handleChange("patientHistory", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-purple-500 text-black"
            rows={4}
            placeholder="Explique aqui a sua correção."
          />
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-black mb-4">Jack Test</h3>
          <div className="mb-3 flex justify-center h-[16rem]">
            <div className="relative w-full h-full rounded-lg overflow-hidden flex">
              <Image
                src="/assets/images/jacktest.png"
                alt="jack-test"
                className="w-full h-full object-contain rounded"
                width={200}
                height={128}
              />
            </div>
          </div>

          <div className="flex justify-between">
            {/* Pé Esquerdo */}
            <div className="mb-4">
              <h4 className="text-md font-semibold text-black mb-2">
                Pé Esquerdo
              </h4>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="leftFoot"
                    value="flexivel"
                    checked={localData.leftFoot === "flexivel"}
                    onChange={(e) => handleChange("leftFoot", e.target.value)}
                  />
                  <span className="text-black">
                    Flexível (Positivo: elevação do arco e Inversão)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="leftFoot"
                    value="rigido"
                    checked={localData.leftFoot === "rigido"}
                    onChange={(e) => handleChange("leftFoot", e.target.value)}
                  />
                  <span className="text-black">
                    Rígido (Negativo: elevação do arco e Inversão)
                  </span>
                </label>
              </div>
            </div>

            {/* Pé Direito */}
            <div className="mb-4">
              <h4 className="text-md font-semibold text-black mb-2">
                Pé Direito
              </h4>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rightFoot"
                    value="flexivel"
                    checked={localData.rightFoot === "flexivel"}
                    onChange={(e) => handleChange("rightFoot", e.target.value)}
                  />
                  <span className="text-black">
                    Flexível (Positivo: elevação do arco e Inversão)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rightFoot"
                    value="rigido"
                    checked={localData.rightFoot === "rigido"}
                    onChange={(e) => handleChange("rightFoot", e.target.value)}
                  />
                  <span className="text-black">
                    Rígido (Negativo: elevação do arco e Inversão)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Pergunta 6: Descrição dos materiais */}
        <div className="border border-gray-200 rounded-lg p-6 flex justify-between gap-3">
          <div className="w-full">
            <h3 className="text-lg font-bold text-black mb-4">
              Lung Test Esquerdo{" "}
            </h3>

            <div className="mb-3 flex justify-center h-[16rem]">
              <div className="relative w-full h-full rounded-lg overflow-hidden flex">
                <Image
                  src="/assets/images/lung-test-left.jpg"
                  alt="lung-test-left"
                  className="w-full h-full object-contain rounded"
                  width={200}
                  height={128}
                />
              </div>
            </div>
            <textarea
              value={localData.correction}
              onChange={(e) => handleChange("correction", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-purple-500 text-black"
              rows={4}
              placeholder="Explique aqui a sua correção."
            />
          </div>
          <div className="w-full">
            <h3 className="text-lg font-bold text-black mb-4">
              Lung Test Direito
            </h3>

            <div className="mb-3 flex justify-center h-[16rem]">
              <div className="relative w-full h-full rounded-lg overflow-hidden flex">
                <Image
                  src="/assets/images/lung-test-right.png"
                  alt="lung-test-right"
                  className="w-full h-full object-contain rounded"
                  width={200}
                  height={128}
                />
              </div>
            </div>
            <textarea
              value={localData.rightLungTest} // Mudei para uma nova propriedade
              onChange={(e) => handleChange("rightLungTest", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-purple-500 text-black"
              rows={4}
              placeholder="Explique aqui a sua correção."
            />
          </div>
        </div>

        {/* Pergunta 5: Pontos de Alívio - CUT OUT - Depressão */}
         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-900 mb-6">
                  Pontos de Alívio - CUT OUT 
                </h3>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      
                {/* Sem Preenchimento */}
                   <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id="noCoverage"
                      name="reliefMaterial"
                      checked={localData.reliefPoints?.includes("noCoverage") || false}
                      onChange={() => handleReliefPointsChange("noCoverage")}
                      className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                    />
                    <div className="flex-1">
                      <div className="mb-3">
                         <div className="text-2xl w-full h-32 object-contain mb-2 flex justify-center items-center">❌</div>
                      </div>
                      <label
                        htmlFor="noCoverage"
                        className="font-medium text-gray-900 cursor-pointer"
                      >
                        Sem Cobertura
                      </label>
                    </div>
                  </div>
                </div>
              </div>
        {/* Pergunta 6: Descrição dos materiais */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-black mb-4">
            Quer Utilizar Poron ou PS SHOCK nas peças? Descreva o que você precisa.
          </h3>
          <textarea
            value={localData.materialsDescription}
            onChange={(e) =>
              handleChange("materialsDescription", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-purple-500 text-black"
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
