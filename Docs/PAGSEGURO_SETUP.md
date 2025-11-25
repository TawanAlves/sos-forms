# Configuração do PagSeguro - SOS Palmilhas

Este documento explica como configurar e usar o sistema de pagamento integrado com PagSeguro.

## 📧 Visão Geral

O sistema de pagamentos foi implementado usando a **API REST do PagSeguro** e suporta:
- **PIX**: Pagamento instantâneo
- **Cartão de Crédito**: Parcelamento em até 3x sem juros
- **Cartão de Débito**: Pagamento à vista

## 🚀 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e configure as seguintes variáveis:

```bash
# Configurações PagSeguro
PAGSEGURO_TOKEN=your_pagseguro_token_here
PAGSEGURO_ENVIRONMENT=sandbox
PAGSEGURO_SIMULATION_MODE=true

# Configurações SMTP para e-mails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
ADMIN_EMAIL=admin@admin.com

# URL base da aplicação
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Ambiente e configurações
NODE_ENV=development
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEBUG_MODE=true
```

### 2. Configuração do PagSeguro

Para usar o PagSeguro:

1. **Acesse o [Portal do PagSeguro](https://pagseguro.uol.com.br/)**
2. **Faça login na sua conta**
3. **Vá para Integrações > API**
4. **Gere um token de acesso**
5. **Use o token no campo `PAGSEGURO_TOKEN`**

### 3. Ambientes

#### **Sandbox (Desenvolvimento)**
```bash
PAGSEGURO_ENVIRONMENT=sandbox
PAGSEGURO_SIMULATION_MODE=true
```

#### **Produção**
```bash
PAGSEGURO_ENVIRONMENT=production
PAGSEGURO_SIMULATION_MODE=false
PAGSEGURO_TOKEN=seu_token_real_aqui
```

## 🔧 Funcionalidades

### Métodos de Pagamento Suportados

#### **PIX**
- **Pagamento instantâneo**
- **Sem taxas adicionais**
- **Disponível 24h por dia**
- **Confirmação imediata**

#### **Cartão de Crédito**
- **Parcelamento em até 3x sem juros**
- **Validação de dados em tempo real**
- **Suporte a todas as bandeiras**

#### **Cartão de Débito**
- **Pagamento à vista**
- **Validação de dados em tempo real**
- **Suporte a todas as bandeiras**

### Modo de Simulação

Quando `PAGSEGURO_SIMULATION_MODE=true`:
- **Pagamentos são processados localmente**
- **Não há cobrança real**
- **Ideal para desenvolvimento e testes**
- **Retorna resposta de sucesso simulada**

## 🧪 Testes

### 1. Teste de Conexão
```bash
curl http://localhost:3000/api/payment
```

### 2. Teste de Pagamento PIX
```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "pix",
    "amount": 16500,
    "customerData": {
      "name": "Cliente Teste",
      "email": "cliente@teste.com",
      "phone": "+5511999999999"
    }
  }'
```

### 3. Teste de Pagamento com Cartão
```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "credit_card",
    "amount": 16500,
    "installments": 3,
    "customerData": {
      "name": "Cliente Teste",
      "email": "cliente@teste.com",
      "phone": "+5511999999999"
    },
    "cardData": {
      "cardNumber": "4111111111111111",
      "cardHolderName": "NOME DO PORTADOR",
      "cardExpiryMonth": "12",
      "cardExpiryYear": "2025",
      "cardCvv": "123"
    }
  }'
```

## 🔒 Segurança

### Validação de Dados
- **Validação de cartão em tempo real**
- **Sanitização de dados de entrada**
- **Validação de parcelamento (máximo 3x)**

### Processamento Seguro
- **API Routes**: Processamento no servidor
- **Environment Secrets**: Chaves protegidas por variáveis de ambiente
- **Validação Dupla**: Cliente + servidor

### Webhook
- **Notificações automáticas** de status de pagamento
- **Endpoint**: `/api/payment/webhook`
- **Validação de origem** das notificações

## 📱 Interface do Usuário

### Estados Visuais
- **🔄 Processando**: "Processando pagamento..."
- **✅ Sucesso**: "Pagamento realizado com sucesso"
- **❌ Erro**: "Erro ao processar pagamento: [detalhes]"

### PIX
- **QR Code**: Exibido após confirmação
- **Código PIX**: Para copiar e colar
- **Vantagens**: Lista de benefícios do PIX

### Cartão
- **Formulário seguro**: Dados do cartão
- **Parcelamento**: Até 3x sem juros
- **Validação**: Em tempo real

## 🚀 Deploy

### Variáveis de Produção
```env
PAGSEGURO_ENVIRONMENT=production
PAGSEGURO_SIMULATION_MODE=false
PAGSEGURO_TOKEN=seu_token_real_aqui
NEXT_PUBLIC_BASE_URL=https://seudominio.com.br
```

### Webhook em Produção
Configure o webhook no painel do PagSeguro:
```
https://seudominio.com.br/api/payment/webhook
```

## 🐛 Solução de Problemas

### Erro: "Token do PagSeguro não configurado"
- Verifique se `PAGSEGURO_TOKEN` está definido
- Confirme se o token é válido
- Para desenvolvimento, use `PAGSEGURO_SIMULATION_MODE=true`

### Erro: "Método de pagamento não suportado"
- Verifique se o método está na lista permitida
- Confirme se os dados obrigatórios foram fornecidos

### PIX não gera QR Code
- Verifique se o ambiente está configurado corretamente
- Confirme se o token tem permissões para PIX
- Teste em modo de simulação primeiro

## 📋 Logs

O sistema registra logs detalhados:
- Conexão com PagSeguro
- Processamento de pagamentos
- Erros e sucessos
- Webhooks recebidos

## 🔄 Fluxo de Pagamento

1. **Cliente seleciona método de pagamento**
2. **Preenche dados necessários**
3. **Sistema valida dados**
4. **Chama API do PagSeguro**
5. **Processa resposta**
6. **Atualiza status do pedido**
7. **Envia confirmação por e-mail**

## 📞 Suporte

Em caso de problemas:
1. Verifique logs do servidor
2. Teste em modo de simulação
3. Confirme configurações
4. Consulte [documentação oficial do PagSeguro](https://dev.pagseguro.uol.com.br/)

---
### ✅ PIX:
```json
{
  "success": true,
  "transaction": {
    "id": "pix_sim_1758257946019",
    "status": "PENDING",
    "payment_method": {
      "type": "PIX",
      "pix": {
        "qr_code": "00020126580014br.gov.bcb.pix...",
        "qr_code_text": "00020126580014br.gov.bcb.pix...",
        "expiration_date": "2025-09-19T05:29:06.020Z"
      }
    }
  },
  "pixData": {
    "qrCode": "00020126580014br.gov.bcb.pix...",
    "qrCodeText": "00020126580014br.gov.bcb.pix...",
    "expirationDate": "2025-09-19T05:29:06.020Z"
  }
}
```

### ✅ Cartão de Crédito (3x sem juros):

```json
{
  "success": true,
  "transaction": {
    "id": "sim_1758258045359",
    "status": "PAID",
    "payment_method": {
      "type": "DEBIT_CARD",
      "installments": 3,
      "card": {
        "brand": "VISA",
        "first_six_digits": "411111",
        "last_four_digits": "1111"
      }
    }
  }
}
```