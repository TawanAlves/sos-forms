interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div className="w-full bg-blue-200 rounded-full h-3 shadow-inner">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-blue-600">
        <span>Etapa {currentStep} de {totalSteps}</span>
        <span className="font-semibold text-blue-600">{Math.round(progress)}% concluído</span>
      </div>
    </div>
  );
}
