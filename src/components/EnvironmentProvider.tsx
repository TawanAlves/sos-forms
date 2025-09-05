"use client";

import { useEffect } from "react";
import {
  validateClientEnvironment,
  isDevelopment,
  isDemoMode,
} from "@/config/environment";

/**
 * Componente para inicializar e validar configurações de ambiente do cliente
 * Valida apenas variáveis públicas (NEXT_PUBLIC_*) usando Zod
 */
export function EnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    try {
      // Valida as configurações de ambiente do cliente usando Zod
      validateClientEnvironment();

      // Mostra informações de desenvolvimento se necessário
      if (isDevelopment() && isDemoMode()) {
        // console.log('🚧 Aplicação rodando em modo de demonstração');
        // console.log('📝 Use dados de teste para pagamentos');
        // console.log('🎯 Validação com Zod ativa');
      }
    } catch (error) {
      console.error("❌ Falha na inicialização do ambiente:", error);

      // Em desenvolvimento, mostra um alerta
      if (isDevelopment()) {
        alert(
          "Erro na configuração do ambiente!\n\n" +
            "Verifique se o arquivo .env.local está configurado corretamente.\n" +
            "O Zod fornece validação detalhada dos erros.\n" +
            "Consulte ENVIRONMENT.md para mais detalhes."
        );
      }
    }
  }, []);

  return <>{children}</>;
}
