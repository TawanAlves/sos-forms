/**
 * Tipos e interfaces para hooks e componentes de performance
 */

import { FormStep, FormData } from "./form";

export interface LazyLoadingState {
  loadedSteps: Set<FormStep>;
  loadingSteps: Set<FormStep>;
}

export interface UseLazyLoadingReturn {
  isStepLoaded: (step: FormStep) => boolean;
  isStepLoading: (step: FormStep) => boolean;
  loadStep: (step: FormStep) => Promise<void>;
  preloadStep: (step: FormStep) => void;
  getLoadedStepsCount: () => number;
}

export interface UsePreventDataLossProps {
  hasUnsavedChanges: boolean;
  onBeforeUnload?: () => void;
}

export interface UsePreventDataLossReturn {
  handleBeforeNavigate: () => boolean;
  hasUnsavedChanges: boolean;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface CacheConfig {
  key: string;
  expirationHours: number;
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheInfo {
  exists: boolean;
  expiresAt?: Date;
  age?: number;
}

export interface PendingNavigation {
  action: () => void;
  description: string;
}

export interface ExtendedFormStateReturn {
  // Funções existentes
  currentStep: FormStep;
  currentStepIndex: number;
  totalSteps: number;
  formData: FormData;
  isLoading: boolean;
  completedSteps: Set<number>;
  steps: FormStep[];
  setIsLoading: (loading: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: FormStep) => void;
  goToStepByIndex: (index: number) => void;
  updateFormData: <K extends keyof FormData>(section: K, data: Partial<FormData[K]>) => void;
  updateFormDataAndNavigate: <K extends keyof FormData>(
    section: K,
    data: Partial<FormData[K]>,
    shouldNavigate?: boolean
  ) => void;
  resetForm: () => void;
  
  // Novas funções para gerenciamento de mudanças
  hasUnsavedChanges: () => boolean;
  saveFormData: () => void;
  discardChanges: () => void;
}
