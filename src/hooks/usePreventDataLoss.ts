"use client";

import { useEffect, useRef, useCallback } from "react";
import { UsePreventDataLossProps, UsePreventDataLossReturn } from "@/types/hooks";

export function usePreventDataLoss({ 
  hasUnsavedChanges, 
  onBeforeUnload 
}: UsePreventDataLossProps): UsePreventDataLossReturn {
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

  // Atualiza a referência quando hasUnsavedChanges muda
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  // Função para mostrar aviso antes de sair da página
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (hasUnsavedChangesRef.current) {
      const message = "Você tem alterações não salvas. Tem certeza que deseja sair?";
      event.preventDefault();
      event.returnValue = message;
      return message;
    }
  }, []);

  // Função para mostrar aviso antes de navegar (para navegação interna)
  const handleBeforeNavigate = useCallback(() => {
    if (hasUnsavedChangesRef.current && onBeforeUnload) {
      onBeforeUnload();
      return true; // Indica que deve mostrar confirmação
    }
    return false;
  }, [onBeforeUnload]);

  // Adiciona listener para beforeunload (saída da página)
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  return {
    handleBeforeNavigate,
    hasUnsavedChanges: hasUnsavedChangesRef.current,
  };
}
