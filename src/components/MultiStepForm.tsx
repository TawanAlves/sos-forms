"use client";

import { useState, useEffect } from "react";
import { useFormState } from "@/hooks/useFormState";
import { usePreventDataLoss } from "@/hooks/usePreventDataLoss";
import { useLazyLoading } from "@/hooks/useLazyLoading";
import { ConfirmationModal } from "./common/ConfirmationModal";
import { PendingNavigation } from "@/types/hooks";
import {
  PrescriptionData,
  ClientData,
  PatientData,
  // PreviousOrderData,
  NavicularMeasurementData,
  PrescriptionSummaryData,
  PrintingModelData,
  BlockTypeData,
  InsoleRequestData,
  SapatoInteiraData,
  PalmilhaPrescriptionData,
  ImportantInfoData,
  AntepePrescriptionData,
  DedoPrescriptionData,
  MediopePrescriptionData,
  RetropePrescriptionData,
  FilesData,
  ReviewData,
  PaymentData,
  FinalizeData,
  FormStep,
} from "@/types/form";
import { StepNavigation } from "./steps/common/StepNavigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Palmilha3x4Step } from "./steps/form-steps/Sapato3x4";

import {
  PatientPrescriptionTypeStep,
  PersonalInfoStep,
  PatientInfoStep,
  // PreviousOrderStep,
  FootMeasurementsStep,
  SummaryStep,
  CustomizationStep,
  BlockTypeStep,
  InsoleRequestStep,
  SapatoInteiraStep,
  PalmilhaPrescriptionStep,
  ImportantInfoStep,
  AntepePrescriptionStep,
  MediopePrescriptionStep,
  RetropePrescriptionStep,
  FilesStep,
  ReviewStep,
  PaymentStep,
  FinalizeStep,
  DedoPrescriptionStep,
  SosPrescriptionStep,
  FootballBootStep,
  SneakersStep,
  FlipflopsStep,
} from "./steps";

