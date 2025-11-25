export interface PrescriptionData {
  // prescriptionType: 'individual' | 'team';
  prescriptionType: "self" | "team";
}

export interface ClientData {
  email: string;
  professionalName: string;
  whatsapp: string;
}

export interface PreviousOrderData {
  isPreviousOrder: "yes" | "no" | "";
  previousOrderDescription: string;
}

export interface NavicularMeasurementData {
  rightFootSitting: string;
  rightFootStanding: string;
  leftFootSitting: string;
  leftFootStanding: string;
}

export interface PrescriptionSummaryData {
  manualPrescription: string;
}

export interface PrintingModelData {
  modelType: "cnc" | "printer3d" | "";
}

export interface BlockTypeData {
  blockType:
    | "black-40"
    | "ps-shock"
    | "blue-40"
    | "viva-army"
    | "viva-black-gray"
    | "viva-purple-lilac"
    | "viva-red-yellow"
    | "viva-black"
    | "viva-blue"
    | "";
}

export interface InsoleRequestData {
  insoleType:
    | "sapato-inteira"
    | "tenis"
    | "sapato-3-4"
    | "chinelo-sandalia"
    | "chuteira"
    | "";
}

export interface SapatoInteiraData {
  quantity: string;
  braSize: string;
  measurements: string;
  coverageType: string;
  // | "cobertura-1"
  // | "cobertura-2"
  // | "cobertura-3"
  // | "cobertura-4"
  // | "";
  nextAction: "finalizadas" | "acrescentar" | "";
}

export interface PalmilhaPrescriptionData {
  selectedArea:
    | "conforto"
    | "antepe"
    | "mediope"
    | "retrope"
    | "finalizada"
    | "dedos"
    | "sos"
    | "";
  corrections: string[];
}

export interface ImportantInfoData {
  additionalInfo: string;
  addPoronLayer: "yes" | "no" | "";
}

export interface AntepePrescriptionData {
  rightFootPrescription:
    | "bic-barra-infra-capital-d"
    | "cut-out-d"
    | "sem-imagem"
    | "nao-se-aplica"
    | "";
  rightFootCustomDescription: string;
  leftFootPrescription:
    | "bic-barra-infra-capital-e"
    | "cut-out-e"
    | "sem-imagem"
    | "nao-se-aplica"
    | "";
  leftFootCustomDescription: string;
  reliefPoints: string[];
  materialsDescription: string;
}

export interface MediopePrescriptionData {
  rightFootPrescriptions: string[];
  rightFootCustomDescription: string;
  leftFootPrescriptions: string[];
  leftFootCustomDescription: string;
  reliefPoints: string[];
  materialsDescription: string;
}

export interface DedoPrescriptionData {
  correction: string;
  reliefPoints: string[];
  materialsDescription: string;
}

export interface SosPrescriptionData {
  diagnosticHypothesis?: string;
  mainComplaint?: string;
  patientHistory?: string;
  correction: string;
  leftFoot: string;
  rightFoot: string;
  leftLungTest?: string;
  rightLungTest?: string;
  reliefPoints: string[];
  materialsDescription: string;
}

export interface RetropePrescriptionData {
  rightFootPrescription: string[];
  leftFootPrescription: string;
  rightFootCustomDescription: string;
  leftFootCustomDescription: string;
  calcoDescription: string;
  notFoundDescription: string;
  calcoCustomDescription: string;
  notFoundRightFootDescription: string;
  leftFootSecondPrescription: string[];
  leftFootSecondCustomDescription: string;
  leftFootNotFoundDescription: string;
  calcoLeftDescription: string;
  poronSelected: boolean;
  psShockSelected: boolean;
  materialsLocationDescription: string;
  reliefPoints: string[];
}

export interface UploadedFile {
  originalName: string;
  fileName: string;
  size: number;
  type: string;
  url: string;
}

export interface FilesData {
  uploadedFiles: File[];
  uploadedFileInfo: UploadedFile[];
  wantToReview: "yes" | "no" | "";
}

export interface ReviewData {
  confirmed: boolean;
}

export interface PaymentData {
  paymentMethod: "credit_card" | "debit_card" | "pix" | "";
  cardNumber: string;
  cardHolderName: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCvv: string;
  installments: number;
  isPaid: boolean;
  transactionId?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "cancelled";
  pixCode?: string;
  pixQrCode?: string;
}

export interface FinalizeData {
  orderConfirmed: boolean;
  orderNumber?: string;
}

// export interface FootballBoot {
//   nome: string;
// }

export interface FormData {
  prescription: PrescriptionData;
  clientData: ClientData;
  previousOrder: PreviousOrderData;
  navicularMeasurement: NavicularMeasurementData;
  prescriptionSummary: PrescriptionSummaryData;
  printingModel: PrintingModelData;
  blockType: BlockTypeData;
  insoleRequest: InsoleRequestData;
  sapatoInteira: SapatoInteiraData;
  // footballBoot: SapatoInteiraData;
  palmilhaPrescription: PalmilhaPrescriptionData;
  importantInfo: ImportantInfoData;
  antepePrescription: AntepePrescriptionData;
  mediopePrescription: MediopePrescriptionData;
  retropePrescription: RetropePrescriptionData;
  dedoPrescription: DedoPrescriptionData;
  sosPrescriptionData: SosPrescriptionData;
  files: FilesData;
  review: ReviewData;
  payment: PaymentData;
  finalize: FinalizeData;
}

export type FormStep =
  | "prescription"
  | "client-data"
  | "previous-order"
  | "navicular-measurement"
  | "prescription-summary"
  | "printing-model"
  | "block-type"
  | "insole-request"
  | "football-boot"
  | "sneakers"
  | "flipflops"
  | "palmilha-3/4"
  | "sapato-inteira"
  | "palmilha-prescription"
  | "important-info"
  | "antepe-prescription"
  | "dedo-prescription"
  | "sos-prescription"
  | "mediope-prescription"
  | "retrope-prescription"
  | "files"
  | "review"
  | "payment"
  | "finalize";
