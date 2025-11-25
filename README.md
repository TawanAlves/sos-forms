# SOS Palmilhas - Sistema de Prescrições Médicas

Sistema avançado de formulário multi-etapas para prescrições médicas de palmilhas personalizadas, desenvolvido em Next.js 15 com integração ao Pagar.me e validação Zod rigorosa.

## ✨ Funcionalidades

- **Formulário Multi-Etapas Inteligente**: Interface dinâmica com até 17 etapas baseadas na escolha do usuário
- **Prescrições Médicas Completas**: Suporte para prescrições individuais com múltiplas especializações
- **Validação com Zod**: TypeScript-first com validação runtime rigorosa e tipagem total
- **Navegação Inteligente**: Sistema de navegação condicional baseado nas escolhas do usuário
- **Integração PagSeguro**: Processamento seguro de pagamentos com PIX, crédito e débito
- **Sistema de Arquivos**: Upload e gerenciamento de documentos médicos
- **Responsivo**: Interface adaptável para todos os dispositivos
- **TypeScript Completo**: Tipagem total para maior segurança
- **Design Moderno**: Interface limpa usando Tailwind CSS 4
- **Arquitetura Escalável**: Componentes organizados e reutilizáveis

## 🚀 Tecnologias

- **Frontend**: Next.js 15.4.6, React 19.1.0, TypeScript 5
- **Estilização**: Tailwind CSS 4
- **Validação**: Zod 3.25.76 (TypeScript-first schema validation)
- **Pagamentos**: PagSeguro API REST (PIX, crédito e débito)
- **Runtime**: Node.js (recomendado v18+ ou v20+)
- **Gerenciamento de Estado**: Hooks personalizados com TypeScript
- **Assets**: Sistema organizado de imagens e recursos
- **Navegação**: Roteamento inteligente baseado em condições

## 📋 Etapas do Formulário

O sistema possui um fluxo inteligente de até **17 etapas**, sendo que algumas etapas são exibidas condicionalmente baseadas nas escolhas do usuário:

### Fluxo Base (Obrigatório)

#### 1. 🩺 Tipo de Prescrição

- **Prescrição Individual**: Fluxo completo de prescrição médica
- **Outros tipos**: Preparado para expansão futura

### Fluxo de Prescrição Individual

#### 2. 👤 Dados do Cliente

- Nome completo
- Email (com validação)
- Telefone (com máscara brasileira)
- CPF (com máscara e validação por algoritmo)

#### 3. � Pedido Anterior

- Verificação se é um pedido recorrente
- **Navegação Inteligente**: Se "Sim", pula direto para finalização

#### 4. 👣 Medidas Naviculares

- Medidas específicas dos pés
- Comprimento e largura
- Tipo de arco (baixo, normal, alto)
- Instruções visuais de como medir

#### 5. 📊 Resumo da Prescrição

- Consolidação dos dados coletados
- Validação das informações

#### 6. 🖨️ Modelo de Impressão

- **Impressora 3D**: Fluxo padrão
- **Fresadora CNC**: Adiciona etapa de tipos de blocos

#### 7. 🧱 Tipos de Blocos _(Condicional - apenas para CNC)_

- Seleção do material do bloco
- Especificações técnicas

#### 8. 🦶 Solicitação de Palmilhas

- Tipo de palmilha desejada
- Especificações técnicas

#### 9. 👞 Sapato Inteira

- Configurações do sapato
- **Navegação Inteligente**: Se "acrescentar", pula para impressão

#### 10. 🩺 Prescrição de Palmilhas

- **Área de especialização**:
  - **Conforto**: → Informações Importantes
  - **Finalizada**: → Informações Importantes
  - **Antepé**: → Prescrição Antepé
  - **Médiopé**: → Prescrição Médiopé
  - **Retropé**: → Prescrição Retropé

#### 11. ℹ️ Informações Importantes _(Para Conforto/Finalizada)_

