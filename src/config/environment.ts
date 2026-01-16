import { z } from "zod";

/**
 * Configurações de ambiente da aplicação usando Zod para validação
 * Centraliza todas as variáveis de ambiente em um local com type safety
 */

/**
 * Schema de validação para configuração do servidor (com secrets)
 */const serverEnvSchema = z.object({
  // PagSeguro
  PAGSEGURO_TOKEN: z.string().optional(),
  PAGSEGURO_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  PAGSEGURO_SIMULATION_MODE: z.string().transform((val) => val.toLowerCase() === 'true').default('true'),

  // Pagar.me
  // PAGARME_API_KEY: z.string().min(1, "PAGARME_API_KEY é obrigatório"),

  // Email
  SMTP_HOST: z.string().min(1, "SMTP_HOST é obrigatório"),
  SMTP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default("587"),
  SMTP_SECURE: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .default("false"),
  SMTP_USER: z.string().min(1, "SMTP_USER é obrigatório"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS é obrigatório"),
  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL deve ser um e-mail válido")
    .default("admin@admin.com"),

  // Aplicação
  NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_DEMO_MODE: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .default("true"),
  NEXT_PUBLIC_DEBUG_MODE: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .default("false"),

  // Negócio (valores em centavos)
  NEXT_PUBLIC_MIN_ORDER_VALUE: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default("5000"),
  NEXT_PUBLIC_DELIVERY_FEE: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default("1500"),
  NEXT_PUBLIC_DELIVERY_DAYS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default("15"),

  // Desenvolvimento
  NEXT_PUBLIC_LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),
});

/**
 * Schema de validação para configuração do cliente (apenas variáveis públicas)
 */
const clientEnvSchema = z.object({
  // Aplicação
  NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_DEMO_MODE: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .default("true"),
  NEXT_PUBLIC_DEBUG_MODE: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .default("false"),

  // Negócio (valores em centavos)
  NEXT_PUBLIC_MIN_ORDER_VALUE: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default("5000"),
  NEXT_PUBLIC_DELIVERY_FEE: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default("1500"),
  NEXT_PUBLIC_DELIVERY_DAYS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default("15"),

  // Desenvolvimento
  NEXT_PUBLIC_LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),
});

/**
 * Tipos inferidos dos schemas
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Configuração do servidor (lazy-loaded para evitar execução no cliente)
 */
let _serverEnv: ServerEnv | null = null;

export const getServerEnv = (): ServerEnv => {
  if (_serverEnv) return _serverEnv;

  try {
    _serverEnv = serverEnvSchema.parse(process.env);
    return _serverEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(
        `❌ Erro na validação das variáveis de ambiente do servidor:\n${formattedErrors}`
      );
    }
    throw error;
  }
};

/**
 * Configuração do cliente (apenas variáveis públicas)
 */
export const getClientEnv = (): ClientEnv => {
  try {
    // Cria um objeto apenas com variáveis NEXT_PUBLIC_* e NODE_ENV
    const clientVars = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) => key.startsWith("NEXT_PUBLIC_") || key === "NODE_ENV"
      )
    );

    return clientEnvSchema.parse(clientVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(
        `❌ Erro na validação das variáveis de ambiente do cliente:\n${formattedErrors}`
      );
    }
    throw error;
  }
};

/**
 * Validação das configurações obrigatórias (apenas servidor)
 */
export function validateEnvironment(): void {
  try {
    const env = getServerEnv();

    // console.log('✅ Configurações de ambiente do servidor validadas com sucesso');

    if (env.NEXT_PUBLIC_DEBUG_MODE) {
      // console.log('🔧 Configurações carregadas:', {
      //   nodeEnv: env.NODE_ENV,
      //   demoMode: env.NEXT_PUBLIC_DEMO_MODE,
      //   debugMode: env.NEXT_PUBLIC_DEBUG_MODE,
      //   baseUrl: env.NEXT_PUBLIC_BASE_URL,
      //   // Não mostra a API key por segurança
      //   pagarmeConfigured: !!env.PAGARME_API_KEY,
      //   pagarmeApiUrl: env.PAGARME_API_URL,
      //   logLevel: env.NEXT_PUBLIC_LOG_LEVEL,
      // });
    }
  } catch (error) {
    console.error("❌ Erro na validação do ambiente:", error);
    throw error;
  }
}

/**
 * Validação das configurações do cliente (sem secrets)
 */
export function validateClientEnvironment(): void {
  try {
    const env = getClientEnv();

    // console.log("✅ Configurações do cliente validadas com sucesso");

    if (env.NEXT_PUBLIC_DEBUG_MODE) {
      // console.log("🔧 Configurações do cliente carregadas:", {
      //   nodeEnv: env.NODE_ENV,
      //   demoMode: env.NEXT_PUBLIC_DEMO_MODE,
      //   debugMode: env.NEXT_PUBLIC_DEBUG_MODE,
      //   baseUrl: env.NEXT_PUBLIC_BASE_URL,
      //   minOrderValue: env.NEXT_PUBLIC_MIN_ORDER_VALUE,
      //   deliveryFee: env.NEXT_PUBLIC_DELIVERY_FEE,
      //   deliveryDays: env.NEXT_PUBLIC_DELIVERY_DAYS,
      //   logLevel: env.NEXT_PUBLIC_LOG_LEVEL,
      // });
    }
  } catch (error) {
    console.error("❌ Erro na validação do ambiente do cliente:", error);
    throw error;
  }
}

/**
 * Helper para verificar se estamos em desenvolvimento
 */
export const isDevelopment = () => {
  if (typeof window !== "undefined") {
    return getClientEnv().NODE_ENV === "development";
  }
  return getServerEnv().NODE_ENV === "development";
};

/**
 * Helper para verificar se estamos em produção
 */
export const isProduction = () => {
  if (typeof window !== "undefined") {
    return getClientEnv().NODE_ENV === "production";
  }
  return getServerEnv().NODE_ENV === "production";
};

/**
 * Helper para verificar se estamos em modo de teste
 */
export const isTest = () => {
  if (typeof window !== "undefined") {
    return getClientEnv().NODE_ENV === "test";
  }
  return getServerEnv().NODE_ENV === "test";
};

/**
 * Helper para verificar se o modo demo está ativo
 */
export const isDemoMode = () => {
  if (typeof window !== "undefined") {
    return getClientEnv().NEXT_PUBLIC_DEMO_MODE;
  }
  return getServerEnv().NEXT_PUBLIC_DEMO_MODE;
};

/**
 * Helper para verificar se o debug está ativo
 */
export const isDebugMode = () => {
  if (typeof window !== "undefined") {
    return getClientEnv().NEXT_PUBLIC_DEBUG_MODE;
  }
  return getServerEnv().NEXT_PUBLIC_DEBUG_MODE;
};

/**
 * Helper para formatar valores monetários
 */
export const formatCurrency = (valueInCents: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents / 100);
};

/**
 * Helper para obter configurações de negócio formatadas
 */
export const getBusinessConfig = () => {
  const env = typeof window !== "undefined" ? getClientEnv() : getServerEnv();

  return {
    minOrderValue: {
      cents: env.NEXT_PUBLIC_MIN_ORDER_VALUE,
      formatted: formatCurrency(env.NEXT_PUBLIC_MIN_ORDER_VALUE),
    },
    deliveryFee: {
      cents: env.NEXT_PUBLIC_DELIVERY_FEE,
      formatted: formatCurrency(env.NEXT_PUBLIC_DELIVERY_FEE),
    },
    deliveryDays: env.NEXT_PUBLIC_DELIVERY_DAYS,
  };
};
