'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FilesData, UploadedFile } from '@/types/form';
import { StepWrapper } from '../common/StepWrapper';

interface FilesStepProps {
  data: FilesData;
  onDataChange: (data: FilesData) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  isSaving?: boolean;
}

export function FilesStep({
  data,
  onDataChange,
  onNext,
  onPrev,
  hasUnsavedChanges = false,
  onSaveChanges,
  isSaving = false
}: FilesStepProps) {
  const [localData, setLocalData] = useState<FilesData>(data);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar o estado local com os dados recebidos
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (field: keyof FilesData, value: string | File[] | UploadedFile[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const errors: string[] = [];
    const validFiles: File[] = [];

    // Validação inicial dos arquivos
    fileArray.forEach(file => {
      // Verifica se o arquivo é menor que 100MB
      const isValidSize = file.size <= 100 * 1024 * 1024;
      
      // Verifica tipos de arquivo permitidos
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
        'application/pdf',
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
        'application/octet-stream' // Para arquivos .stl
      ];
      const isValidType = allowedTypes.includes(file.type) || file.name.endsWith('.stl');
      
      if (!isValidSize) {
        errors.push(`${file.name}: Arquivo muito grande (máximo 100MB)`);
      } else if (!isValidType) {
        errors.push(`${file.name}: Tipo de arquivo não suportado`);
      } else {
        validFiles.push(file);
      }
    });

    // Atualiza erros
    setFileErrors(errors);

    // Se há arquivos válidos, faz o upload
    if (validFiles.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        validFiles.forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro no upload');
        }

        const result = await response.json();
        
        // Atualiza os dados com as informações dos arquivos enviados
        const newUploadedFiles = [...localData.uploadedFiles, ...validFiles].slice(0, 10);
        const newUploadedFileInfo = [...localData.uploadedFileInfo, ...result.files].slice(0, 10);
        
        // Atualiza o estado local primeiro
        const updatedData = {
          ...localData,
          uploadedFiles: newUploadedFiles,
          uploadedFileInfo: newUploadedFileInfo
        };
        setLocalData(updatedData);
        
        // Depois notifica o componente pai
        onDataChange(updatedData);
        
        setUploadProgress(100);
        
        // Limpa erros se o upload foi bem-sucedido
        if (errors.length === 0) {
          setFileErrors([]);
        }

      } catch (error) {
        console.error('Erro no upload:', error);
        setFileErrors([...errors, `Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`]);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const removeFile = async (index: number) => {
    const fileToRemove = localData.uploadedFileInfo[index];
    
    // Remove do servidor se o arquivo foi enviado
    if (fileToRemove?.fileName) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName: fileToRemove.fileName }),
        });
      } catch (error) {
        console.error('Erro ao remover arquivo do servidor:', error);
      }
    }

    // Remove dos arrays locais
    const updatedFiles = localData.uploadedFiles.filter((_: File, i: number) => i !== index);
    const updatedFileInfo = localData.uploadedFileInfo.filter((_: UploadedFile, i: number) => i !== index);
    
    // Atualiza o estado local primeiro
    const updatedData = {
      ...localData,
      uploadedFiles: updatedFiles,
      uploadedFileInfo: updatedFileInfo
    };
    setLocalData(updatedData);
    
    // Depois notifica o componente pai
    onDataChange(updatedData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canProceed = localData.wantToReview !== '';

  return (
    <StepWrapper
      title="Arquivos"
      subtitle="Anexe documentos, exames e imagens para completar sua solicitação"
      icon="📁"
      showUnsavedChangesNotification={hasUnsavedChanges}
      onSaveChanges={onSaveChanges}
      isSaving={isSaving}
    >
      <div className="space-y-8">
        {/* Instruções detalhadas */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-900 mb-4">
            Sugerimos utilizar este espaço para inserir:
          </p>

          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">EXAMES:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Plantigrafia (foto escaneada em bitmap - dois pés na mesma folha)</li>
                <li>Baropodômetro (pdf 1:1 + exportar arquivo)</li>
                <li>Scanner2D (bitmap)</li>
                <li>Scanner3D (stl)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">FOTOS DOS MMII:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Vista Posterior (retropés)</li>
                <li>Vista Anterior (antepés)</li>
                <li>Vista Medial (Arco Longitudinal Medial) posicione um pé à frente do outro</li>
                <li>Superfície Plantar (calosidades, úlceras de pressão, fibromatoses, verrugas plantares, etc)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">VÍDEOS: 5 a 10 segundos</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Marcha e ou corrida (anterior, posterior e perfil)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">EXAMES COMPLEMENTARES:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Laudos de exames: raio-x, RNM, Tomografia, etc</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Área de Upload */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Anexar Arquivos <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Arraste e solte arquivos aqui ou clique para selecionar
            </p>
          </div>

          {/* Área de Drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isUploading 
                ? 'border-blue-400 bg-blue-50 cursor-not-allowed' 
                : 'border-gray-300 hover:border-blue-400 cursor-pointer'
            }`}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={(e: React.DragEvent) => {
              if (!isUploading) {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
              }
            }}
            onDragLeave={(e: React.DragEvent) => {
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
            }}
            onDrop={(e: React.DragEvent) => {
              if (!isUploading) {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                handleFileUpload(e.dataTransfer.files);
              }
            }}
          >
            {isUploading ? (
              <>
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-lg font-medium text-blue-700 mb-2">
                  Enviando arquivos...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-600">
                  {uploadProgress}% concluído
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">📁</div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Clique ou arraste arquivos aqui
                </p>
                <p className="text-sm text-gray-500">
                  Máximo 10 arquivos, 100MB cada
                </p>
              </>
            )}
          </div>

          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.mp4,.avi,.mov,.wmv,.stl"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          {/* Erros de arquivo */}
          {fileErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Erros encontrados:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {fileErrors.map((error: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Arquivos enviados */}
          {localData.uploadedFiles.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Arquivos enviados ({localData.uploadedFiles.length}/10):
              </h4>
              <div className="space-y-2">
                {localData.uploadedFiles.map((file: File, index: number) => {
                  const fileInfo = localData.uploadedFileInfo[index];
                  return (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="text-lg">
                          {file.type?.startsWith('image/') ? '🖼️' :
                            file.type === 'application/pdf' ? '📄' :
                              file.type?.startsWith('video/') ? '🎥' : '📁'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
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
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1 ml-2"
                        title="Remover arquivo"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pergunta sobre revisão */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">
              Esqueceu de acrescentar alguma informação importante? Deseja revisar seu pedido? <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opção SIM */}
            <button
              type="button"
              onClick={() => handleChange('wantToReview', 'yes')}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200 text-left
                ${localData.wantToReview === 'yes'
                  ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${localData.wantToReview === 'yes'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                  }
                `}>
                  {localData.wantToReview === 'yes' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-lg font-bold text-gray-900">SIM</span>
              </div>
              <p className="text-sm text-gray-600">
                Quero revisar e adicionar mais informações
              </p>
            </button>

            {/* Opção NÃO */}
            <button
              type="button"
              onClick={() => handleChange('wantToReview', 'no')}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200 text-left
                ${localData.wantToReview === 'no'
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${localData.wantToReview === 'no'
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                  }
                `}>
                  {localData.wantToReview === 'no' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-lg font-bold text-gray-900">NÃO</span>
              </div>
              <p className="text-sm text-gray-600">
                Estou satisfeito com as informações fornecidas
              </p>
            </button>
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
            onClick={onNext}
            disabled={!canProceed}
            className="px-6 py-3 rounded-lg font-medium transition-colors
                     text-white bg-gradient-to-r from-blue-500 to-blue-600
                     hover:from-blue-600 hover:to-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center space-x-2"
          >
            <span>{localData.wantToReview === 'yes' ? 'Revisar Pedido' : 'Finalizar Pedido'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
