"use client";

import React from "react";
import { StepNavigationProps } from "@/types/steps";
import { FormStep } from "@/types/form";

// Mapeamento dos nomes dos passos para exibição
const stepLabels: Record<
  FormStep,
  { title: string; description: string; icon: string }
> = {
  prescription: {
    title: "Tipo de Prescrição",
    description: "Escolha o modelo",
    icon: "📋",
  },
  "client-data": {
    title: "Dados Pessoais",
    description: "Informações do cliente",
    icon: "👤",
  },
  "patient-data": {
    title: "Dados do Paciente",
    description: "Informações do paciente",
    icon: "👤",
  },
  // "previous-order": {
  //   // title: "sintomas",
  //   title: "Dados do paciente",
  //   description: "Histórico de sintomas",
  //   icon: "🏥",
  // },
  "navicular-measurement": {
    title: "Medidas dos Pés",
    description: "Medições podais",
    icon: "📏",
  },
  // "prescription-summary": {
  //   // title: "Resumo",
  //   title: "Prescrição",
  //   description: "Prescrição final",
  //   icon: "📝",
  // },
  "printing-model": {
    title: "Personalização",
    description: "Customização",
    icon: "🎨",
  },
  "block-type": {
    // title: "Fresadora CNC",
    title: "Base da palmilha",
    description: "Finalização",
    icon: "🖨️",
  },
  "insole-request": {
    title: "Tipo de Palmilha",
    description: "Solicitação específica",
    icon: "👟",
  },
  "sapato-inteira": {
    title: "Especificações",
    description: "Detalhes da palmilha",
    icon: "⚙️",
  },
  // todo; etapa
  "football-boot": {
    // title: "Chuteira",
    title: "Medidas",
    description: "Detalhes da palmilha",
    icon: "⚙️",
  },
  sneakers: {
    // title: "Tênis",
    title: "Medidas",
    description: "Detalhes da palmilha",
    icon: "⚙️",
  },
  flipflops: {
    // title: "Sandália",
    title: "Medidas",
    description: "Detalhes da palmilha",
    icon: "⚙️",
  },
  "palmilha-3/4": {
    // title: "Palmilha 3/4",
    title: "Medidas",
    description: "Detalhes da palmilha",
    icon: "⚙️",
  },
  "palmilha-prescription": {
    // title: "Prescrição Final",
    title: "Elementos e peças",
    description: "Correções podais",
    icon: "🎯",
  },
  "important-info": {
    title: "Informações Importantes",
    description: "Detalhes finais",
    icon: "ℹ️",
  },
  "antepe-prescription": {
    title: "Prescrição Antepés",
    description: "Configuração antepé",
    icon: "🦶",
  },
  "mediope-prescription": {
    title: "Prescrição Médiopé",
    description: "Configuração médiopé",
    icon: "🦶",
  },
  "retrope-prescription": {
    title: "Prescrição Retropé",
    description: "Configuração retropé",
    icon: "🦶",
  },
  "dedo-prescription": {
    title: "Prescrição Dedo",
    description: "Configuração dedo",
    icon: "🦶",
  },
  "sos-prescription": {
    title: "Prescrição Sos",
    description: "Configuração Sos",
    icon: "🦶",
  },
  files: {
    title: "Arquivos",
    description: "Upload de documentos",
    icon: "📁",
  },
  review: {
    title: "Revisão do pedido",
    description: "Verificação final",
    icon: "🔍",
  },
  payment: {
    title: "Pagamento",
    description: "Finalizar pagamento",
    icon: "💳",
  },
  finalize: {
    title: "Finalizar pedido",
    description: "Confirmação final",
    icon: "🏁",
  },
};

export function StepNavigation({
  currentStepIndex,
  totalSteps,
  onStepClick,
  completedSteps,
  steps,
}: StepNavigationProps) {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Usar steps.length como fallback para evitar problemas de hidratação
  const safeTotalSteps = isClient ? totalSteps : steps.length;
  const completedCount = completedSteps.filter(Boolean).length;
  
  // Verificações de segurança para evitar NaN ou valores inválidos
  const safeCurrentStepIndex = Math.max(0, currentStepIndex || 0);
  const safeTotalStepsCount = Math.max(1, safeTotalSteps || 1);
  const progressPercentage = Math.min(100, Math.max(0, Math.round(
    ((safeCurrentStepIndex + 1) / safeTotalStepsCount) * 100
  )));

  // Evitar renderização durante hidratação para prevenir erros
  if (!isClient) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-700">
            Carregando...
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full w-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-700">
          {safeCurrentStepIndex + 1} de {safeTotalStepsCount} etapas ({progressPercentage}%)
        </div>
        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {completedCount} concluídas
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step: FormStep, index: number) => {
          const stepInfo = stepLabels[step];
          const isCompleted = completedSteps[index];
          const isCurrent = index === currentStepIndex;
          const isAccessible = index <= currentStepIndex || isCompleted;

          return (
            <div key={step} className="flex items-center">
              <button
                onClick={() => isAccessible && onStepClick(index)}
                disabled={!isAccessible}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isCurrent
                      ? "bg-blue-500 text-white shadow-md ring-2 ring-blue-200"
                      : isCompleted
                      ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                      : isAccessible
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
                  }
                `}
              >
                {/* Step Number/Check */}
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${
                    isCurrent
                      ? "bg-white text-blue-500"
                      : isCompleted
                      ? "bg-white text-green-500"
                      : isAccessible
                      ? "bg-gray-300 text-gray-700"
                      : "bg-gray-200 text-gray-400"
                  }
                `}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>

                {/* Step Info */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-base">{stepInfo.icon}</span>
                  <span className="font-medium hidden sm:inline">
                    {stepInfo.title}
                  </span>
                </div>
              </button>

              {/* Arrow Separator */}
              {index < steps.length - 1 && (
                <div className="flex items-center px-2">
                  <svg
                    className="w-4 h-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
