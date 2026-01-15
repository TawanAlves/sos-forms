"use client";

import React, { useState } from "react";
import { StepWrapper } from "../common/StepWrapper";
import type { BaseStepProps } from "@/types/steps";
import type { PrescriptionSummaryData } from "@/types/form";
import { Button } from "../common/ButtonComp";

interface SummaryStepProps
  extends Omit<BaseStepProps<PrescriptionSummaryData>, "onUpdate"> {
  onDataChange: (data: PrescriptionSummaryData) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function SummaryStep({
  data,
  onDataChange,
  onNext,
  onPrev,
}: SummaryStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PrescriptionSummaryData, string>>
  >({});

  const handleTextareaChange = (value: string) => {
    onDataChange({
      ...data,
      manualPrescription: value,
    });

    // Remove erro quando o usuário começa a digitar
    if (errors.manualPrescription) {
      setErrors((prev) => ({
        ...prev,
        manualPrescription: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PrescriptionSummaryData, string>> =
      {};

    // Validação da prescrição manual
    if (!data.manualPrescription.trim()) {
      newErrors.manualPrescription = "Prescrição é obrigatória";
    } else if (data.manualPrescription.trim().length < 10) {
      newErrors.manualPrescription =
        "Prescrição deve ter pelo menos 10 caracteres para ser detalhada";
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
    // todo: daqui tem que ir direto para o resumo do pedido e pagar
      title="Prescrição resumida"
      subtitle="Exemplo: 1 par de palmilhas para Tenis de cor laranja, tamanho 280x85, Cunha Ante Calcaneo Valgo Bilateral de 3mm + botao retrocapital Bilateral e Cut Out sob 5 metatarso E."
    >
      <div className="space-y-6">
        {/* Exemplo de prescrição */}
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
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Exemplo de prescrição detalhada:
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                &ldquo;1 par de palmilhas para Tênis de cor laranja, tamanho
                280x85, Cunha Ante Calcâneo Valgo Bilateral de 3mm + botão
                retrocapital Bilateral e Cut Out sob 5º metatarso E.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Área de texto para prescrição manual */}
        <div>
          <label
            htmlFor="manualPrescription"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Caso prefira inserir os dados de forma manual responda abaixo.
            DETALHE TUDO <span className="text-red-500">*</span>
          </label>
          <textarea
            id="manualPrescription"
            value={data.manualPrescription || ""}
            onChange={(e) => handleTextareaChange(e.target.value)}
            rows={8}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-gray-900 ${
              errors.manualPrescription
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Digite aqui a prescrição completa e detalhada das palmilhas...

      Exemplo:
      - Tipo de calçado (tênis, sapato social, etc.)
      - Cor desejada
      - Tamanho
      - Correções específicas (cunhas, botões, cut outs)
      - Materiais especiais
      - Observações importantes"
          />
          {errors.manualPrescription && (
            <p className="mt-1 text-sm text-red-600">
              {errors.manualPrescription}
            </p>
          )}

          {/* Contador de caracteres */}
          <div className="mt-2 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Seja o mais detalhado possível para garantir uma prescrição
              precisa
            </p>
            <span
              className={`text-xs ${
                data.manualPrescription?.length >= 10
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {data.manualPrescription?.length || 0} caracteres
            </span>
          </div>
        </div>

        {/* Dicas para uma boa prescrição */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            💡 Dicas para uma prescrição completa:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>
              • <strong>Tipo de calçado:</strong> Tênis, sapato social, bota,
              sandália, etc.
            </li>
            <li>
              • <strong>Cor e material:</strong> Especifique cor e se há
              preferência de material
            </li>
            <li>
              • <strong>Tamanho:</strong> Comprimento x largura (ex: 280x85)
            </li>
            <li>
              • <strong>Correções biomecânicas:</strong> Cunhas, elevações,
              apoios
            </li>
            <li>
              • <strong>Áreas específicas:</strong> Cut outs, botões, almofadas
            </li>
            <li>
              • <strong>Lateralidade:</strong> Bilateral, apenas direito (D) ou
              esquerdo (E)
            </li>
            <li>
              • <strong>Medidas:</strong> Espessuras, alturas, angulações
            </li>
            <li>
              • <strong>Observações especiais:</strong> Alergias,
              sensibilidades, atividades específicas
            </li>
          </ul>
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
