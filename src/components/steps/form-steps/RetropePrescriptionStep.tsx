'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StepWrapper } from '../common/StepWrapper';
import type { BaseStepProps } from '@/types/steps';
import type { RetropePrescriptionData } from '@/types/form';

interface RetropePrescriptionOption {
  id: string;
  label: string;
  image: string | null;
}

interface RetropePrescriptionStepProps extends Omit<BaseStepProps<RetropePrescriptionData>, 'onUpdate'> {
  onDataChange: (data: RetropePrescriptionData) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const retropePrescriptionOptions: RetropePrescriptionOption[] = [
  {
    id: 'CACVLG3D',
    label: 'CACVLG3D - Cunha Ante Calcâneo Valgo D 3mm',
    image: '/assets/images/retropes/CACVLG3D-CunhaAnteCalcâneoValgoD3mm.png'
  },
  {
    id: 'CACVLG4D',
    label: 'CACVLG4D - Cunha Ante Calcâneo Valgo D 4mm',
    image: '/assets/images/retropes/CACVLG4D-CunhaAnteCalcâneoValgoD4mm.png'
  },
  {
    id: 'CACVLG5D',
    label: 'CACVLG5D - Cunha Ante Calcâneo Valgo D 5mm',
    image: '/assets/images/retropes/CACVLG5D-CunhaAnteCalcâneoValgoD5mm.png'
  },
  {
    id: 'CACVLG6D',
    label: 'CACVLG6D - Cunha Ante Calcâneo Valgo D 6mm',
    image: '/assets/images/retropes/CACVLG6D-CunhaAnteCalcâneoValgoD6mm.png'
  },
  {
    id: 'CACVLG7D',
    label: 'CACVLG7D - Cunha Ante Calcâneo Valgo D 7mm',
    image: '/assets/images/retropes/CACVLG7D-CunhaAnteCalcâneoValgoD7mm.png'
  },
  {
    id: 'CACVLG8D',
    label: 'CACVLG8D - Cunha Ante Calcâneo Valgo D 8mm',
    image: '/assets/images/retropes/CACVLG8D-CunhaAnteCalcâneoValgoD8mm.png'
  },
  {
    id: 'CACVLG9D',
    label: 'CACVLG9D - Cunha Ante Calcâneo Valgo D 9mm',
    image: '/assets/images/retropes/CACVLG9D-CunhaAnteCalcâneoValgoD9mm.png'
  },
  {
    id: 'CACVLG10D',
    label: 'CACVLG10D - Cunha Ante Calcâneo Valgo D 10mm',
    image: '/assets/images/retropes/CACVLG10D-CunhaAnteCalcâneoValgoD10mm.png'
  },
  {
    id: 'CACVR3D',
    label: 'CACVR3D - Cunha Ante Calcâneo Varo D 3mm',
    image: '/assets/images/retropes/CACVR3D-CunhaAnteCalcâneoVaroD3mm.png'
  },
  {
    id: 'CACVR4D',
    label: 'CACVR4D - Cunha Ante Calcâneo Varo D 4mm',
    image: '/assets/images/retropes/CACVR4D-CunhaAnteCalcâneoVaroD4mm.png'
  },
  {
    id: 'CACVR5D',
    label: 'CACVR5D - Cunha Ante Calcâneo Varo D 5mm',
    image: '/assets/images/retropes/CACVR5D-CunhaAnteCalcâneoVaroD5mm.png'
  },
  {
    id: 'CACVR6D',
    label: 'CACVR6D - Cunha Ante Calcâneo Varo D 6mm',
    image: '/assets/images/retropes/CACVR6D-CunhaAnteCalcâneoVaroD6mm.png'
  },
  {
    id: 'CACVR7D',
    label: 'CACVR7D - Cunha Ante Calcâneo Varo D 7mm',
    image: '/assets/images/retropes/CACVR7D-CunhaAnteCalcâneoVaroD7mm.png'
  },
  {
    id: 'CACVR8D',
    label: 'CACVR8D - Cunha Ante Calcâneo Varo D 8mm',
    image: '/assets/images/retropes/CACVR8D-CunhaAnteCalcâneoVaroD8mm.png'
  },
  {
    id: 'CACVR9D',
    label: 'CACVR9D - Cunha Ante Calcâneo Varo D 9mm',
    image: '/assets/images/retropes/CACVR9D-CunhaAnteCalcâneoVaroD9mm.png'
  },
  {
    id: 'CACVR10D',
    label: 'CACVR10D - Cunha Ante Calcâneo Varo D 10mm',
    image: '/assets/images/retropes/CACVR10D-CunhaAnteCalcâneoVaroD10mm.png'
  },
  {
    id: 'CACVR3D5MTT',
    label: 'CACVR3D5ºMTT - Cunha Ante Calcâneo Varo 3mm D até 5º MTT',
    image: '/assets/images/retropes/CACVR3D5MTT-CunhaAnteCalcâneoVaro3mmDaté5MTT.png'
  },
  {
    id: 'CACVR4D5MTT',
    label: 'CACVR4D5ºMTT - Cunha Ante Calcâneo Varo 4mm D até 5º MTT',
    image: '/assets/images/retropes/CACVR4D5MTT-CunhaAnteCalcâneoVaro4mmDaté5MTT.png'
  },
  {
    id: 'CACVR5D5MTT',
    label: 'CACVR5D5ºMTT - Cunha Ante Calcâneo Varo 5mm D até 5º MTT',
    image: '/assets/images/retropes/CACVR5D5MTT-CunhaAnteCalcâneoVaro5mmDaté5MTT.png'
  },
  {
    id: 'CACVR6D5MTT',
    label: 'CACVR6D5ºMTT - Cunha Ante Calcâneo Varo 6mm D até 5º MTT',
    image: '/assets/images/retropes/CACVR5D6MTT-CunhaAnteCalcâneoVaro6mmDaté5MTT.png'
  },
  {
    id: 'ESTBCALCD',
    label: 'ESTB CALC D - Estabilizador de Calcâneo D',
    image: '/assets/images/retropes/ESTBCALCD-EstabilizadordeCalcâneoD.png'
  },
  {
    id: 'calco-1mm',
    label: 'Calço 1mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-2mm',
    label: 'Calço 2mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-3mm',
    label: 'Calço 3mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-4mm',
    label: 'Calço 4mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-5mm',
    label: 'Calço 5mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-6mm',
    label: 'Calço 6mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-7mm',
    label: 'Calço 7mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-8mm',
    label: 'Calço 8mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-9mm',
    label: 'Calço 9mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-10mm',
    label: 'Calço 10mm',
    image: '/assets/images/retropes/Calcado1mm.png'
  },
  {
    id: 'calco-custom',
    label: 'Calço de...',
    image: null
  },
  {
    id: 'nao-encontrada',
    label: 'Peça não encontrada (descreva a peça podal no item "Peça podal não encontrada")',
    image: null
  },
  {
    id: 'nao-se-aplica',
    label: 'Não se aplica',
    image: null
  }
];

const retropeLeftFootOptions: RetropePrescriptionOption[] = [
  {
    id: 'CACVLG3E',
    label: 'CACVLG3E - Cunha Ante Calcâneo Valgo E 3mm',
    image: '/assets/images/retropes/CACVLG3E-CunhaAnteCalcâneoValgoE3mm.png'
  },
  {
    id: 'CACVLG4E',
    label: 'CACVLG4E - Cunha Ante Calcâneo Valgo E 4mm',
    image: '/assets/images/retropes/CACVLG4E-CunhaAnteCalcâneoValgoE4mm.png'
  },
  {
    id: 'CACVLG5E',
    label: 'CACVLG5E - Cunha Ante Calcâneo Valgo E 5mm',
    image: '/assets/images/retropes/CACVLG5E-CunhaAnteCalcâneoValgoE5mm.png'
  },
  {
    id: 'CACVLG6E',
    label: 'CACVLG6E - Cunha Ante Calcâneo Valgo E 6mm',
    image: '/assets/images/retropes/CACVLG6E-CunhaAnteCalcâneoValgoE6mm.png'
  },
  {
    id: 'CACVLG7E',
    label: 'CACVLG7E - Cunha Ante Calcâneo Valgo E 7mm',
    image: '/assets/images/retropes/CACVLG7E-CunhaAnteCalcâneoValgoE7mm.png'
  },
  {
    id: 'CACVLG8E',
    label: 'CACVLG8E - Cunha Ante Calcâneo Valgo E 8mm',
    image: '/assets/images/retropes/CACVLG8E-CunhaAnteCalcâneoValgoE8mm.png'
  },
  {
    id: 'CACVLG9E',
    label: 'CACVLG9E - Cunha Ante Calcâneo Valgo E 9mm',
    image: '/assets/images/retropes/CACVLG9E-CunhaAnteCalcâneoValgoE9mm.png'
  },
  {
    id: 'CACVLG10E',
    label: 'CACVLG10E - Cunha Ante Calcâneo Valgo E 10mm',
    image: '/assets/images/retropes/CACVLG10E-CunhaAnteCalcâneoValgoE10mm.png'
  },
  {
    id: 'CACVR3E',
    label: 'CACVR3E - Cunha Ante Calcâneo Varo E 3mm',
    image: '/assets/images/retropes/CACVR3E-CunhaAnteCalcâneoVaroE3mm.png'
  },
  {
    id: 'CACVR4E',
    label: 'CACVR4E - Cunha Ante Calcâneo Varo E 4mm',
    image: '/assets/images/retropes/CACVR4E-CunhaAnteCalcâneoVaroE4mm.png'
  },
  {
    id: 'CACVR5E',
    label: 'CACVR5E - Cunha Ante Calcâneo Varo E 5mm',
    image: '/assets/images/retropes/CACVR5E-CunhaAnteCalcâneoVaroE5mm.png'
  },
  {
    id: 'CACVR6E',
    label: 'CACVR6E - Cunha Ante Calcâneo Varo E 6mm',
    image: '/assets/images/retropes/CACVR6E-CunhaAnteCalcâneoVaroE6mm.png'
  },
  {
    id: 'CACVR7E',
    label: 'CACVR7E - Cunha Ante Calcâneo Varo E 7mm',
    image: '/assets/images/retropes/CACVR7E-CunhaAnteCalcâneoVaroE7mm.png'
  },
  {
    id: 'CACVR8E',
    label: 'CACVR8E - Cunha Ante Calcâneo Varo E 8mm',
    image: '/assets/images/retropes/CACVR8E-CunhaAnteCalcâneoVaroE8mm.png'
  },
  {
    id: 'CACVR9E',
    label: 'CACVR9E - Cunha Ante Calcâneo Varo E 9mm',
    image: '/assets/images/retropes/CACVR9E-CunhaAnteCalcâneoVaroE9mm.png'
  },
  {
    id: 'CACVR10E',
    label: 'CACVR10E - Cunha Ante Calcâneo Varo E 10mm',
    image: '/assets/images/retropes/CACVR10E-CunhaAnteCalcâneoVaroE10mm.png'
  },
  {
    id: 'CACVR-E-5MTT',
    label: 'CACVR - Cunha Ante Calcâneo Varo E até 5º MTT',
    image: '/assets/images/retropes/CACVR-CunhaAnteCalcâneoVaroEaté5MTT.png'
  },
  {
    id: 'CACVR3E5MTT',
    label: 'CACVR3E5ºMTT - Cunha Ante Calcâneo Varo 3mm E até 5º MTT',
    image: null
  },
  {
    id: 'CACVR4E5MTT',
    label: 'CACVR4E5ºMTT - Cunha Ante Calcâneo Varo 4mm E até 5º MTT',
    image: null
  },
  {
    id: 'CACVR5E5MTT',
    label: 'CACVR5E5ºMTT - Cunha Ante Calcâneo Varo 5mm E até 5º MTT',
    image: null
  },
  {
    id: 'CACVR6E5MTT',
    label: 'CACVR6E5ºMTT - Cunha Ante Calcâneo Varo 6mm E até 5º MTT',
    image: null
  },
  {
    id: 'ESTBCALCE',
    label: 'ESTB CALC E - Estabilizador de Calcâneo E',
    image: '/assets/images/retropes/ESTBCALCE-EstabilizadordeCalcâneoE.png'
  },
  {
    id: 'calco-e-1mm',
    label: 'Calço 1mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-2mm',
    label: 'Calço 2mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-3mm',
    label: 'Calço 3mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-4mm',
    label: 'Calço 4mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-5mm',
    label: 'Calço 5mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-6mm',
    label: 'Calço 6mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-7mm',
    label: 'Calço 7mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-8mm',
    label: 'Calço 8mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-9mm',
    label: 'Calço 9mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-10mm',
    label: 'Calço 10mm',
    image: '/assets/images/retropes/CalçoE1mm.png'
  },
  {
    id: 'calco-e-custom',
    label: 'Calço de...',
    image: null
  },
  {
    id: 'nao-encontrada-e',
    label: 'Peça não encontrada (descreva a peça podal no item "Peça podal não encontrada")',
    image: null
  },
  {
    id: 'nao-se-aplica-e',
    label: 'Não se aplica',
    image: null
  }
];

export function RetropePrescriptionStep({ data, onDataChange, onNext, onPrev }: RetropePrescriptionStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localData, setLocalData] = useState({
    reliefPoints: data.reliefPoints || []
  });

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.rightFootPrescription || data.rightFootPrescription.length === 0) {
      newErrors.rightFoot = 'Selecione pelo menos uma prescrição para o pé direito';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && onNext) {
      onNext();
    }
  };

  const PrescriptionOption = ({ option, selectedValues, onSelect }: {
    option: typeof retropePrescriptionOptions[0];
    selectedValues: string[];
    onSelect: (id: string) => void;
  }) => {
    const isSelected = selectedValues.includes(option.id);

    return (
      <div
        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-300 hover:border-gray-400'
          }`}
        onClick={() => onSelect(option.id)}
      >
        {/* Checkbox */}
        <div className="absolute top-3 right-3">
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
              }`}
          >
            {isSelected && (
              <div className="text-white text-xs">✓</div>
            )}
          </div>
        </div>

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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
        <div className="border-t pt-8">
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
        </div>

        {/* Pergunta 3: Peça podal Retropé D não encontrada */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Peça podal Retropé D não encontrada (descreva a peça)
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
        <div className="border-t pt-8">
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
        </div>

        {/* Pergunta 6: Pontos de Alívio - CUT OUT - Depressão */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-6">
            Pontos de Alívio - CUT OUT - Depressão
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PORON */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${localData.reliefPoints?.[0] === 'poron'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-300'
                }`}
              onClick={() => {
                const newPoints = localData.reliefPoints?.[0] === 'poron' ? [] : ['poron'];
                const updatedLocalData = { ...localData, reliefPoints: newPoints };
                setLocalData(updatedLocalData);
                onDataChange({
                  ...data,
                  reliefPoints: newPoints
                } as RetropePrescriptionData);
              }}
            >
              <div className="text-center">
                <div className="mb-3">
                  <Image
                    src="/assets/images/common/PORON.png"
                    alt="PORON"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <p className="font-medium text-gray-900">PORON</p>
              </div>
            </div>

            {/* PS SHOCK */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${localData.reliefPoints?.[0] === 'ps-shock'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-300'
                }`}
              onClick={() => {
                const newPoints = localData.reliefPoints?.[0] === 'ps-shock' ? [] : ['ps-shock'];
                const updatedLocalData = { ...localData, reliefPoints: newPoints };
                setLocalData(updatedLocalData);
                onDataChange({
                  ...data,
                  reliefPoints: newPoints
                } as RetropePrescriptionData);
              }}
            >
              <div className="text-center">
                <div className="mb-3">
                  <Image
                    src="/assets/images/common/PSSHOCK.png"
                    alt="PS SHOCK"
                    width={200}
                    height={128}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
                <p className="font-medium text-gray-900">PS SHOCK</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pergunta 7: Descrição dos locais */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Descreva aqui os locais para utilizar os materiais PORON ou PS SHOCK (Esquerdo ou Direito)
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

        {/* Pergunta 8: Peça podal Retropé E não encontrada */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Peça podal Retropé E não encontrada (descreva a peça)
          </h3>
          <textarea
            value={data.leftFootNotFoundDescription || ''}
            onChange={(e) => handleTextAreaChange('leftFootNotFoundDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            rows={3}
            placeholder="Descreva aqui a peça específica para o retropé esquerdo..."
          />
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span>←</span>
            <span className="ml-1">Voltar</span>
          </button>
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
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
