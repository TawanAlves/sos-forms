'use client';

import { useState } from 'react';
import { NavigationConfirmModal } from './NavigationConfirmModal';

interface StepNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  onStepClick: (stepIndex: number) => void;
  completedSteps: boolean[];
}

const stepNames = [
  'Informações Pessoais',
  'Medidas dos Pés',
  'Sintomas',
  'Personalização',
  'Resumo',
  'Fresadora CNC'
];

const stepIcons = [
  '👤',
  '📏',
  '🩺',
  '⚙️',
  '📋',
  '🖨️'
];

export function StepNavigation({ currentStepIndex, totalSteps, onStepClick, completedSteps }: StepNavigationProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetStepIndex, setTargetStepIndex] = useState(0);

  const completedCount = completedSteps.filter(Boolean).length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  const handleStepClick = (stepIndex: number) => {
    const isClickable = stepIndex < currentStepIndex || completedSteps[stepIndex];

    if (!isClickable) return;

    // If going backwards, show confirmation modal
    if (stepIndex < currentStepIndex) {
      setTargetStepIndex(stepIndex);
      setShowConfirmModal(true);
    } else {
      onStepClick(stepIndex);
    }
  };

  const handleConfirmNavigation = () => {
    onStepClick(targetStepIndex);
    setShowConfirmModal(false);
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
  };
  return (
    <div className="mb-8">
      {/* Progress Summary */}
      <div className="text-center mb-4">
        <div className="text-sm text-slate-600 mb-2">
          {completedCount} de {totalSteps} etapas completadas ({Math.round(progressPercentage)}%)
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, var(--color-sky-500), var(--color-cyan-500))`
            }}
          />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = completedSteps[index];
          const isClickable = index < currentStepIndex || isCompleted;

          return (
            <div key={index} className="flex items-center">
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                  ${isActive
                    ? 'shadow-lg text-white'
                    : isCompleted
                      ? 'cursor-pointer text-white'
                      : isClickable
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed'
                  }
                `}
                style={{
                  backgroundColor: isActive
                    ? 'var(--color-sky-600)'
                    : isCompleted
                      ? 'var(--color-green-500)'
                      : isClickable
                        ? 'var(--color-sky-100)'
                        : 'var(--color-slate-200)',
                  color: isActive || isCompleted
                    ? 'white'
                    : isClickable
                      ? 'var(--color-slate-700)'
                      : 'var(--color-slate-400)'
                }}
                onMouseEnter={(e) => {
                  if (isCompleted && !isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--color-green-600)';
                  } else if (isClickable && !isActive && !isCompleted) {
                    e.currentTarget.style.backgroundColor = 'var(--color-sky-200)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCompleted && !isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--color-green-500)';
                  } else if (isClickable && !isActive && !isCompleted) {
                    e.currentTarget.style.backgroundColor = 'var(--color-sky-100)';
                  }
                }}
              >
                <span className="text-lg">{stepIcons[index]}</span>
                <div className="text-left">
                  <div className="text-sm font-medium">
                    Etapa {index + 1}
                  </div>
                  <div className="text-xs">
                    {stepNames[index]}
                  </div>
                </div>
                {isCompleted && index !== currentStepIndex && (
                  <span className="text-green-600">✓</span>
                )}
              </button>

              {index < totalSteps - 1 && (
                <div className="w-8 h-0.5 mx-2" style={{ backgroundColor: 'var(--color-slate-300)' }}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4" style={{ borderColor: 'var(--color-slate-200)', borderWidth: '1px' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{
                  backgroundColor: currentStepIndex >= 0 ? 'var(--color-sky-600)' : 'var(--color-slate-200)',
                  color: currentStepIndex >= 0 ? 'white' : 'var(--color-slate-600)'
                }}
              >
                {stepIcons[currentStepIndex]}
              </div>
              <div>
                <div className="font-medium" style={{ color: 'var(--color-slate-900)' }}>
                  Etapa {currentStepIndex + 1} de {totalSteps}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-slate-600)' }}>
                  {stepNames[currentStepIndex]}
                </div>
              </div>
            </div>

            {/* Dropdown for mobile */}
            <div className="relative">
              <select
                value={currentStepIndex}
                onChange={(e) => {
                  const selectedIndex = parseInt(e.target.value);
                  handleStepClick(selectedIndex);
                }}
                className="rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--color-sky-100)',
                  borderColor: 'var(--color-slate-300)',
                  color: 'var(--color-slate-700)',
                  borderWidth: '1px'
                }}
              >
                {Array.from({ length: totalSteps }, (_, index) => {
                  const isClickable = index < currentStepIndex || completedSteps[index];
                  return (
                    <option
                      key={index}
                      value={index}
                      disabled={!isClickable && index !== currentStepIndex}
                    >
                      {index + 1}. {stepNames[index]} {completedSteps[index] ? '✓' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Progress indicators for mobile */}
        <div className="flex justify-center space-x-2 mb-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === currentStepIndex
                  ? 'var(--color-sky-600)'
                  : completedSteps[index]
                    ? 'var(--color-green-500)'
                    : index < currentStepIndex
                      ? 'var(--color-slate-400)'
                      : 'var(--color-slate-200)',
                transform: index === currentStepIndex ? 'scale(1.25)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation Confirmation Modal */}
      <NavigationConfirmModal
        isOpen={showConfirmModal}
        targetStepName={stepNames[targetStepIndex]}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </div>
  );
}
