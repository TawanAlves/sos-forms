'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StepWrapper } from '../common/StepWrapper';
import type { BaseStepProps } from '@/types/steps';
import type { RetropePrescriptionData } from '@/types/form';
import { Button } from "../common/ButtonComp";

interface RetropePrescriptionOption {
  id: string;
  label: string;
  image: string | null;
  detail: string;
}

interface RetropePrescriptionStepProps extends Omit<BaseStepProps<RetropePrescriptionData>, 'onUpdate'> {
  onDataChange: (data: RetropePrescriptionData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onReturn?: () => void;
}

const retropePrescriptionOptions: RetropePrescriptionOption[] = [
  {
    id: 'CACVLG3D',
    label: 'Cunha Ante Calcâneo',
    image: '/assets/images/retropes/CunhaAnteCalcaneo.png',
    detail: '',
  },
   {
    id: 'CACVR3D5MTT',
    label: 'Cunha Ante Calcâneo',
    image: '/assets/images/retropes/CunhaAnteCalcaneoVaro2.png',
    detail: '',
  },
  {
    id: 'CACVR3D5MTT2',
    label: 'Cunha Ante Calcâneo',
    image: '/assets/images/retropes/CunhaAnteCalcaneoVaro.png',
    detail: '',
  },
  {
    id: 'ESTBCALCD',
    label: 'Estabilizador de Calcâneo',
    image: '/assets/images/retropes/EstabilizadordeCalcaneo.png',
    detail: '',
  },
  {
    id: 'calco-1mm',
    label: 'Calço',
    image: '/assets/images/retropes/Calco.png',
    detail: '',
  },
  {
    id: 'nao-se-aplica',
    label: 'Não desejo elemento no retropé',
    image: null,
    detail: '',
    }
];

const retropeLeftFootOptions: RetropePrescriptionOption[] = [

   {
    id: 'CACVLG3D-e',
    label: 'Cunha Ante Calcâneo',
    image: '/assets/images/retropes/CunhaAnteCalcaneo.png',
    detail: '',
  },
   {
    id: 'CACVR3D5MTT-e',
    label: 'Cunha Ante Calcâneo',
    image: '/assets/images/retropes/CunhaAnteCalcaneoVaro2.png',
    detail: '',
  },
  {
    id: 'CACVR3D5MTT-e2',
    label: 'Cunha Ante Calcâneo',
    image: '/assets/images/retropes/CunhaAnteCalcaneoVaro.png',
    detail: '',
  },
  {
    id: 'ESTBCALCD-e',
    label: 'Estabilizador de Calcâneo',
    image: '/assets/images/retropes/EstabilizadordeCalcaneo.png',
    detail: '',
  },
  {
    id: 'calco-1mm-e',
    label: 'Calço',
    image: '/assets/images/retropes/Calco.png',
    detail: '',
  },
  {
    id: 'nao-se-aplica-e',
    label: 'Não desejo elemento no retropé',
    image: null,
    detail: '',
    }
];

export function RetropePrescriptionStep({ data, onDataChange, onNext, onPrev, onReturn }: RetropePrescriptionStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localData] = useState({
    reliefPoints: data.reliefPoints || []
  });

  const [thicknessRight, setThicknessRight] = useState<Record<string, string>>({});

  const handleThicknessChange = (prescriptionId: string, value: string) => {
    setThicknessRight(prev => ({
      ...prev,
      [prescriptionId]: value
    }));
  };

  const handleChange = (field: keyof RetropePrescriptionData, value: string | string[]) => {
    onDataChange({
      ...data,
      [field]: value
    });
  };

  const handleRightFootChange = (prescriptionId: string) => {
    const currentSelections = data.rightFootPrescription || [];
    let newSelections;

    if (currentSelections.includes(prescriptionId)) {
      // Remove se já estiver selecionado
      newSelections = currentSelections.filter(id => id !== prescriptionId);
    } else {
      // Adiciona se não estiver selecionado
      newSelections = [...currentSelections, prescriptionId];
    }

    onDataChange({
      ...data,
      rightFootPrescription: newSelections
    });

    // Limpa erro quando uma seleção é feita
    if (errors.rightFoot) {
      setErrors(prev => ({ ...prev, rightFoot: '' }));
    }
  };