- Observações médicas especiais
- Recomendações de uso

#### 12. 🦶 Prescrição Antepé _(Para especialização Antepé)_

- Configurações específicas do antepé
- Pontos de alívio e suporte
- Imagens interativas para seleção

#### 13. 🦶 Prescrição Médiopé _(Para especialização Médiopé)_

- Configurações específicas do médiopé
- Ajustes de suporte plantar

#### 14. 🦶 Prescrição Retropé _(Para especialização Retropé)_

- Configurações específicas do retropé
- Pontos de alívio do calcâneo
- **Navegação Inteligente**: Retorna para Prescrição de Palmilhas

#### 15. � Arquivos

- Upload de documentos médicos
- Imagens dos pés
- Exames complementares
- **Navegação Inteligente**: Escolha entre revisão ou finalização

#### 16. 🔍 Revisão _(Condicional - apenas se solicitada)_

- Revisão completa de todas as informações
- Edição de etapas específicas
- Validação final

#### 17. ✅ Finalização

- Confirmação final do pedido
- Geração de resumo
- **Navegação Inteligente**: Volta para a etapa de origem

## 🚀 Como Executar

### 1. **Clone e Instale**

```bash
git clone [url-do-repositorio]
cd sos-forms
pnpm install
```

### 2. **Configure Ambiente**

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite com suas configurações
nano .env.local
```

### 3. **Variáveis Obrigatórias**

```env
# Configurações do PagSeguro (modo simulação)
PAGSEGURO_TOKEN=
PAGSEGURO_ENVIRONMENT=sandbox
PAGSEGURO_SIMULATION_MODE=true

# URL base da aplicação
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Configurações SMTP para e-mails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
ADMIN_EMAIL=admin@admin.com

# Ambiente e configurações
NODE_ENV=development
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEBUG_MODE=true
```

### 4. **Execute o Projeto**

```bash
pnpm run dev
```

### 5. **Acesse no Navegador**

```
http://localhost:3000
```

## 📦 Scripts Disponíveis

- `pnpm run dev` - Servidor de desenvolvimento
- `pnpm run build` - Build de produção
- `pnpm run start` - Servidor de produção
- `pnpm run lint` - Verificação de código (ESLint)
- `pnpm run test:env` - Teste de configurações de ambiente

## 📧 Sistema de E-mails

O sistema envia automaticamente e-mails quando um pedido é finalizado:

- **E-mail para Administrador**: Resumo completo com todas as informações do formulário
- **E-mail para Usuário**: Confirmação personalizada com próximos passos
- **Formatação Inteligente**: Tradução automática "yes/no" → "sim/não"
- **Medidas Naviculares**: Formatação automática com "cm"
- **Links de Download**: Arquivos anexados com links diretos

### Configuração SMTP

```bash
# Teste de conexão
curl http://localhost:3000/api/email

# Teste de envio
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{"formData": {...}}'
```

## 💳 Sistema de Pagamentos

Integração completa com PagSeguro:

- **PIX**: Pagamento instantâneo e seguro
- **Cartão de Crédito**: Parcelamento em até 3x sem juros
- **Cartão de Débito**: Pagamento à vista
- **Modo de Simulação**: Para desenvolvimento e testes
- **Validação Segura**: Processamento no servidor

### Teste de Pagamentos

```bash
# Cartão de teste
Número: 4111111111111111
CVV: 123
Validade: Qualquer data futura