export function MultiStepForm() {
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    formData,
    completedSteps,
    steps,
    goToStep,
    goToStepByIndex,
    updateFormData,
    updateFormDataAndNavigate,
    nextStep,
    prevStep,
    hasUnsavedChanges,
    hasUnsavedChangesWithExceptions,
    saveFormData,
    discardChanges,
  } = useFormState();

  // Estado para o modal de confirmação
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);

  // Estado para controlar notificação de salvamento
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Hook para lazy loading das etapas
  const { isStepLoaded, loadStep, preloadStep } = useLazyLoading();

  // Hook para prevenir perda de dados
  usePreventDataLoss({
    hasUnsavedChanges: hasUnsavedChangesWithExceptions(currentStep),
    onBeforeUnload: () => setShowConfirmationModal(true),
  });

  // Efeito para animar a entrada da notificação
  useEffect(() => {
    if (showSavedNotification) {
      // Pequeno delay para a animação
      const timer = setTimeout(() => {
        setNotificationVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setNotificationVisible(false);
    }
  }, [showSavedNotification]);

  // Função para salvar dados com notificação
  const handleSaveFormData = async () => {
    setIsSaving(true);

    try {
      // Simula um pequeno delay para mostrar o estado de loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      saveFormData();
      setShowSavedNotification(true);

      // Esconde a notificação após 4 segundos com efeito suave
      setTimeout(() => {
        setNotificationVisible(false);
        setTimeout(() => {
          setShowSavedNotification(false);
        }, 300);
      }, 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Função para fechar notificação manualmente
  const closeSavedNotification = () => {
    setNotificationVisible(false);
    // Aguarda a animação de saída antes de esconder completamente
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 300);
  };

  // Pré-carrega a próxima etapa em background
  useEffect(() => {
    if (currentStepIndex < totalSteps - 1) {
      const nextStep = steps[currentStepIndex + 1];
      preloadStep(nextStep);
    }
  }, [currentStepIndex, totalSteps, steps, preloadStep]);

  // Função para navegar com confirmação se necessário
  const navigateWithConfirmation = (
    action: () => void,
    description: string
  ) => {
    if (hasUnsavedChangesWithExceptions(currentStep)) {
      setPendingNavigation({ action, description });
      // setShowConfirmationModal(true);
      // todo: modal de confirmação de dados salvos suprimdos
       action();
    } else {
      action();
    }
  };

  // Função para confirmar saída (descartar mudanças)
  const handleConfirmExit = () => {
    if (pendingNavigation) {
      discardChanges();
      pendingNavigation.action();
      setPendingNavigation(null);
    }
    setShowConfirmationModal(false);
  };

  // Função para cancelar saída (manter mudanças)
  const handleCancelExit = () => {
    setShowConfirmationModal(false);
    setPendingNavigation(null);
  };

  // Função especial para o FinalizeStep que verifica de onde veio
  const handleFinalizeStepBack = () => {
    const action = () => {
      // Se veio do previous-order (escolheu "Sim"), volta para previous-order
      // if (formData.previousOrder.isPreviousOrder === "yes") {
      //   goToStep("previous-order");
      // }
      // // Se veio do antepé, volta para antepe-prescription
      // else
         if (formData.palmilhaPrescription.selectedArea === "antepe") {
        goToStep("antepe-prescription");
      }
      // Caso contrário, usa a navegação normal
      else {
        prevStep();
      }
    };

    navigateWithConfirmation(action, "voltar para a etapa anterior");
  };

  // Função especial para o PreviousOrderStep que verifica se deve ir para passo final
  // const handlePreviousOrderNavigation = () => {
  //   // Se o usuário escolheu "Sim", vai direto para o passo final (finalize)
  //   if (formData.previousOrder.isPreviousOrder === "yes") {
  //     goToStep("finalize");
  //   } else {
  //     // Caso contrário, continua normalmente
  //     nextStep();
  //   }
  // };

  // Função especial para o SapatoInteiraStep que verifica se deve ir para passo 6
  const handleSapatoInteiraNavigation = () => {
    const action = () => {
      // Se o usuário escolheu "acrescentar", vai para o passo 6 (printing-model)
      if (formData.sapatoInteira.nextAction === "acrescentar") {
        goToStep("printing-model");
      } else {
        // Caso contrário, continua normalmente
        nextStep();
      }
    };

    navigateWithConfirmation(action, "avançar para a próxima etapa");
  };
  
  // Função especial para o RetropePrescriptionStep que vai para o passo 10 (palmilha-prescription)
  const handleRetropePrescriptionNavigation = () => {
    const action = () => {
      // Vai direto para o passo 10 (palmilha-prescription)
      goToStep("palmilha-prescription");
    };

    navigateWithConfirmation(action, "voltar para prescrição de palmilhas");
  };

  // Função especial para o FilesStep que navega corretamente
  const handleFilesStepNavigation = () => {
    // !rebase
    // Se o usuário escolheu "Sim" para revisar, vai para o passo de revisão
    if (formData.files.wantToReview === "yes") {
      nextStep(); // Vai para 'review'
    } else if (formData.files.wantToReview === "no") {
      // Se escolheu "Não", vai direto para finalização
      goToStep("finalize");
    }
    // Usa a função especial que atualiza e navega
    updateFormDataAndNavigate("files", formData.files, true);
  };

  // Função para renderizar etapa com lazy loading
  const renderCurrentStep = () => {
    // Carrega a etapa atual se necessário
    if (!isStepLoaded(currentStep)) {
      loadStep(currentStep);
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando etapa...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case "prescription":
        return (
          <PatientPrescriptionTypeStep
            data={formData.prescription}
            onDataChange={(data: PrescriptionData) =>
              updateFormData("prescription", data)
            }
            onNext={nextStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "client-data":
        return (
          <PersonalInfoStep
            data={formData.clientData}
            onDataChange={(data: ClientData) =>
              updateFormData("clientData", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );

         case "patient-data":
        return (
          <PatientInfoStep
            data={formData.patientData}
            onDataChange={(data: PatientData) =>
              updateFormData("patientData", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      // case "previous-order":
      //   return (
      //     <PreviousOrderStep
      //       data={formData.previousOrder}
      //       onDataChange={(data: PreviousOrderData) =>
      //         updateFormData("previousOrder", data)
      //       }
      //       onNext={handlePreviousOrderNavigation}
      //       onPrev={prevStep}
      //     />
      //   );
      case "navicular-measurement":
        return (
          <FootMeasurementsStep
            data={formData.navicularMeasurement}
            onDataChange={(data: NavicularMeasurementData) =>
              updateFormData("navicularMeasurement", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "prescription-summary":
        return (
          <SummaryStep
            data={formData.prescriptionSummary}
            onDataChange={(data: PrescriptionSummaryData) =>
              updateFormData("prescriptionSummary", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "printing-model":
        return (
          <CustomizationStep
            data={formData.printingModel}
            onDataChange={(data: PrintingModelData) =>
              updateFormData("printingModel", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "block-type":
        return (
          <BlockTypeStep
            data={formData.blockType}
            onDataChange={(data: BlockTypeData) =>
              updateFormData("blockType", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "insole-request":
        return (
          <InsoleRequestStep
            data={formData.insoleRequest}
            onDataChange={(data: InsoleRequestData) =>
              updateFormData("insoleRequest", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "sapato-inteira":
        return (
          <SapatoInteiraStep
            data={formData.sapatoInteira}
            onDataChange={(data: SapatoInteiraData) =>
              updateFormData("sapatoInteira", data)
            }
            onNext={handleSapatoInteiraNavigation}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "football-boot":
        return (
          <FootballBootStep
            data={formData.sapatoInteira}
            onDataChange={(data: SapatoInteiraData) =>
              updateFormData("sapatoInteira", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "sneakers":
        return (
          <SneakersStep
            data={formData.sapatoInteira}
            onDataChange={(data: SapatoInteiraData) =>
              updateFormData("sapatoInteira", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "flipflops":
        return (
          <FlipflopsStep
            data={formData.sapatoInteira}
            onDataChange={(data: SapatoInteiraData) =>
              updateFormData("sapatoInteira", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "palmilha-3/4":
        return (
          <Palmilha3x4Step
            data={formData.sapatoInteira}
            onDataChange={(data: SapatoInteiraData) =>
              updateFormData("sapatoInteira", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "palmilha-prescription":
        return (
          <PalmilhaPrescriptionStep
            data={formData.palmilhaPrescription}
            onDataChange={(data: PalmilhaPrescriptionData) =>
              updateFormData("palmilhaPrescription", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "important-info":
        return (
          <ImportantInfoStep
            data={formData.importantInfo}
            onDataChange={(data: ImportantInfoData) =>
              updateFormData("importantInfo", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "antepe-prescription":
        return (
          <AntepePrescriptionStep
            data={formData.antepePrescription}
            onDataChange={(data: AntepePrescriptionData) =>
              updateFormData("antepePrescription", data)
            }
            onNext={nextStep}
            onReturn={handleRetropePrescriptionNavigation}
            onPrev={prevStep}
          />
        );
      case "dedo-prescription":
        return (
          <DedoPrescriptionStep
            data={formData.dedoPrescription}
            onDataChange={(data: DedoPrescriptionData) =>
              updateFormData("dedoPrescription", data)
            }
            onNext={nextStep}
             onReturn={handleRetropePrescriptionNavigation}
            onPrev={prevStep}
          />
        );
      case "sos-prescription":
        return (
          <SosPrescriptionStep
            data={formData.sosPrescriptionData}
            onDataChange={(data: DedoPrescriptionData) =>
              updateFormData("dedoPrescription", data)
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "mediope-prescription":
        return (
          <MediopePrescriptionStep
            data={formData.mediopePrescription}
            onDataChange={(data: MediopePrescriptionData) =>
              updateFormData("mediopePrescription", data)
            }
            onNext={nextStep}
             onReturn={handleRetropePrescriptionNavigation}
            onPrev={prevStep}
          />
        );
      case "retrope-prescription":
        return (
          <RetropePrescriptionStep
            data={formData.retropePrescription}
            onDataChange={(data: RetropePrescriptionData) =>
              updateFormData("retropePrescription", data)
            }
            onNext={nextStep}
             onReturn={handleRetropePrescriptionNavigation}
            onPrev={prevStep}
          />
        );
      case "files":
        return (
          <FilesStep
            data={formData.files}
            onDataChange={(data: FilesData) => updateFormData("files", data)}
            onNext={handleFilesStepNavigation}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "review":
        return (
          <ReviewStep
            data={formData.review}
            formData={formData}
            onDataChange={(data: ReviewData) => updateFormData("review", data)}
            onNext={nextStep}
            onPrev={prevStep}
            onEditStep={(step: string) => goToStep(step as FormStep)}
          />
        );
      case "payment":
        return (
          <PaymentStep
            data={formData.payment}
            onDataChange={(data: PaymentData) => updateFormData("payment", data)}
            onNext={nextStep}
            onPrev={prevStep}
            hasUnsavedChanges={hasUnsavedChanges()}
            onSaveChanges={handleSaveFormData}
            isSaving={isSaving}
          />
        );
      case "finalize":
        return (
          <FinalizeStep
            data={formData.finalize}
            formData={formData}
            onDataChange={(data: FinalizeData) =>
              updateFormData("finalize", data)
            }
            onPrev={handleFinalizeStepBack}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Etapa não encontrada: {currentStep}</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Modal de confirmação para prevenir perda de dados */}
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
          title="Alterações não salvas"
          message={`Você tem alterações não salvas. Deseja ${pendingNavigation?.description || "sair"
            } e descartar as alterações?`}
          confirmText="Descartar alterações"
          cancelText="Continuar editando"
        />
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            

            {/* Indicador de dados salvos com sucesso */}
            {showSavedNotification && (
              <div
                className={`mb-6 p-4 bg-green-50 border border-green-200 rounded-lg transition-all duration-700 ease-out transform ${notificationVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-2"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 animate-bounce">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 Dados salvos com sucesso! Suas alterações foram
                        preservadas.
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Você pode navegar entre as etapas com segurança.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeSavedNotification}
                    className="text-green-400 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-100"
                    title="Fechar notificação"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Notificação toast de salvamento */}
            {showSavedNotification && (
              <div
                className={`fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-50 transition-all duration-700 ease-out transform border border-green-400 ${notificationVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-4"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="animate-pulse">
                    <svg
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">
                    Dados salvos com sucesso!
                  </span>
                  <button
                    onClick={closeSavedNotification}
                    className="ml-2 text-white hover:text-green-100 transition-colors p-1 rounded-full hover:bg-green-400/20"
                    title="Fechar notificação"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Navegação das etapas */}
            <StepNavigation
              steps={steps}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              completedSteps={Array.from({ length: totalSteps }, (_, i) =>
                completedSteps.has(i)
              )}
              onStepClick={(stepIndex) => {
                const action = () => goToStepByIndex(stepIndex);
                navigateWithConfirmation(
                  action,
                  `ir para etapa ${stepIndex + 1}`
                );
              }}
            />

            {/* Conteúdo da etapa atual */}
            <div className="mt-8">{renderCurrentStep()}</div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