  const handleLeftFootSecondChange = (prescriptionId: string) => {
    const currentSelections = data.leftFootSecondPrescription || [];
    let newSelections;

    if (currentSelections.includes(prescriptionId)) {
      // Remove se já estiver selecionado
      newSelections = currentSelections.filter(id => id !== prescriptionId);
    } else {
      // Adiciona se não estiver selecionado
      newSelections = [...currentSelections, prescriptionId];
    }

    onDataChange({
      ...data,
      leftFootSecondPrescription: newSelections
    });

    // Limpa erro quando uma seleção é feita
    if (errors.leftFootSecond) {
      setErrors(prev => ({ ...prev, leftFootSecond: '' }));
    }
  };

  const handleTextAreaChange = (field: keyof RetropePrescriptionData, value: string) => {
    onDataChange({
      ...data,
      [field]: value
    });
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

  // const validateForm = (): boolean => {
  //   const newErrors: Record<string, string> = {};

  //   if (!data.rightFootPrescription || data.rightFootPrescription.length === 0) {
  //     newErrors.rightFoot = 'Selecione pelo menos uma prescrição para o pé direito';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleNext = () => {
  //   if (validateForm() && onNext) {
  //     onNext();
  //   }
  // };

  // const PrescriptionOption = ({ option, selectedValues, onSelect }: {
  //   option: typeof retropePrescriptionOptions[0];
  //   selectedValues: string[];
  //   onSelect: (id: string) => void;
  // }) => {
  //   const isSelected = selectedValues.includes(option.id);

  const PrescriptionOption = ({ 
  option, 
  selectedValues, 
  onSelect 
}: {
  option: RetropePrescriptionOption;
  selectedValues: string[];
  onSelect: (id: string) => void;
}) => {
  const isSelected = selectedValues.includes(option.id);
  // Removed unused variable 'isThicknessRelevant'

    return (
      <div 
       className={`relative grid grid-cols-2 border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-300 hover:border-gray-400'
          }`}
        onClick={() => onSelect(option.id)}
        >
      <div
        className={`relative`}
      >
       
        {/* Imagem */}
        {option.image ? (
          <div className="mb-3 flex justify-center">
            <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={option.image}
                alt={option.label}
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>
          </div>
        ) : (option.id === 'nao-se-aplica' || option.id === 'nao-se-aplica-e') ? (
          <div className="text-center py-8 bg-gray-100 rounded">
            <div className="text-2xl mb-2">❌</div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-100 rounded mb-3">
            <div className="text-2xl mb-2">🖼️</div>
            <p className="text-sm text-gray-600">Sem imagem</p>
          </div>
        )}

        {/* Label */}
        <div className="text-center">
          <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'
            }`}>
            {option.label}
          </p>
        </div>
         
      {/* </div>
 {/* Epessura da peça 
 {option.id === 'nao-se-aplica' ? "":  
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ESCREVA A ESPESSURA DA PEÇA
            </label>
            <textarea
              value={data.notFoundRightFootDescription}
              onChange={(e) => handleTextAreaChange('notFoundRightFootDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Espessura da peça..."
            />
          </div>
          }
           Checkbox
        <div className="absolute top-3 right-3">
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
              }`}
          >
            {isSelected && (
              <div className="text-white text-xs">✓</div>
            )} */}
      </div>
        {/* Coluna 2 - Espessura (só aparece se selecionado e for relevante) */}
      <div className="">
        {/* {isSelected && isThicknessRelevant && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ESPESSURA DA PEÇA
            </label>
            <textarea
              value={thicknessRight[option.id] || ''}
              onChange={(e) => handleThicknessChange(option.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}          
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
              placeholder="Ex: 5 mm na borda medial&#10;ou 3–7 mm progressivo..."
            />
          </div>
        )} */}
        
