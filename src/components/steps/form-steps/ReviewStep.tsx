"use client";

import { ReviewData, FormData } from "@/types/form";
import { StepWrapper } from "../common/StepWrapper";
import { useState, useEffect } from "react";

interface ReviewStepProps {
  data: ReviewData;
  formData: FormData;
  onDataChange: (data: ReviewData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onEditStep?: (step: string) => void;
}

export function ReviewStep({
  data,
  formData,
  onDataChange,
  onNext,
  onPrev,
  onEditStep,
}: ReviewStepProps) {
  const [localData, setLocalData] = useState<ReviewData>(data);
  
  // Debug: verificar os dados recebidos
  // console.log('ReviewStep - data recebida:', data);
  // console.log('ReviewStep - formData.review:', formData.review);
  // console.log('ReviewStep - localData:', localData);
  
  // Sincronizar o estado local com o estado global quando necessário
  useEffect(() => {
    if (data.confirmed !== localData.confirmed) {
      setLocalData(data);
    }
  }, [data.confirmed, localData.confirmed, data, localData]);
  
  // Garantir que o estado local seja sempre inicializado corretamente
  useEffect(() => {
    // console.log('ReviewStep - Inicializando estado local com:', data);
    setLocalData(data);
  }, [data]);
  
  // Inicializar o estado local sem forçar confirmed como true
  useEffect(() => {
    // Inicializa com o valor recebido, mantendo confirmed como false por padrão
    setLocalData(data);
  }, [data]); // Executa quando data mudar
  
  // Debug: verificar se o estado está sendo atualizado corretamente
  // useEffect(() => {
  //   console.log('ReviewStep - Estado atualizado:', { localData, data });
  // }, [localData, data]);
  
  // Debug: verificar se o onNext está sendo passado corretamente
  // useEffect(() => {
  //   console.log('ReviewStep - onNext recebido:', onNext);
  // }, [onNext]);
  
  // Debug: verificar mudanças no estado local
  // useEffect(() => {
  //   console.log('ReviewStep - Estado local alterado:', localData);
  // }, [localData]);
  
  // Debug: verificar se o botão está sendo renderizado corretamente
  // useEffect(() => {
  //   console.log('ReviewStep - Renderizando botão com:', { confirmed: localData.confirmed, onNext: !!onNext });
  // });
  
  // Função para testar se o botão pode ser clicado
  const canProceed = localData.confirmed && onNext;
  // console.log('ReviewStep - canProceed:', canProceed);
  
  // Debug: verificar se o canProceed está sendo calculado corretamente
  // useEffect(() => {
  //   console.log('ReviewStep - canProceed calculado:', { confirmed: localData.confirmed, onNext: !!onNext, canProceed });
  // }, [localData.confirmed, onNext, canProceed]);
  


  const handleChange = (field: keyof ReviewData, value: boolean) => {
    const newData = { ...localData, [field]: value };
    // Atualizar estado local primeiro
    setLocalData(newData);
    
    // Depois atualizar estado global
    onDataChange(newData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStepTitle = (step: string): string => {
    const titles: Record<string, string> = {
      prescription: "Tipo de Prescrição",
      "client-data": "Dados Pessoais",
      "previous-order": "Sintomas",
      "navicular-measurement": "Medidas dos Pés",
      "prescription-summary": "Resumo da Prescrição",
      "printing-model": "Modelo de Impressão",
      "block-type": "Tipo de Bloco",
      "insole-request": "Tipo de Palmilha",
      "football-boot": "Tipo de Palmilha",
      flipflops: "Sandália",
      "palmilha-3/4": "Palmilha-3/4",
      "sapato-inteira": "Especificações",
      "palmilha-prescription": "Prescrição Final",
      "important-info": "Informações Importantes",
      "antepe-prescription": "Prescrição Antepés",
      files: "Arquivos",
    };
    return titles[step] || step;
  };

  const renderDataSection = (
    title: string,
    content: React.ReactElement,
    stepKey?: string
  ) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {stepKey && onEditStep && (
          <button
            type="button"
            onClick={() => onEditStep(stepKey)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
          >
            <span>✏️</span>
            <span>Editar</span>
          </button>
        )}
      </div>
      {content}
    </div>
  );

  return (
    <StepWrapper
      title="Revisão do pedido"
      subtitle="Verifique se todas as informações estão corretas antes de finalizar"
      icon="🔍"
    >
      <div className="space-y-6">
        {/* Dados Pessoais */}
        {renderDataSection(
          getStepTitle("client-data"),
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">
                {formData.clientData.email || "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Nome do Profissional:
              </span>
              <p className="text-gray-900">
                {formData.clientData.professionalName || "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">WhatsApp:</span>
              <p className="text-gray-900">
                {formData.clientData.whatsapp || "Não informado"}
              </p>
            </div>
          </div>,
          "client-data"
        )}

        {/* Sintomas / Pedido Anterior */}
        {renderDataSection(
          getStepTitle("previous-order"),
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-700">
                É um pedido anterior?
              </span>
              <p className="text-gray-900">
                {formData.previousOrder.isPreviousOrder === "yes"
                  ? "Sim"
                  : formData.previousOrder.isPreviousOrder === "no"
                  ? "Não"
                  : "Não informado"}
              </p>
            </div>
            {formData.previousOrder.isPreviousOrder === "yes" &&
              formData.previousOrder.previousOrderDescription && (
                <div>
                  <span className="font-medium text-gray-700">Descrição:</span>
                  <p className="text-gray-900">
                    {formData.previousOrder.previousOrderDescription}
                  </p>
                </div>
              )}
          </div>,
          "previous-order"
        )}

        {/* Medidas dos Pés */}
        {/* [ALTERAÇÃO] Exibição sempre em cm */}
        {renderDataSection(
          getStepTitle("navicular-measurement"),
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">
                Pé Direito (Sentado):
              </span>
              <p className="text-gray-900">
                {formData.navicularMeasurement.rightFootSitting
                  ? `${formData.navicularMeasurement.rightFootSitting} cm`
                  : "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Pé Direito (Em pé):
              </span>
              <p className="text-gray-900">
                {formData.navicularMeasurement.rightFootStanding
                  ? `${formData.navicularMeasurement.rightFootStanding} cm`
                  : "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Pé Esquerdo (Sentado):
              </span>
              <p className="text-gray-900">
                {formData.navicularMeasurement.leftFootSitting
                  ? `${formData.navicularMeasurement.leftFootSitting} cm`
                  : "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Pé Esquerdo (Em pé):
              </span>
              <p className="text-gray-900">
                {formData.navicularMeasurement.leftFootStanding
                  ? `${formData.navicularMeasurement.leftFootStanding} cm`
                  : "Não informado"}
              </p>
            </div>
          </div>,
          "navicular-measurement"
        )}

        {/* Resumo da Prescrição */}
        {renderDataSection(
          getStepTitle("prescription-summary"),
          <div className="text-sm">
            <span className="font-medium text-gray-700">
              Prescrição Manual:
            </span>
            <p className="text-gray-900 mt-1">
              {formData.prescriptionSummary.manualPrescription ||
                "Não informado"}
            </p>
          </div>,
          "prescription-summary"
        )}

        {/* Modelo de Impressão */}
        {renderDataSection(
          getStepTitle("printing-model"),
          <div className="text-sm">
            <span className="font-medium text-gray-700">Tipo de Modelo:</span>
            <p className="text-gray-900">
              {formData.printingModel.modelType === "cnc"
                ? "Fresadora CNC"
                : formData.printingModel.modelType === "printer3d"
                ? "Impressora 3D"
                : "Não informado"}
            </p>
          </div>,
          "printing-model"
        )}

        {/* Tipo de Bloco (se CNC foi selecionado) */}
        {formData.printingModel.modelType === "cnc" &&
          renderDataSection(
            getStepTitle("block-type"),
            <div className="text-sm">
              <span className="font-medium text-gray-700">Tipo de Bloco:</span>
              <p className="text-gray-900">
                {formData.blockType.blockType || "Não informado"}
              </p>
            </div>,
            "block-type"
          )}

        {/* Tipo de Palmilha */}
        {renderDataSection(
          getStepTitle("insole-request"),
          <div className="text-sm">
            <span className="font-medium text-gray-700">Tipo de Palmilha:</span>
            <p className="text-gray-900">
              {formData.insoleRequest.insoleType === "sapato-inteira"
                ? "Sapato Inteira"
                : formData.insoleRequest.insoleType === "tenis"
                ? "Tênis"
                : formData.insoleRequest.insoleType === "sapato-3-4"
                ? "Sapato 3/4"
                : formData.insoleRequest.insoleType === "chinelo-sandalia"
                ? "Chinelo/Sandália"
                : formData.insoleRequest.insoleType === "chuteira"
                ? "Chuteira"
                : "Não informado"}
            </p>
          </div>,
          "insole-request"
        )}

        {/* Especificações */}
        {renderDataSection(
          getStepTitle("sapato-inteira"),
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Quantidade:</span>
              <p className="text-gray-900">
                {formData.sapatoInteira.quantity || "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
              Numeração BRA:
              </span>
              <p className="text-gray-900">
                {formData.sapatoInteira.braSize || "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Medidas:</span>
              <p className="text-gray-900">
                {formData.sapatoInteira.measurements || "Não informado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Tipo de Cobertura:
              </span>
              <p className="text-gray-900">
                {formData.sapatoInteira.coverageType || "Não informado"}
              </p>
            </div>
          </div>,
          "sapato-inteira"
        )}

        {/* Prescrição Final */}
        {renderDataSection(
          getStepTitle("palmilha-prescription"),
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-700">
                Área Selecionada:
              </span>
              <p className="text-gray-900">
                {formData.palmilhaPrescription.selectedArea === "conforto"
                  ? "Conforto"
                  : formData.palmilhaPrescription.selectedArea === "antepe"
                  ? "Antepé"
                  : formData.palmilhaPrescription.selectedArea === "mediope"
                  ? "Mediopé"
                  : formData.palmilhaPrescription.selectedArea === "retrope"
                  ? "Retropé"
                  : formData.dedoPrescription.correction === "dedo"
                  ? "Dedo"
                  : formData.palmilhaPrescription.selectedArea === "finalizada"
                  ? "Finalizada"
                  : "Não informado"}
              </p>
              {/* todo: revisar se essa parte tá pegando */}
            </div>
            {formData.palmilhaPrescription.corrections.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Correções:</span>
                <ul className="list-disc list-inside text-gray-900 mt-1">
                  {formData.palmilhaPrescription.corrections.map(
                    (correction, index) => (
                      <li key={index}>{correction}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>,
          "palmilha-prescription"
        )}

        {/* Informações Importantes (se área conforto foi selecionada) */}
        {formData.palmilhaPrescription.selectedArea === "conforto" &&
          renderDataSection(
            getStepTitle("important-info"),
            <div className="text-sm space-y-2">
              <div>
                <span className="font-medium text-gray-700">
                  Informações Adicionais:
                </span>
                <p className="text-gray-900">
                  {formData.importantInfo.additionalInfo || "Não informado"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Adicionar Camada PORON:
                </span>
                <p className="text-gray-900">
                  {formData.importantInfo.addPoronLayer === "yes"
                    ? "Sim (+R$ 80,50)"
                    : formData.importantInfo.addPoronLayer === "no"
                    ? "Não"
                    : "Não informado"}
                </p>
              </div>
            </div>,
            "important-info"
          )}

        {/* Prescrição Antepés (se área antepe foi selecionada) */}
        {formData.palmilhaPrescription.selectedArea === "antepe" &&
          renderDataSection(
            getStepTitle("antepe-prescription"),
            <div className="text-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">
                    Prescrição Pé Direito:
                  </span>
                  <p className="text-gray-900">
                    {formData.antepePrescription.rightFootPrescription ===
                    "bic-barra-infra-capital-d"
                      ? "BIC - Barra Infra Capital D"
                      : formData.antepePrescription.rightFootPrescription ===
                        "cut-out-d"
                      ? "CUT OUT D"
                      : formData.antepePrescription.rightFootPrescription ===
                        "sem-imagem"
                      ? "Sem imagem"
                      : formData.antepePrescription.rightFootPrescription ===
                        "nao-se-aplica"
                      ? "Não se aplica"
                      : "Não informado"}
                  </p>
                  {formData.antepePrescription.rightFootCustomDescription && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">
                        Descrição personalizada:
                      </span>
                      <p className="text-gray-900">
                        {formData.antepePrescription.rightFootCustomDescription}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Prescrição Pé Esquerdo:
                  </span>
                  <p className="text-gray-900">
                    {formData.antepePrescription.leftFootPrescription ===
                    "bic-barra-infra-capital-e"
                      ? "BIC - Barra Infra Capital E"
                      : formData.antepePrescription.leftFootPrescription ===
                        "cut-out-e"
                      ? "CUT OUT E"
                      : formData.antepePrescription.leftFootPrescription ===
                        "sem-imagem"
                      ? "Sem imagem"
                      : formData.antepePrescription.leftFootPrescription ===
                        "nao-se-aplica"
                      ? "Não se aplica"
                      : "Não informado"}
                  </p>
                  {formData.antepePrescription.leftFootCustomDescription && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">
                        Descrição personalizada:
                      </span>
                      <p className="text-gray-900">
                        {formData.antepePrescription.leftFootCustomDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {formData.antepePrescription.reliefPoints &&
                formData.antepePrescription.reliefPoints.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Pontos de Alívio:
                    </span>
                    <p className="text-gray-900">
                      {formData.antepePrescription.reliefPoints
                        .map((point) =>
                          point === "poron"
                            ? "PORON"
                            : point === "ps-shock"
                            ? "PS SHOCK"
                            : point
                        )
                        .join(", ")}
                    </p>
                  </div>
                )}
              {formData.antepePrescription.materialsDescription && (
                <div>
                  <span className="font-medium text-gray-700">
                    Descrição dos Materiais:
                  </span>
                  <p className="text-gray-900">
                    {formData.antepePrescription.materialsDescription}
                  </p>
                </div>
              )}
            </div>,
            "antepe-prescription"
          )}

        {/* Arquivos */}
        {renderDataSection(
          getStepTitle("files"),
          <div className="text-sm space-y-3">
            <div>
              <span className="font-medium text-gray-700">
                Arquivos Enviados ({formData.files.uploadedFiles.length}):
              </span>
              {formData.files.uploadedFiles.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {formData.files.uploadedFiles.map((file, index) => {
                    const fileInfo = formData.files.uploadedFileInfo[index];
                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded border"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-lg">
                            {file.type.startsWith("image/")
                              ? "🖼️"
                              : file.type === "application/pdf"
                              ? "📄"
                              : file.type.startsWith("video/")
                              ? "🎥"
                              : "📁"}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                            {fileInfo?.url && (
                              <a
                                href={fileInfo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                🔗 Ver arquivo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Nenhum arquivo foi enviado. Recomendamos anexar exames,
                    fotos ou vídeos para uma prescrição mais precisa.
                  </p>
                </div>
              )}
            </div>

            {/* Verificação de tipos de arquivo recomendados */}
            {formData.files.uploadedFiles.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 mb-2">
                  📋 Verificação de Arquivos:
                </h5>
                <div className="text-xs text-blue-700 space-y-1">
                  {(() => {
                    const hasImages = formData.files.uploadedFiles.some((f) =>
                      f.type.startsWith("image/")
                    );
                    const hasPdfs = formData.files.uploadedFiles.some(
                      (f) => f.type === "application/pdf"
                    );
                    const hasVideos = formData.files.uploadedFiles.some((f) =>
                      f.type.startsWith("video/")
                    );
                    const hasStl = formData.files.uploadedFiles.some((f) =>
                      f.name.endsWith(".stl")
                    );

                    return (
                      <>
                        <div
                          className={
                            hasImages ? "text-green-600" : "text-orange-600"
                          }
                        >
                          {hasImages ? "✅" : "⚠️"} Imagens:{" "}
                          {hasImages ? "Incluídas" : "Recomendadas"}
                        </div>
                        <div
                          className={
                            hasPdfs ? "text-green-600" : "text-orange-600"
                          }
                        >
                          {hasPdfs ? "✅" : "⚠️"} PDFs:{" "}
                          {hasPdfs ? "Incluídos" : "Recomendados"}
                        </div>
                        <div
                          className={
                            hasVideos ? "text-green-600" : "text-orange-600"
                          }
                        >
                          {hasVideos ? "✅" : "⚠️"} Vídeos:{" "}
                          {hasVideos ? "Incluídos" : "Recomendados"}
                        </div>
                        <div
                          className={
                            hasStl ? "text-green-600" : "text-orange-600"
                          }
                        >
                          {hasStl ? "✅" : "⚠️"} Arquivos 3D:{" "}
                          {hasStl ? "Incluídos" : "Recomendados"}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>,
          "files"
        )}

        {/* Confirmação */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="confirmation"
              checked={localData.confirmed}
              onChange={(e) => {
                const checked = e.target.checked;
                // console.log('ReviewStep - Checkbox alterado:', checked);
                // console.log('ReviewStep - Estado anterior:', localData.confirmed);
                handleChange("confirmed", checked);
                // console.log('ReviewStep - Estado após alteração:', localData.confirmed);
              }}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div>
              <label
                htmlFor="confirmation"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                Confirmo que revisei todas as informações{" "}
                <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Ao marcar esta opção, você confirma que todas as informações
                fornecidas estão corretas e completas.
              </p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-3 rounded-lg font-medium transition-colors
                     text-gray-600 bg-gray-100 hover:bg-gray-200
                     flex items-center space-x-2"
          >
            <span>←</span>
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (canProceed) {
                onNext();
              }
            }}
            disabled={!canProceed}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              canProceed
                ? 'text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                : 'text-gray-400 bg-gray-300 cursor-not-allowed'
            }`}
          >
            <span>Finalizar Pedido</span>
            <span>✓</span>
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