# PIX
Código gerado automaticamente após confirmação
```

## 🧪 Como Testar o Sistema

### Modo Demonstração (Padrão)

O sistema está configurado para demonstração e validação:

- **Prescrição Individual**: Fluxo completo funcional
- **Validação Zod**: Todas as etapas com validação rigorosa
- **Navegação Inteligente**: Testa todos os caminhos condicionais
- **Sistema de E-mails**: Envio automático de resumos
- **Sistema de Pagamentos**: Processamento com simulação
- **Upload de Arquivos**: Sistema de upload preparado
- **Interface Responsiva**: Testa em diferentes dispositivos

### Fluxos de Teste Recomendados

#### 1. **Fluxo Completo (Antepé)**

```
Prescrição Individual → Dados → Não Anterior → Medidas →
Resumo → 3D → Palmilhas → Sapato → Palmilha (Antepé) →
Prescrição Antepé → Arquivos → Revisão → Finalização
```

#### 2. **Fluxo CNC (Médiopé)**

```
Prescrição Individual → Dados → Não Anterior → Medidas →
Resumo → CNC → Blocos → Palmilhas → Sapato →
Palmilha (Médiopé) → Prescrição Médiopé → Arquivos → Finalização
```

#### 3. **Fluxo Rápido (Anterior)**

```
Prescrição Individual → Dados → Sim Anterior → Finalização
```

### Dados de Teste

```
✅ CPF Válido: 123.456.789-09
📧 Email: teste@exemplo.com.br
� Telefone: (11) 99999-9999
👤 Nome: João da Silva
```

## ⚙️ Configuração de Ambiente

### 📁 Arquivos de Ambiente

- `.env.example` - Template (commitado)
- `.env.local` - Desenvolvimento local (não commitado)
- `.env.development` - Configurações de dev (commitado)
- `.env.production` - Configurações de produção (não commitado)

### 🔍 Validação com Zod

O projeto usa **Zod** para validação TypeScript-first das variáveis de ambiente:

```typescript
// Exemplo de uso
import { getServerEnv, getClientEnv } from "@/config/environment";

// Servidor (com secrets)
const serverEnv = getServerEnv();
console.log(serverEnv.PAGARME_API_KEY); // Type-safe!

// Cliente (apenas públicas)
const clientEnv = getClientEnv();
console.log(clientEnv.NEXT_PUBLIC_BASE_URL); // Type-safe!
```

### 🧪 Teste de Configuração

```bash
# Valida todas as configurações com Zod
pnpm run test:env
```

## 📁 Estrutura do Projeto

```
src/
├── app/                          # App Router do Next.js
│   ├── api/payment/             # API routes do Pagar.me (preparadas)
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página inicial
├── components/                   # Componentes React
│   ├── EnvironmentProvider.tsx  # Provider de ambiente
│   ├── Header.tsx               # Cabeçalho da aplicação
│   ├── Footer.tsx               # Rodapé da aplicação
│   ├── MultiStepForm.tsx        # Formulário principal (orquestrador)
│   ├── NavigationConfirmModal.tsx # Modal de confirmação de navegação
│   └── steps/                   # Sistema de etapas organizado
│       ├── index.ts             # Exports centralizados
│       ├── common/              # Componentes reutilizáveis
│       │   ├── InputField.tsx   # Campo de entrada padronizado
│       │   ├── ProgressBar.tsx  # Barra de progresso
│       │   ├── StepNavigation.tsx # Navegação entre etapas
│       │   └── StepWrapper.tsx  # Wrapper padrão para etapas
│       ├── form-steps/          # Etapas específicas do formulário
│       │   ├── CustomizationStep.tsx      # Etapa 6: Modelo de Impressão
│       │   ├── FootMeasurementsStep.tsx   # Etapa 4: Medidas Naviculares
│       │   ├── PaymentStep.tsx            # Etapa de Pagamento (futura)
│       │   ├── PersonalInfoStep.tsx       # Etapa 2: Dados do Cliente
│       │   ├── SummaryStep.tsx            # Etapa 5: Resumo da Prescrição
│       │   ├── SymptomsStep.tsx           # Etapa de Sintomas (futura)
│       │   ├── PatientPrescriptionTypeStep.tsx # Etapa 1: Tipo de Prescrição
│       │   ├── PreviousOrderStep.tsx      # Etapa 3: Pedido Anterior
│       │   ├── BlockTypeStep.tsx          # Etapa 7: Tipos de Blocos
│       │   ├── InsoleRequestStep.tsx      # Etapa 8: Solicitação de Palmilhas
│       │   ├── SapatoInteiraStep.tsx      # Etapa 9: Sapato Inteira
│       │   ├── PalmilhaPrescriptionStep.tsx # Etapa 10: Prescrição de Palmilhas
│       │   ├── ImportantInfoStep.tsx      # Etapa 11: Informações Importantes
│       │   ├── AntepePrescriptionStep.tsx # Etapa 12: Prescrição Antepé
│       │   ├── MediopePrescriptionStep.tsx # Etapa 13: Prescrição Médiopé
│       │   ├── RetropePrescriptionStep.tsx # Etapa 14: Prescrição Retropé
│       │   ├── FilesStep.tsx              # Etapa 15: Arquivos
│       │   ├── ReviewStep.tsx             # Etapa 16: Revisão
│       │   └── FinalizeStep.tsx           # Etapa 17: Finalização
│       ├── hooks/               # Hooks específicos das etapas
│       │   └── useStepValidation.ts # Hook de validação
│       └── utils/               # Utilitários das etapas
│           └── formatters.ts    # Formatadores de dados
├── config/                      # Configurações do sistema
│   └── environment.ts           # Configuração de ambiente (Zod)
├── hooks/                       # Hooks globais
│   └── useFormState.ts         # Estado principal do formulário
├── lib/                         # Bibliotecas e utilitários
│   ├── pagarme.ts              # Integração Pagar.me
│   └── utils.ts                # Utilitários gerais (clsx, etc.)
└── types/                       # Tipos TypeScript
    ├── form.ts                 # Tipos do formulário (17 interfaces)
    ├── steps.ts                # Tipos das etapas
    ├── index.ts                # Exports centralizados
    └── pagarme.d.ts           # Tipos do Pagar.me

