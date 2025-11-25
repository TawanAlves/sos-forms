"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FormData, FormStep } from "@/types/form";
import { FormCache } from "@/lib/formCache";

const initialFormData: FormData = {
  prescription: {
    prescriptionType: "self",
  },
  clientData: {
    email: "",
    professionalName: "",
    whatsapp: "",
  },
  previousOrder: {
    isPreviousOrder: "",
    previousOrderDescription: "",
  },
  navicularMeasurement: {
    rightFootSitting: "",
    rightFootStanding: "",
    leftFootSitting: "",
    leftFootStanding: "",
  },
  prescriptionSummary: {
    manualPrescription: "",
  },
  printingModel: {
    modelType: "",
  },
  blockType: {
    blockType: "",
  },
  insoleRequest: {
    insoleType: "",
  },
  sapatoInteira: {
    quantity: "",
    braSize: "",
    measurements: "",
    coverageType: "",
    nextAction: "",
  },
  palmilhaPrescription: {
    selectedArea: "",
    corrections: [],
  },
  importantInfo: {
    additionalInfo: "",
    addPoronLayer: "",
  },
  antepePrescription: {
    rightFootPrescription: "",
    rightFootCustomDescription: "",
    leftFootPrescription: "",
    leftFootCustomDescription: "",
    reliefPoints: [],
    materialsDescription: "",
  },
  mediopePrescription: {
    rightFootPrescriptions: [],
    rightFootCustomDescription: "",
    leftFootPrescriptions: [],
    leftFootCustomDescription: "",
    reliefPoints: [],
    materialsDescription: "",
  },
  dedoPrescription: {
    correction: "",
    reliefPoints: [],
    materialsDescription: "",
  },
  retropePrescription: {
    rightFootPrescription: [],
    leftFootPrescription: "",
    rightFootCustomDescription: "",
    leftFootCustomDescription: "",
    calcoDescription: "",
    notFoundDescription: "",
    calcoCustomDescription: "",
    notFoundRightFootDescription: "",
    leftFootSecondPrescription: [],
    leftFootSecondCustomDescription: "",
    leftFootNotFoundDescription: "",
    calcoLeftDescription: "",
    poronSelected: false,
    psShockSelected: false,
    materialsLocationDescription: "",
    reliefPoints: [],
  },
  files: {
    uploadedFiles: [],
    uploadedFileInfo: [],
    wantToReview: "",
  },
  review: {
    confirmed: false,
  },
  payment: {
    paymentMethod: "",
    cardNumber: "",
    cardHolderName: "",
    cardExpiryMonth: "",
    cardExpiryYear: "",
    cardCvv: "",
    installments: 1,
    isPaid: false,
    transactionId: "",
    paymentStatus: "pending",
  },
  finalize: {
    orderConfirmed: false,
  },
  sosPrescriptionData: {
    diagnosticHypothesis: "",
    mainComplaint: "",
    patientHistory: "",
    correction: "",
    leftFoot: "",
    rightFoot: "",
    leftLungTest: "",
    rightLungTest: "",
    reliefPoints: [],
    materialsDescription: "",
  },
};

