// Form Steps
export { PatientPrescriptionTypeStep } from "./form-steps/PatientPrescriptionTypeStep";
export { PersonalInfoStep } from "./form-steps/PersonalInfoStep";
export { PreviousOrderStep } from "./form-steps/PreviousOrderStep";
export { FootMeasurementsStep } from "./form-steps/FootMeasurementsStep";
export { SummaryStep } from "./form-steps/SummaryStep";
export { CustomizationStep } from "./form-steps/CustomizationStep";
export { BlockTypeStep } from "./form-steps/BlockTypeStep";
export { InsoleRequestStep } from "./form-steps/InsoleRequestStep";
export { SapatoInteiraStep } from "./form-steps/SapatoInteiraStep";
export { PalmilhaPrescriptionStep } from "./form-steps/PalmilhaPrescriptionStep";
export { ImportantInfoStep } from "./form-steps/ImportantInfoStep";
export { AntepePrescriptionStep } from "./form-steps/AntepePrescriptionStep";
export { MediopePrescriptionStep } from "./form-steps/MediopePrescriptionStep";
export { RetropePrescriptionStep } from "./form-steps/RetropePrescriptionStep";
export { DedoPrescriptionStep } from "./form-steps/DedoPrescriptionStep";
export { FilesStep } from "./form-steps/FilesStep";
export { ReviewStep } from "./form-steps/ReviewStep";
export { PaymentStep } from "./form-steps/PaymentStep";
export { FinalizeStep } from "./form-steps/FinalizeStep";
export { FootballBootStep } from "./form-steps/FootballBootStep ";
export { SneakersStep } from "./form-steps/SneakersStep";
export { FlipflopsStep } from "./form-steps/FlipflopsStep";
export { SosPrescriptionStep } from "./form-steps/SosPrescriptionStep";

// Common Components
export { ProgressBar } from "./common/ProgressBar";
export { StepWrapper } from "./common/StepWrapper";
export { StepNavigation } from "./common/StepNavigation";
export { InputField } from "./common/InputField";

// Types (re-exported from global types)
export type {
  BaseStepProps,
  ValidatableStepProps,
  NavigatableStepProps,
  StepWrapperProps,
  StepNavigationProps,
  SidebarStepNavigationProps,
} from "@/types/steps";

// Utilities
export { formatters, validators } from "../../utils/formatters";
export { useStepValidation } from "../../hooks/useStepValidation";