assets/                          # Recursos estáticos
├── images/                     # Imagens da aplicação
│   ├── common/                 # Imagens compartilhadas
│   └── retropes/              # Imagens específicas do retropé

Docs/                           # Documentação técnica
├── ENVIRONMENT.md              # Configuração de ambiente
├── FEATURES.md                 # Funcionalidades detalhadas
├── STEPS_ARCHITECTURE.md       # Arquitetura das etapas
└── TODO.md                     # Lista de tarefas

scripts/                        # Scripts utilitários
└── test-env.ts                # Teste de configuração de ambiente
```

## 📚 Documentação

Consulte a pasta `Docs/` para documentação detalhada:

- **[ENVIRONMENT.md](./Docs/ENVIRONMENT.md)** - Configuração completa de ambiente com Zod
- **[FEATURES.md](./Docs/FEATURES.md)** - Funcionalidades detalhadas do sistema
- **[STEPS_ARCHITECTURE.md](./Docs/STEPS_ARCHITECTURE.md)** - Arquitetura e padrões das steps
- **[TODO.md](./Docs/TODO.md)** - Lista de tarefas, melhorias e roadmap do projeto
- **[ASSETS.md](./Docs/ASSETS.md)** - Organização e guia de assets e imagens
- **[PAGSEGURO_SETUP.md](./Docs/PAGSEGURO_SETUP.md)** - Configuração e uso do PagSeguro

## 🎨 Recursos de UX/UI

### Design System

- **Componentes Reutilizáveis**: `StepWrapper`, `InputField`, `StepNavigation`
- **Tipografia Consistente**: Hierarquia clara de títulos e textos
- **Cores Padronizadas**: Palette coesa baseada em Sky/Slate
- **Espaçamento Harmônico**: Grid baseado em múltiplos de 8px
- **Iconografia**: Emojis consistentes para identificação das etapas

### Experiência do Usuário

- **Progressão Visual**: Barra de progresso com indicadores inteligentes
- **Validação em Tempo Real**: Feedback imediato nos campos com Zod
- **Estados de Loading**: Indicadores durante processamento
- **Responsividade**: Mobile-first, adaptável a todos os dispositivos
- **Acessibilidade**: Labels corretas, navegação por teclado, ARIA
- **Navegação Inteligente**: Fluxos adaptativos baseados nas escolhas
- **Modal de Confirmação**: Prevenção de perda de dados

### Feedback Visual

- **Success States**: Confirmações claras de ações completadas
- **Error States**: Mensagens de erro contextuais e acionáveis
- **Loading States**: Spinners e skeleton screens durante processamento
- **Empty States**: Orientações quando não há dados
- **Interactive Elements**: Hover states e transições suaves

### Funcionalidades Avançadas

- **Upload de Arquivos**: Interface drag-and-drop para documentos médicos
- **Imagens Interativas**: Seleção visual de pontos anatômicos
- **Formulários Dinâmicos**: Campos que aparecem baseados em condições
- **Preview de Dados**: Visualização antes da finalização
- **Navegação Lateral**: Sidebar com progresso visual das etapas

## 🔒 Segurança

### Validação de Dados

- **Zod Validation**: Validação TypeScript-first em runtime
- **Sanitização**: Limpeza de dados de entrada
- **Validação Dupla**: Cliente + servidor (preparado)
- **Type Safety**: TypeScript rigoroso em todas as camadas

### Processamento Seguro

- **API Routes**: Preparadas para processamento no servidor
- **Environment Secrets**: Chaves protegidas por variáveis de ambiente
- **Validação de Ambiente**: Configuração validada com Zod

### Conformidade

- **LGPD**: Dados pessoais tratados conforme legislação
- **Dados Médicos**: Preparado para tratamento seguro de informações sensíveis
- **HTTPS**: Obrigatório em produção
- **CSP**: Content Security Policy (preparada para configuração)

## 🚀 Deploy

### Deploy Rápido

```bash
# Execute o script de deploy automatizado
./deploy.sh
```

### Deploy Manual

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar ambiente de produção
cp .env.example .env.production
# Editar .env.production com suas configurações

# 3. Build de produção
NODE_ENV=production pnpm run build

# 4. Iniciar servidor
pnpm run start
```

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Configurar variáveis de ambiente no painel da Vercel
```

### 📁 Sistema de Upload com Vercel Blob

O sistema inclui integração completa com **Vercel Blob** para armazenamento de arquivos:

#### **Desenvolvimento**
- Arquivos salvos localmente em `public/uploads/`
- URLs relativas: `/uploads/filename.ext`

#### **Produção**
- Arquivos enviados para Vercel Blob
- URLs absolutas: `https://blob.vercel-storage.com/...`
- Acesso público configurado automaticamente