export function useFormState() {
  const [currentStep, setCurrentStep] = useState<FormStep>("prescription");
  const [formData, setFormData] = useState<FormData>(() => {
    // Tenta recuperar dados do cache ao inicializar
    const cachedData = FormCache.get<FormData>("form_data");
    if (cachedData) {
      // console.log("[useFormState] Dados recuperados do cache");
      return cachedData;
    }
    return initialFormData;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Referência para detectar mudanças não salvas
  const originalFormDataRef = useRef<FormData>(formData);
  const hasUnsavedChangesRef = useRef(false);

  // Detecta mudanças nos dados do formulário
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalFormDataRef.current);
    hasUnsavedChangesRef.current = hasChanges;
    
    // Salva no cache sempre que houver mudanças
    if (hasChanges) {
      FormCache.set("form_data", formData, 48); // Cache por 48 horas
    }
  }, [formData]);

  // Salva dados no cache quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (hasUnsavedChangesRef.current) {
        FormCache.set("form_data", formData, 48);
      }
    };
  }, [formData]);

  const getStepsWithFormData = useCallback((formData: FormData): FormStep[] => {
    const baseSteps: FormStep[] = [
      "prescription",
      "client-data",
      "previous-order",
      "navicular-measurement",
      "prescription-summary",
      "printing-model",
      "insole-request",
    ];

    // Adiciona tipo de bloco se for CNC
    if (formData.printingModel.modelType === "cnc") {
      baseSteps.push("block-type");
    }

    // Adiciona passos específicos baseados no tipo de palmilha selecionado
    const insoleType = formData.insoleRequest.insoleType;
    
    // Adiciona o passo específico do tipo de palmilha
    if (insoleType === "sapato-inteira") {
      baseSteps.push("sapato-inteira");
    } else if (insoleType === "chuteira") {
      baseSteps.push("football-boot");
    } else if (insoleType === "tenis") {
      baseSteps.push("sneakers");
    } else if (insoleType === "chinelo-sandalia") {
      baseSteps.push("flipflops");
    } else if (insoleType === "sapato-3-4") {
      baseSteps.push("palmilha-3/4");
    }

    // Se é sapato inteira e escolheu "acrescentar", pula para impressão
    if (formData.sapatoInteira.nextAction === "acrescentar") {
      return [...baseSteps, "printing-model", "payment", "finalize"];
    }

    // Adiciona o passo de prescrição de palmilhas
    baseSteps.push("palmilha-prescription");

    // Adiciona passos específicos baseados na área selecionada
    const selectedArea = formData.palmilhaPrescription.selectedArea;
    
    if (selectedArea === "dedos") {
      baseSteps.push("dedo-prescription");
    } else if (selectedArea === "antepe") {
      baseSteps.push("antepe-prescription");
    } else if (selectedArea === "mediope") {
      baseSteps.push("mediope-prescription");
    } else if (selectedArea === "retrope") {
      baseSteps.push("retrope-prescription");
    } else if (selectedArea === "sos") {
      baseSteps.push("sos-prescription");
    }

    // Adiciona informações importantes se necessário
    if (
      selectedArea === "conforto" ||
      selectedArea === "finalizada" ||
      selectedArea === "dedos" ||
      selectedArea === "antepe" ||
      selectedArea === "mediope" ||
      selectedArea === "retrope" ||
      selectedArea === "sos"
    ) {
      baseSteps.push("important-info");
    }

    // Adiciona arquivos
    baseSteps.push("files");

    // Adiciona revisão ou finalização baseado na escolha do usuário
    if (formData.files.wantToReview === "yes") {
      baseSteps.push("review");
    }
    
    // Adiciona etapa de pagamento antes da finalização
    baseSteps.push("payment");
    baseSteps.push("finalize");

    return baseSteps;
  }, []);

  const steps = getStepsWithFormData(formData);
  const currentStepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;

  const markStepAsCompleted = useCallback((stepIndex: number) => {
    setCompletedSteps((prev: Set<number>) => new Set([...prev, stepIndex]));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      markStepAsCompleted(currentStepIndex);
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  }, [currentStepIndex, totalSteps, steps, markStepAsCompleted]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  }, [currentStepIndex, steps]);

  const goToStep = useCallback((step: FormStep) => {
    const stepIndex = steps.indexOf(step);
    if (stepIndex !== -1) {
      setCurrentStep(step);
      // Marca todas as etapas anteriores como completadas
      for (let i = 0; i < stepIndex; i++) {
        markStepAsCompleted(i);
      }
    }
  }, [steps, markStepAsCompleted]);

  const goToStepByIndex = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStep(steps[index]);
      // Marca todas as etapas anteriores como completadas
      for (let i = 0; i < index; i++) {
        markStepAsCompleted(i);
      }
    }
  }, [totalSteps, steps, markStepAsCompleted]);

  const updateFormData = useCallback(
    <K extends keyof FormData>(section: K, data: Partial<FormData[K]>) => {
      setFormData((prev: FormData) => {
        const newFormData = {
          ...prev,
          [section]: { ...prev[section], ...data },
        };
        return newFormData;
      });
    },
    []
  );

  const updateFormDataAndNavigate = useCallback(
    <K extends keyof FormData>(
      section: K,
      data: Partial<FormData[K]>,
      shouldNavigate: boolean = false
    ) => {
      setFormData((prev: FormData) => {
        const newFormData = {
          ...prev,
          [section]: { ...prev[section], ...data },
        };

        // Se deve navegar, programa a navegação para o próximo tick
        if (shouldNavigate) {
          setTimeout(() => {
            // Recalcula os passos com os novos dados
            const newSteps = getStepsWithFormData(newFormData);
            const currentIndex = newSteps.indexOf(currentStep);
            const nextIndex = currentIndex + 1;

            if (nextIndex < newSteps.length) {
              markStepAsCompleted(currentIndex);
              setCurrentStep(newSteps[nextIndex]);
            }
          }, 10);
        }

        return newFormData;
      });
    },
    [currentStep, getStepsWithFormData, markStepAsCompleted]
  );

  // Função para resetar o formulário e limpar cache
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep("prescription");
    setCompletedSteps(new Set());
    originalFormDataRef.current = initialFormData;
    hasUnsavedChangesRef.current = false;
    
    // Limpa o cache
    FormCache.remove("form_data");
    // console.log("[useFormState] Formulário resetado e cache limpo");
  }, []);

  // Função para verificar se há mudanças não salvas
  const hasUnsavedChanges = useCallback((): boolean => {
    return hasUnsavedChangesRef.current;
  }, []);

  // Função para verificar se há mudanças não salvas (ignorando etapas específicas)
  const hasUnsavedChangesWithExceptions = useCallback((currentStep: FormStep): boolean => {
    // Etapas que não precisam de confirmação de salvamento
    const stepsWithoutSaveConfirmation: FormStep[] = ["previous-order"];
    
    if (stepsWithoutSaveConfirmation.includes(currentStep)) {
      return false;
    }
    
    return hasUnsavedChangesRef.current;
  }, []);

  // Função para salvar dados manualmente
  const saveFormData = useCallback(() => {
    FormCache.set("form_data", formData, 48);
    originalFormDataRef.current = formData;
    hasUnsavedChangesRef.current = false;
    // console.log("[useFormState] Dados salvos manualmente");
  }, [formData]);

  // Função para descartar mudanças
  const discardChanges = useCallback(() => {
    setFormData(originalFormDataRef.current);
    hasUnsavedChangesRef.current = false;
    // console.log("[useFormState] Mudanças descartadas");
  }, []);

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    formData,
    isLoading,
    completedSteps,
    steps,
    setIsLoading,
    nextStep,
    prevStep,
    goToStep,
    goToStepByIndex,
    updateFormData,
    updateFormDataAndNavigate,
    resetForm,
    // Novas funções para gerenciamento de mudanças
    hasUnsavedChanges,
    hasUnsavedChangesWithExceptions,
    saveFormData,
    discardChanges,
  };
}
