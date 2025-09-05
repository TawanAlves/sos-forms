"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FormStep } from "@/types/form";
import { LazyLoadingState, UseLazyLoadingReturn } from "@/types/hooks";

export function useLazyLoading(): UseLazyLoadingReturn {
  const [state, setState] = useState<LazyLoadingState>({
    loadedSteps: new Set(),
    loadingSteps: new Set(),
  });

  const pendingSteps = useRef<Set<FormStep>>(new Set());

  // Processa etapas pendentes de forma assíncrona
  useEffect(() => {
    const processPendingSteps = async () => {
      if (pendingSteps.current.size === 0) return;

      const stepsToProcess = Array.from(pendingSteps.current);
      pendingSteps.current.clear();

      for (const step of stepsToProcess) {
        try {
          // Simula carregamento assíncrono
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Marca como carregada
          setState((prev) => ({
            ...prev,
            loadedSteps: new Set([...prev.loadedSteps, step]),
            loadingSteps: new Set(
              [...prev.loadingSteps].filter((s) => s !== step)
            ),
          }));

          // console.log(`[LazyLoading] Etapa carregada: ${step}`);
        } catch (error) {
          console.error(`[LazyLoading] Erro ao carregar etapa ${step}:`, error);
          setState((prev) => ({
            ...prev,
            loadingSteps: new Set(
              [...prev.loadingSteps].filter((s) => s !== step)
            ),
          }));
        }
      }
    };

    processPendingSteps();
  }, [state.loadingSteps.size]); // Re-executa quando há mudanças no loadingSteps

  /**
   * Verifica se uma etapa já foi carregada
   */
  const isStepLoaded = useCallback(
    (step: FormStep): boolean => {
      return state.loadedSteps.has(step);
    },
    [state.loadedSteps]
  );

  /**
   * Verifica se uma etapa está sendo carregada
   */
  const isStepLoading = useCallback(
    (step: FormStep): boolean => {
      return state.loadingSteps.has(step);
    },
    [state.loadingSteps]
  );

  /**
   * Carrega uma etapa específica de forma lazy
   */
  const loadStep = useCallback(
    async (step: FormStep): Promise<void> => {
      // Se já está carregada, não faz nada
      if (state.loadedSteps.has(step)) {
        return;
      }

      // Se já está carregando, aguarda
      if (state.loadingSteps.has(step)) {
        return;
      }

      // Marca como carregando
      setState((prev) => ({
        ...prev,
        loadingSteps: new Set([...prev.loadingSteps, step]),
      }));

      // Adiciona à lista de pendentes para processamento assíncrono
      pendingSteps.current.add(step);
    },
    [state.loadedSteps, state.loadingSteps]
  );

  /**
   * Pré-carrega uma etapa em background
   */
  const preloadStep = useCallback(
    (step: FormStep): void => {
      if (!state.loadedSteps.has(step) && !state.loadingSteps.has(step)) {
        // Carrega em background sem aguardar
        loadStep(step).catch(console.error);
      }
    },
    [state.loadedSteps, state.loadingSteps, loadStep]
  );

  /**
   * Retorna o número de etapas carregadas
   */
  const getLoadedStepsCount = useCallback((): number => {
    return state.loadedSteps.size;
  }, [state.loadedSteps]);

  return {
    isStepLoaded,
    isStepLoading,
    loadStep,
    preloadStep,
    getLoadedStepsCount,
  };
}
