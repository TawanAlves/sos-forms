# Configuração de Variáveis de Ambiente

Este documento explica como configurar as variáveis de ambiente para o projeto SOS Palmilhas usando **Zod** para validação TypeScript-first.

## 🎯 **Validação com Zod**

O projeto utiliza [Zod](https://zod.dev/) para validação das variáveis de ambiente, garantindo:

- **Type Safety**: Tipos TypeScript inferidos automaticamente dos schemas
- **Runtime Validation**: Validação em tempo de execução com mensagens de erro claras
- **Transform Support**: Conversão automática de strings para tipos apropriados

## 📁 Arquivos de Ambiente

### `.env.example`

- **Propósito**: Template com todas as variáveis disponíveis
- **Uso**: Referência para desenvolvedores
- **Git**: ✅ Commitado no repositório

### `.env.local`

- **Propósito**: Configurações locais de desenvolvimento
- **Uso**: Desenvolvimento local
- **Git**: ❌ Não commitado (gitignore)
- **Status**: ✅ Criado e configurado

### `.env.development`

- **Propósito**: Configurações padrão para desenvolvimento
- **Uso**: Ambiente de desenvolvimento
- **Git**: ✅ Pode ser commitado

### `.env.production`

- **Propósito**: Configurações para produção
- **Uso**: Deploy em produção
- **Git**: ❌ Não commitado (contém secrets)

### `.env.test`

- **Propósito**: Configurações para testes
- **Uso**: Execução de testes automatizados
- **Git**: ✅ Pode ser commitado

## 🔧 Como Configurar

### 1. Para Desenvolvimento Local

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
nano .env.local
```

### 2. Variáveis Obrigatórias (Validadas pelo Zod)

| Variável               | Tipo   | Descrição                | Exemplo                 |
| ---------------------- | ------ | ------------------------ | ----------------------- |
| `PAGARME_API_KEY`      | string | Chave da API do Pagar.me | `ak_test_...`           |
| `NEXT_PUBLIC_BASE_URL` | string | URL base da aplicação    | `http://localhost:3000` |
| `NODE_ENV`             | enum   | Ambiente da aplicação    | `development`           |

### 3. Variáveis Opcionais (com Defaults)

| Variável                      | Tipo    | Default                    | Descrição            |
| ----------------------------- | ------- | -------------------------- | -------------------- |
| `PAGARME_API_URL`             | string  | `https://api.pagar.me/...` | URL da API Pagar.me  |
| `NEXT_PUBLIC_DEMO_MODE`       | boolean | `true`                     | Modo demonstração    |
| `NEXT_PUBLIC_DEBUG_MODE`      | boolean | `false`                    | Logs detalhados      |
| `NEXT_PUBLIC_MIN_ORDER_VALUE` | number  | `5000` (R$ 50,00)          | Valor mínimo pedido  |
| `NEXT_PUBLIC_DELIVERY_FEE`    | number  | `1500` (R$ 15,00)          | Taxa de entrega      |
| `NEXT_PUBLIC_DELIVERY_DAYS`   | number  | `15`                       | Prazo entrega (dias) |
| `NEXT_PUBLIC_LOG_LEVEL`       | enum    | `info`                     | Nível de log         |

## 📋 **Schemas Zod Definidos**

### Server Environment Schema

```typescript
const serverEnvSchema = z.object({
  // Secrets (apenas servidor)
  PAGARME_API_KEY: z.string().min(1, "PAGARME_API_KEY é obrigatória"),
  PAGARME_API_URL: z.string().url().default("https://api.pagar.me/core/v5"),

  // Variáveis públicas
  NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_DEMO_MODE: z
    .string()
    .transform((val) => val.toLowerCase() === "true"),
  // ... outros campos
});
```

### Client Environment Schema

```typescript
const clientEnvSchema = z.object({
  // Apenas variáveis NEXT_PUBLIC_* e NODE_ENV
  NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  // ... outros campos públicos
});
```

## 🔧 **Como Usar no Código**

### 1. **Configuração do Servidor**

```typescript
import { getServerEnv } from "@/config/environment";

// Lazy loading - só executa no servidor
const env = getServerEnv();
console.log(env.PAGARME_API_KEY); // ✅ Type-safe e validado
```

### 2. **Configuração do Cliente**

```typescript
import { getClientEnv } from "@/config/environment";

// Apenas variáveis públicas
const env = getClientEnv();
console.log(env.NEXT_PUBLIC_BASE_URL); // ✅ Type-safe e validado
```

### 3. **Helpers Utilitários**

```typescript
import {
  isDevelopment,
  getBusinessConfig,
  formatCurrency,
} from "@/config/environment";

// Detecta ambiente
if (isDevelopment()) {
  console.log("Estamos em desenvolvimento");
}

// Configurações de negócio formatadas
const business = getBusinessConfig();
console.log(business.minOrderValue.formatted); // "R$ 50,00"
```

## 🧪 **Validação e Testes**

### Script de Teste

```bash
bun scripts/test-env.ts
```

### Exemplo de Saída

```
🧪 Testando configurações de ambiente com Zod...

✅ Configurações de ambiente do servidor validadas com sucesso
📋 Resumo das configurações:
🌍 Ambiente: development
🏠 URL Base: http://localhost:3000
💳 Pagar.me: API Key configurada (Teste)
💰 Negócio: Valor mínimo R$ 50,00

✅ Teste concluído com sucesso!
🎯 Todas as configurações foram validadas pelo Zod
```

### Mensagens de Erro Detalhadas

```typescript
// Exemplo de erro do Zod
❌ Erro na validação das variáveis de ambiente do servidor:
PAGARME_API_KEY: Variável de ambiente obrigatória não encontrada
NEXT_PUBLIC_BASE_URL: Invalid url
NEXT_PUBLIC_MIN_ORDER_VALUE: Expected number, received nan
```

## 🎯 Configurações por Ambiente

### Desenvolvimento

```env
PAGARME_API_KEY=ak_test_grXijQ4GicOa2BLGZrDRTR5qNQxJW0
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### Produção

```env
PAGARME_API_KEY=ak_live_sua_chave_real_aqui
NEXT_PUBLIC_BASE_URL=https://seudominio.com.br
NODE_ENV=production
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=error
```

## 🔒 Segurança

### ⚠️ Nunca commite:

- `.env.local`
- `.env.production`
- Qualquer arquivo contendo chaves reais de produção

### ✅ Pode commitir:

- `.env.example`
- `.env.development`
- `.env.test`

### Separação Servidor/Cliente

- **Secrets**: Apenas no servidor (`getServerEnv()`)
- **Públicas**: Disponíveis no cliente (`getClientEnv()`)
- **Lazy Loading**: Evita execução de validação no cliente

## 🚀 Deploy

### Vercel

Configure as variáveis no dashboard:

1. Acesse Settings > Environment Variables
2. Adicione cada variável manualmente
3. Defina o environment (Production/Preview/Development)

### Outras Plataformas

Consulte a documentação da sua plataforma de deploy para configurar as variáveis de ambiente.

## 🆘 Problemas Comuns

### Erro: "PAGARME_API_KEY não encontrada"

- Verifique se o arquivo `.env.local` existe
- Confirme se a variável está corretamente definida
- Reinicie o servidor de desenvolvimento

### Erro: "Invalid API Key"

- Verifique se a chave está correta
- Para desenvolvimento, use chave de teste (`ak_test_...`)
- Para produção, use chave live (`ak_live_...`)

### Variáveis não carregam

- Reinicie o servidor Next.js
- Verifique se não há espaços extras no arquivo .env
- Confirme se as variáveis começam com `NEXT_PUBLIC_` para uso no frontend

## 📚 **Tipos TypeScript**

### Tipos Inferidos

```typescript
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Uso
const env: ServerEnv = getServerEnv();
const clientEnv: ClientEnv = getClientEnv();
```

### IntelliSense Completo

- Autocompletar para todas as propriedades
- Verificação de tipos em tempo de compilação
- Documentação inline via JSDoc

---

Para mais informações sobre Zod, consulte: https://zod.dev/