     { option.id === 'nao-se-aplica' || option.id === 'nao-se-aplica-e' ? "" :
     <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      ESPESSURA DA PEÇA
    </label>
    <textarea
      defaultValue={thicknessRight[option.id] || ''}          // ← valor inicial
      // onChange={(e) => {
      //   // Opcional: debounce leve só para atualizar preview (se quiser ver em tempo real)
      //   // Mas o ideal é NÃO atualizar estado aqui
      // }}
      onBlur={(e) => {
        const newValue = e.target.value.trim();
        if (newValue !== (thicknessRight[option.id] || '')) {
          handleThicknessChange(option.id, newValue);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
      placeholder="Ex: 5 mm na borda medial\nou 3–7 mm progressivo..."
    />
  </div>}
         
        {/* {!isSelected && isThicknessRelevant && (
          <div className="text-sm text-gray-500 italic self-center mt-4">
            Selecione para informar espessura
          </div>
        )} */}
        {/* Checkbox no canto */}
      <div className="absolute top-3 right-3">
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center text-sm font-bold ${
            isSelected 
              ? 'border-blue-600 bg-blue-600 text-white' 
              : 'border-gray-400'
          }`}
        >
          {isSelected && '✓'}
          </div>
        </div>
      </div>
      </div>
    );
  };

  return (
    <StepWrapper
      title="Prescrição Retropé"
      subtitle="Escolha as correções para cada pé"
    >
      <div className="space-y-8">
        {/* Pergunta 1: Prescrição Retropé Direito */}
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-6">
            Prescrição Retropé Direito <span className="text-red-500">*</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
             {/* md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 */}
            {retropePrescriptionOptions.map((option) => (
              <PrescriptionOption
                key={`right-${option.id}`}
                option={option}
                selectedValues={data.rightFootPrescription || []}
                onSelect={handleRightFootChange}
              />
            ))}
          </div>

          {errors.rightFoot && (
            <p className="mt-2 text-sm text-red-600">{errors.rightFoot}</p>
          )}
        </div>

        {/* Pergunta 2: Calço de... */}
        {/* <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Calço de...
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva o tipo de calço personalizado
            </label>
            <textarea
              value={data.calcoCustomDescription}
              onChange={(e) => handleTextAreaChange('calcoCustomDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Ex: Calço de 15mm, Calço anatômico, Calço específico para..."
            />
          </div>
        </div> */}

        {/* Pergunta 3: Peça podal Retropé D não encontrada */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Você quer uma peça diferente? Descreva com detalhes.
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva a peça podal específica para o pé direito
            </label>
            <textarea
              value={data.notFoundRightFootDescription}
              onChange={(e) => handleTextAreaChange('notFoundRightFootDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Descreva detalhadamente a peça podal que não foi encontrada para o pé direito..."
            />
          </div>
        </div>

        {/* Pergunta 4: Prescrição Retropé Esquerdo */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-6">
            Prescrição Retropé Esquerdo <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {retropeLeftFootOptions.map((option) => (
              <PrescriptionOption
                key={`left-${option.id}`}
                option={option}
                selectedValues={data.leftFootSecondPrescription || []}
                onSelect={handleLeftFootSecondChange}
              />
            ))}
          </div>
          {errors.leftFootSecond && (
            <p className="mt-2 text-sm text-red-600">{errors.leftFootSecond}</p>
          )}
        </div>

        {/* Pergunta 5: Calço de... */}
        {/* <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Calço de...
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva o tipo de calço personalizado
            </label>
            <textarea
              value={data.calcoLeftDescription || ''}
              onChange={(e) => handleTextAreaChange('calcoLeftDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Ex: Calço de 15mm, Calço anatômico, Calço específico para..."
            />
          </div>
        </div> */}
        {/* TODO: ver esse */}
         {/* Pergunta 8: Peça podal Retropé E não encontrada */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Você quer uma peça diferente? Descreva com detalhes.
          </h3>
          <textarea
            value={data.leftFootNotFoundDescription || ''}
            onChange={(e) => handleTextAreaChange('leftFootNotFoundDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            rows={3}
            placeholder="Descreva aqui a peça específica para o retropé esquerdo..."
          />
        </div>


        {/* Pergunta 6: Pontos de Alívio - CUT OUT - Depressão */}
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
        {/* Pergunta 7: Descrição dos locais */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quer Utilizar Poron ou PS SHOCK nas peças? Descreva o que você precisa.
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especifique os locais e lateralidade para aplicação dos materiais
            </label>
            <textarea
              value={data.materialsLocationDescription || ''}
              onChange={(e) => handleTextAreaChange('materialsLocationDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Ex: PORON no calcâneo direito, PS SHOCK na região do antepé esquerdo..."
            />
          </div>
        </div>

       
        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          {/* <button
            onClick={onPrev}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span>←</span>
            <span className="ml-1">Voltar</span>
          </button>
          <Button isBack={false} onReturn={true} onClick={onReturn} />
          <button 
            onClick={handleNext}
            disabled={!data.rightFootPrescription || data.rightFootPrescription.length === 0}
            className={`px-6 py-2 rounded-lg transition-colors ${data.rightFootPrescription && data.rightFootPrescription.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            <span>Continuar</span>
            <span className="ml-1">→</span>
          </button> */}

          <Button isBack={true} onClick={onPrev} />
          <Button isBack={false} onReturn={true} onClick={onReturn} />
          <Button isBack={false} onClick={onNext} disabled={!data.rightFootPrescription || data.rightFootPrescription.length === 0} />
        </div>
      </div>
    </StepWrapper>
  );
}
