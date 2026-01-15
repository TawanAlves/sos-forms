'use client';

import { MediopePrescriptionData } from '@/types/form';
import { StepWrapper } from '../common/StepWrapper';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from "../common/ButtonComp";

interface MediopePrescriptionStepProps {
  data: MediopePrescriptionData;
  onDataChange: (data: MediopePrescriptionData) => void;
  onNext?: () => void;
  onPrev?: () => void;
   onReturn?: () => void;
}

export function MediopePrescriptionStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  onReturn,
}: MediopePrescriptionStepProps) {
  const [localData, setLocalData] = useState<MediopePrescriptionData>(data);

  const handleChange = (field: keyof MediopePrescriptionData, value: string | string[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  const handlePrescriptionChange = (foot: 'right' | 'left', prescription: string, checked: boolean) => {
    const fieldName = foot === 'right' ? 'rightFootPrescriptions' : 'leftFootPrescriptions';
    const currentPrescriptions = localData[fieldName] || [];
    let newPrescriptions;

    if (checked) {
      newPrescriptions = [...currentPrescriptions, prescription];
    } else {
      newPrescriptions = currentPrescriptions.filter(p => p !== prescription);
    }

    handleChange(fieldName, newPrescriptions);
  };

  const handleReliefPointsChange = (material: string) => {
    // Permite selecionar apenas um material por vez
    if (localData.reliefPoints?.includes(material)) {
      // Se já está selecionado, remove (deseleciona)
      handleChange('reliefPoints', []);
    } else {
      // Se não está selecionado, substitui pela nova seleção
      handleChange('reliefPoints', [material]);
    }
  };

  const isValid = () => {
    return (localData.rightFootPrescriptions && localData.rightFootPrescriptions.length > 0) &&
      (localData.leftFootPrescriptions && localData.leftFootPrescriptions.length > 0);
  };

  const rightFootOptions = [
    { value: 'arco-longitudinal-medial-d', label: 'Arco Longitudinal Medial D', image: '/assets/images/ArcoLongitudinalMedialD.png' },
    { value: 'brc-barra-retro-capital-d', label: 'BRC - Barra Retro Capital D', image: '/assets/images/BRC-BarraRetroCapitalD.png' },
    { value: 'piloto-botao-retrocapital-d', label: 'Piloto ou Botão Retrocapital D', image: '/assets/images/PilotoouBotãoRetrocapitalD.png' },
    { value: 'eic-elemento-infra-cuboide-d', label: 'EIC - Elemento Infra Cubóide D', image: '/assets/images/EIC-ElementoInfraCubóideD.png' },
    { value: 'bacrd-barra-antero-calcanea-reta-d', label: 'BACrD - Barra Antero Calcânea Reta Direita', image: '/assets/images/BACrD-BarraAnteroCalcâneaRetaDireita.png' },
    { value: 'baccd-barra-antero-calcanea-curva', label: 'BACcD - Barra Antero Calcânea Curva', image: '/assets/images/BACcD-BarraAnteroCalcâneaCurva.png' },
    { value: 'abdutor-halux-d', label: 'Abdutor do Hálux D', image: '/assets/images/AbdutordoHáluxD.png' },
    // { value: 'peca-nao-encontrada-d', label: 'Você quer uma peça diferente? Descreva com detalhes.', image: null },
    { value: 'nao-se-aplica-d', label: 'Não desejo o elemento no Mediopé', image: null }
  ];

  const leftFootOptions = [
    { value: 'arco-longitudinal-medial-e', label: 'Arco Longitudinal Medial E', image: '/assets/images/ArcoLongitudinalMedialE.png' },
    { value: 'brc-barra-retro-capital-e', label: 'BRC - Barra Retro Capital E', image: '/assets/images/BRC-BarraRetroCapitalE.png' },
    { value: 'piloto-botao-retrocapital-e', label: 'Piloto ou Botão Retrocapital E', image: '/assets/images/PilotoouBotãoRetrocapitalE.png' },
    { value: 'bic-barra-infra-capital-e', label: 'BIC - Barra Infra Capital E', image: '/assets/images/BIC-BarraInfraCapitalE.png' },
    { value: 'eic-elemento-infra-cuboide-e', label: 'EIC - Elemento Infra Cubóide E', image: '/assets/images/EIC-ElementoInfraCubóideE.png' },
    { value: 'bacre-barra-antero-calcanea-reta', label: 'BACrE - Barra Antero Calcânea Reta', image: '/assets/images/BACrE-BarraAnteroCalcâneaReta.png' },
    { value: 'bacce-barra-antero-calcanea-curva', label: 'BACcE - Barra Antero Calcânea Curva', image: '/assets/images/BACcE-BarraAnteroCalcâneaCurva.png' },
    { value: 'abdutor-halux-e', label: 'Abdutor do Hálux E', image: '/assets/images/AbdutordoHáluxE.png' },
    // { value: 'peca-nao-encontrada-e', label: 'Você quer uma peça diferente? Descreva com detalhes.', image: null },
    { value: 'nao-se-aplica-e', label: 'Não desejo o elemento no Mediopé', image: null }
  ];

  return (
    <StepWrapper
      title="Prescrição Médiopé"
      subtitle="Configure as prescrições específicas para a região do médiopé"
      icon="🦶"
    >
      <div className="space-y-8">
        {/* Pergunta 1: Prescrição Pé Direito */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-6">
            Prescrição Médio Pé Direito <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-blue-700 mb-4">Você pode escolher mais de uma opção</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rightFootOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={option.value}
                  checked={localData.rightFootPrescriptions?.includes(option.value) || false}
                  onChange={(e) => handlePrescriptionChange('right', option.value, e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 "
                />
                <div className="flex-1">
                  {option.image && (
                    <div className="mb-3">
                      <Image
                        src={option.image}
                        alt={option.label}
                        width={200}
                        height={128}
                        className="w-full h-32 object-contain rounded"
                      />
                    </div>
                  )}
                  {option.value === 'peca-nao-encontrada-d' && (
                    <div className="text-center py-8 bg-gray-100 rounded mb-3">
                      <div className="text-2xl mb-2">🖼️</div>
                      <p className="text-sm text-gray-600">Sem imagem</p>
                    </div>
                  )}
                  {option.value === 'nao-se-aplica-d' && (
                    <div className="text-center py-8 bg-gray-100 rounded">
                      <div className="text-2xl mb-2">❌</div>
                    </div>
                  )}
                  <label htmlFor={option.value} className="font-medium text-gray-900 cursor-pointer text-sm">
                    {option.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pergunta 2: Peça podal Médiopé D não encontrada */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Você quer uma peça diferente? Descreva com detalhes.
          </h3>
          <textarea
            value={localData.rightFootCustomDescription}
            onChange={(e) => handleChange('rightFootCustomDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            rows={3}
            placeholder="Descreva aqui a peça específica para o médiopé direito..."
          />
        </div>

        {/* Pergunta 3: Prescrição Pé Esquerdo */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-6">
            Prescrição Médio Pé Esquerdo <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-green-700 mb-4">Você pode escolher mais de uma opção</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leftFootOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={option.value}
                  checked={localData.leftFootPrescriptions?.includes(option.value) || false}
                  onChange={(e) => handlePrescriptionChange('left', option.value, e.target.checked)}
                  className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <div className="flex-1">
                  {option.image && (
                    <div className="mb-3">
                      <Image
                        src={option.image}
                        alt={option.label}
                        width={200}
                        height={128}
                        className="w-full h-32 object-contain rounded"
                      />
                    </div>
                  )}
                  {option.value === 'peca-nao-encontrada-e' && (
                    <div className="text-center py-8 bg-gray-100 rounded mb-3">
                      <div className="text-2xl mb-2">🖼️</div>
                      <p className="text-sm text-gray-600">Sem imagem</p>
                    </div>
                  )}
                  {option.value === 'nao-se-aplica-e' && (
                    <div className="text-center py-8 bg-gray-100 rounded">
                      <div className="text-2xl mb-2">❌</div>
                    </div>
                  )}
                  <label htmlFor={option.value} className="font-medium text-gray-900 cursor-pointer text-sm">
                    {option.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pergunta 4: Peça podal Médiopé E não encontrada */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Você quer uma peça diferente? Descreva com detalhes.
          </h3>
          <textarea
            value={localData.leftFootCustomDescription}
            onChange={(e) => handleChange('leftFootCustomDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            rows={3}
            placeholder="Descreva aqui a peça específica para o médiopé esquerdo..."
          />
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
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4">
                       Quer Utilizar Poron ou PS SHOCK nas peças? Descreva o que você precisa.
          </h3>
          <textarea
            value={localData.materialsDescription}
            onChange={(e) => handleChange('materialsDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
            rows={4}
            placeholder="Descreva os locais específicos onde devem ser aplicados os materiais PORON ou PS SHOCK, especificando se é para o pé esquerdo ou direito..."
          />
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          {/* <button
            type="button"
            onClick={onPrev}
            className="px-6 py-3 rounded-lg font-medium transition-colors
                     text-gray-600 bg-gray-100 hover:bg-gray-200
                     flex items-center space-x-2"
          >
            <span>←</span>
            <span>Voltar</span>
          </button>
<Button isBack={false} onReturn={true} onClick={onReturn} />
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid()}
            className="px-6 py-3 rounded-lg font-medium transition-colors
                     text-white bg-gradient-to-r from-blue-500 to-blue-600
                     hover:from-blue-600 hover:to-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center space-x-2"
          >
            <span>Continuar</span>
            <span>→</span>
          </button> */}
           <Button isBack={true} onClick={onPrev} />
          <Button isBack={false} onReturn={true} onClick={onReturn} />
          <Button isBack={false} onClick={onNext} disabled={!isValid()} />
        </div>
      </div>
    </StepWrapper>
  );
}
