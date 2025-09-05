# 🚀 Guia de Deploy - SOS Palmilhas

## ✅ Status do Projeto

O projeto está **PRONTO PARA PRODUÇÃO** com as seguintes configurações:

- ✅ **Build de Produção**: Concluído com sucesso
- ✅ **Linting**: Sem erros ou warnings
- ✅ **TypeScript**: Compilação sem erros
- ✅ **Dependências**: Instaladas com pnpm
- ✅ **Configurações de Ambiente**: Arquivos criados
- ✅ **Teste de Servidor**: Funcionando corretamente

## 📦 Tecnologias Utilizadas

- **Framework**: Next.js 15.4.6
- **Runtime**: Node.js (recomendado v18+ ou v20+)
- **Gerenciador de Pacotes**: pnpm
- **Banco de Dados**: Não requerido (formulário estático)
- **Deploy**: Qualquer plataforma que suporte Node.js

## 🛠️ Comandos de Deploy

### 1. **Instalação de Dependências**

```bash
# Instalar pnpm (se não estiver instalado)
npm install -g pnpm

# Instalar dependências do projeto
pnpm install
```

### 2. **Configuração de Ambiente**

```bash
# Copiar arquivo de exemplo
cp .env.example .env.production

# Editar com suas configurações de produção
nano .env.production
```

### 3. **Build de Produção**

```bash
# Build otimizado para produção
NODE_ENV=production pnpm run build
```

### 4. **Iniciar Servidor de Produção**

```bash
# Servidor de produção
pnpm run start
```

## 🔧 Configurações de Produção

### Variáveis de Ambiente Obrigatórias

```env
# URL base da aplicação (produção)
NEXT_PUBLIC_BASE_URL=https://seudominio.com.br

# Modo de demonstração (false para produção)
NEXT_PUBLIC_DEMO_MODE=false

# Modo de debug (false para produção)
NEXT_PUBLIC_DEBUG_MODE=false

# Chave da API do Pagar.me (produção)
PAGARME_API_KEY=ak_live_sua_chave_real_aqui

# Configurações de e-mail (produção)
SMTP_HOST=smtp.empresa.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@empresa.com
SMTP_PASS=senha_segura_producao
ADMIN_EMAIL=admin@empresa.com

# Ambiente de execução
NODE_ENV=production
```

## 🌐 Opções de Deploy

### 1. **Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Configurar variáveis de ambiente no painel da Vercel
```

### 2. **Railway**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### 3. **DigitalOcean App Platform**

1. Conectar repositório GitHub
2. Configurar build command: `pnpm run build`
3. Configurar start command: `pnpm run start`
4. Adicionar variáveis de ambiente

### 4. **Servidor VPS/Dedicado**

```bash
# No servidor
git clone <seu-repositorio>
cd sos-forms
pnpm install
NODE_ENV=production pnpm run build

# Usando PM2 para gerenciar processo
npm install -g pm2
pm2 start "pnpm run start" --name sos-forms
pm2 save
pm2 startup
```

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] Configurar variáveis de ambiente de produção
- [ ] Testar build localmente: `pnpm run build`
- [ ] Testar servidor localmente: `pnpm run start`
- [ ] Verificar se todas as funcionalidades estão funcionando
- [ ] Configurar domínio e SSL (HTTPS obrigatório)

### Após o Deploy

- [ ] Testar acesso à aplicação
- [ ] Testar formulário completo
- [ ] Testar envio de e-mails
- [ ] Testar sistema de pagamentos (se habilitado)
- [ ] Verificar logs de erro
- [ ] Configurar monitoramento

## 🔍 Testes de Validação

### 1. **Teste do Formulário**

```bash
# Acessar a aplicação
curl -I https://seudominio.com.br

# Deve retornar HTTP 200 OK
```

### 2. **Teste de E-mail**

```bash
# Testar endpoint de e-mail
curl -X POST https://seudominio.com.br/api/email \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### 3. **Teste de Pagamento**

```bash
# Testar endpoint de pagamento
curl -X POST https://seudominio.com.br/api/payment \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "credit_card", "amount": 100}'
```

## 📊 Monitoramento

### Logs Importantes

- **Build logs**: Verificar se não há erros de compilação
- **Runtime logs**: Monitorar erros de execução
- **API logs**: Verificar chamadas para /api/email e /api/payment
- **Performance**: Monitorar tempo de resposta

### Métricas Recomendadas

- **Uptime**: 99.9%+
- **Response Time**: < 2s
- **Error Rate**: < 1%
- **Memory Usage**: Monitorar uso de memória

## 🚨 Troubleshooting

### Problemas Comuns

1. **Build falha**
   ```bash
   # Limpar cache e reinstalar
   rm -rf .next node_modules
   pnpm install
   pnpm run build
   ```

2. **Servidor não inicia**
   ```bash
   # Verificar se a porta está disponível
   lsof -i :3000
   # Usar porta diferente
   PORT=3001 pnpm run start
   ```

3. **E-mails não são enviados**
   - Verificar configurações SMTP
   - Testar credenciais
   - Verificar logs de erro

4. **Pagamentos não funcionam**
   - Verificar chave da API do Pagar.me
   - Testar em modo sandbox primeiro
   - Verificar logs de transação

## 📞 Suporte

Para problemas técnicos:

1. **Logs**: Verificar logs da aplicação
2. **Documentação**: Consultar README.md
3. **Issues**: Abrir issue no repositório
4. **Contato**: [Seu contato técnico]

## 🎉 Deploy Concluído!

Após seguir este guia, sua aplicação SOS Palmilhas estará rodando em produção e pronta para receber pedidos de palmilhas personalizadas!

---

**Desenvolvido com ❤️ pela [Codei Technology](https://codei.tech)**