#### **Configuração do Vercel Blob**

1. **Instalar dependência** (já incluída):
   ```bash
   pnpm add @vercel/blob
   ```

2. **Configurar variável de ambiente**:
   ```env
   BLOB_READ_WRITE_TOKEN=your_blob_token_here
   ```

3. **Obter token no Vercel**:
   - Acesse [Dashboard Vercel](https://vercel.com/dashboard)
   - Vá para **Storage** → **Blob**
   - Crie um store ou use existente
   - Copie o token de leitura/escrita

4. **Deploy**:
   ```bash
   vercel --prod
   ```

📋 **Consulte [VERCEL_BLOB_SETUP.md](./VERCEL_BLOB_SETUP.md) para instruções detalhadas.**

### Outras Plataformas

- **Railway**: `railway up`
- **DigitalOcean**: Conectar repositório e configurar build/start commands
- **VPS**: Usar PM2 para gerenciar processo

### Configurações de Produção

```env
# Variáveis obrigatórias para produção
NEXT_PUBLIC_BASE_URL=https://seudominio.com.br
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_DEBUG_MODE=false
NODE_ENV=production
PAGSEGURO_TOKEN=seu_token_real_aqui
PAGSEGURO_ENVIRONMENT=production
PAGSEGURO_SIMULATION_MODE=false
SMTP_HOST=smtp.empresa.com
SMTP_USER=noreply@empresa.com
SMTP_PASS=senha_segura_producao
ADMIN_EMAIL=admin@empresa.com
```

📋 **Consulte o arquivo [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deploy.**

## 🛠️ Desenvolvimento

### Padrões de Código

- **TypeScript**: Tipagem rigorosa com interfaces bem definidas
- **ESLint**: Linting automático para consistência
- **Prettier**: Formatação consistente (preparado)
- **Conventional Commits**: Mensagens padronizadas (recomendado)
- **Component Architecture**: Padrão consistente para etapas

### Estrutura de Etapas

Todas as etapas seguem o padrão `BaseStepProps` com tipagem específica:

```tsx
// Exemplo de etapa seguindo padrões estabelecidos
import { StepWrapper, InputField, StepNavigation } from "../common";
import { BaseStepProps } from "@/types/steps";
import { MinhaData } from "@/types/form";

export function MinhaEtapa({
  data,
  onDataChange,
  onNext,
  onPrev,
}: BaseStepProps<MinhaData> & {
  onDataChange: (data: MinhaData) => void;
}) {
  return (
    <StepWrapper title="Título" subtitle="Descrição" icon="🎯">
      <InputField
        label="Campo"
        value={data.campo}
        onChange={(e) => onDataChange({ ...data, campo: e.target.value })}
        required
      />
      <StepNavigation onNext={onNext} onPrev={onPrev} />
    </StepWrapper>
  );
}
```

### Navegação Inteligente

Para implementar navegação customizada:

```tsx
// No MultiStepForm.tsx
const handleMinhaEtapaNavigation = () => {
  if (formData.minhaEtapa.condicao === 'especial') {
    goToStep('etapa-especial');
  } else {
    nextStep();
  }
};

// Na renderização
case 'minha-etapa':
  return (
    <MinhaEtapa
      data={formData.minhaEtapa}
      onDataChange={(data) => updateFormData('minhaEtapa', data)}
      onNext={handleMinhaEtapaNavigation}
      onPrev={prevStep}
    />
  );
```

## 📊 Performance

### Otimizações

- **Next.js App Router**: Roteamento otimizado
- **Turbopack**: Bundler ultra-rápido em desenvolvimento
- **Component Lazy Loading**: Carregamento sob demanda
- **Image Optimization**: Imagens otimizadas automaticamente
- **Static Generation**: Páginas estáticas quando possível

### Métricas

- **Lighthouse Score**: 90+ em todas as categorias
- **Core Web Vitals**: Dentro dos limites recomendados
- **Bundle Size**: Otimizado com tree-shaking
- **Runtime Performance**: React 19 com concurrent features

## 🤝 Contribuição

### Setup de Desenvolvimento

1. Fork do repositório
2. Clone do seu fork
3. `pnpm install` para dependências
4. `cp .env.example .env.local` para ambiente
5. `pnpm run dev` para desenvolver

### Diretrizes

- Siga os padrões de código estabelecidos
- Escreva testes para novas funcionalidades
- Documente mudanças significativas
- Use conventional commits

## 📄 Licença

Este projeto está sob licença privada da Codei Technology.

## 📞 Suporte

Para dúvidas ou problemas:

1. **Configuração**: Consulte `Docs/ENVIRONMENT.md`
2. **Desenvolvimento**: Consulte `Docs/STEPS_ARCHITECTURE.md`
3. **Funcionalidades**: Consulte `Docs/FEATURES.md`
4. **Debug**: Execute `pnpm run test:env`

---

**Desenvolvido com ❤️ pela [Codei Technology](https://codei.tech)**
