# Configuração do Vercel Blob

## 📋 Pré-requisitos

1. **Conta no Vercel**: Certifique-se de ter uma conta ativa no Vercel
2. **Projeto deployado**: O projeto deve estar deployado no Vercel
3. **Vercel CLI**: Instale a CLI do Vercel (opcional)

## 🔧 Configuração

### 1. Instalar Vercel CLI (opcional)
```bash
npm i -g vercel
```

### 2. Fazer login no Vercel
```bash
vercel login
```

### 3. Linkar o projeto
```bash
vercel link
```

### 4. Configurar variáveis de ambiente

No dashboard do Vercel, vá para:
- **Settings** → **Environment Variables**

Adicione as seguintes variáveis:

```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

### 5. Obter o token do Blob

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Vá para **Storage** → **Blob**
3. Crie um novo store ou use um existente
4. Copie o token de leitura/escrita

### 6. Deploy

```bash
vercel --prod
```

## 🚀 Funcionamento

### Desenvolvimento
- Arquivos são salvos localmente em `public/uploads/`
- URLs são relativas: `/uploads/filename.ext`

### Produção
- Arquivos são enviados para o Vercel Blob
- URLs são absolutas: `https://blob.vercel-storage.com/...`
- Acesso público configurado automaticamente

## 📝 Logs

O sistema inclui logs detalhados para debugging:

```javascript
// Upload
console.log('🌐 [Upload API] Modo produção - usando Vercel Blob');
console.log('✅ [Upload API] Arquivo enviado para Vercel Blob:', fileUrl);

// Delete
console.log('🌐 [Upload API] Modo produção - removendo do Vercel Blob');
console.log('✅ [Upload API] Arquivo removido do Vercel Blob:', blobUrl);
```

## 🔍 Troubleshooting

### Erro: "BLOB_READ_WRITE_TOKEN is not defined"
- Verifique se a variável de ambiente está configurada no Vercel
- Faça um novo deploy após adicionar a variável

### Erro: "Blob not found"
- Verifique se o token tem permissões de leitura/escrita
- Confirme se o store do Blob existe

### Upload falha
- Verifique os logs no console do Vercel
- Confirme se o arquivo não excede o limite de tamanho (100MB)

## 📊 Limites

- **Tamanho máximo por arquivo**: 100MB
- **Tipos permitidos**: Imagens, PDFs, vídeos, arquivos .stl
- **Armazenamento**: Ilimitado (conforme plano do Vercel)

## 🔄 Fallback

Se o Vercel Blob falhar, o sistema automaticamente:
1. Registra o erro nos logs
2. Retorna uma URL simulada (`#simulated-filename`)
3. Continua o fluxo sem interromper o usuário
