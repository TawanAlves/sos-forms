'use client';

import { StepWrapperProps } from '@/types/steps';

export function StepWrapper({
  title,
  subtitle,
  icon,
  children,
  showUnsavedChangesNotification = false,
  onSaveChanges,
  isSaving = false,
}: StepWrapperProps) {
  return (
    <div className="space-y-6">
      {/* Header da Step */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start space-x-3 mb-2">
          {icon && (
            <span className="text-3xl" role="img" aria-label="step-icon">
              {icon}
            </span>
          )}
          <h2 className="text-2xl font-bold text-slate-900">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-slate-600 text-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Conteúdo da Step */}
      <div>
        {children}
      </div>

      {/* Notificação de alterações não salvas - antes dos botões de navegação */}
      {showUnsavedChangesNotification && onSaveChanges && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  Você tem alterações não salvas.
                  <button
                    onClick={onSaveChanges}
                    disabled={isSaving}
                    className="ml-2 inline-flex items-center px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3 w-3 text-yellow-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      "Salvar agora"
                    )}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
