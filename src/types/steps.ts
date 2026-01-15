/**
 * Interface base para todas as steps do formulário
 */
export interface BaseStepProps<T = Record<string, unknown>> {
  data: T;
  onUpdate: (data: Partial<T>) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onReturn?: () => void;
}

/**
 * Interface para steps que precisam de validação
 */
export interface ValidatableStepProps<T = Record<string, unknown>> extends BaseStepProps<T> {
  errors?: Partial<Record<keyof T, string>>;
  onValidate?: (data: T) => Partial<Record<keyof T, string>>;
}

/**
 * Interface para steps com navegação customizada
 */
export interface NavigatableStepProps<T = Record<string, unknown>> extends BaseStepProps<T> {
  canProceed?: boolean;
  isLoading?: boolean;
}

/**
 * Props para componentes de step wrapper
 */
export interface StepWrapperProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  showUnsavedChangesNotification?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

/**
 * Props para botões de navegação
 */
export interface StepNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  onStepClick: (stepIndex: number) => void;
  completedSteps: boolean[];
  steps: import('@/types/form').FormStep[];
  // Props opcionais para compatibilidade
  onNext?: () => void;
  onPrev?: () => void;
  onReturn?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  canProceed?: boolean;
  isLoading?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

/**
 * Props para navegação lateral
 */
export interface SidebarStepNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  onStepClick: (stepIndex: number) => void;
  completedSteps: boolean[];
  steps: import('@/types/form').FormStep[];
}
