#!/bin/bash

# 🚀 Script de Deploy - SOS Palmilhas
# Este script automatiza o processo de deploy para produção

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy do SOS Palmilhas..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm não está instalado. Instalando..."
    npm install -g pnpm
fi

# Verificar se o arquivo .env.production existe
if [ ! -f ".env.production" ]; then
    print_warning "Arquivo .env.production não encontrado. Criando a partir do exemplo..."
    cp .env.example .env.production
    print_warning "IMPORTANTE: Configure as variáveis de ambiente em .env.production antes de continuar!"
    read -p "Pressione Enter para continuar após configurar o arquivo..."
fi

# Instalar dependências
print_status "Instalando dependências..."
pnpm install

# Executar linting
print_status "Executando linting..."
pnpm run lint

# Build de produção
print_status "Executando build de produção..."
NODE_ENV=production pnpm run build

print_success "Build concluído com sucesso!"

# Verificar se o build foi criado
if [ -d ".next" ]; then
    print_success "Diretório .next criado com sucesso!"
else
    print_error "Erro: Diretório .next não foi criado!"
    exit 1
fi

# Testar servidor (opcional)
read -p "Deseja testar o servidor localmente? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Iniciando servidor de teste..."
    print_warning "O servidor será iniciado em http://localhost:3000"
    print_warning "Pressione Ctrl+C para parar o servidor"
    
    # Iniciar servidor em background
    pnpm run start &
    SERVER_PID=$!
    
    # Aguardar servidor iniciar
    sleep 5
    
    # Testar se está respondendo
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        print_success "Servidor está funcionando corretamente!"
    else
        print_error "Servidor não está respondendo corretamente!"
    fi
    
    # Parar servidor
    kill $SERVER_PID
fi

print_success "Deploy preparado com sucesso!"
print_status "Próximos passos:"
echo "1. Configure as variáveis de ambiente em .env.production"
echo "2. Escolha uma plataforma de deploy (Vercel, Railway, DigitalOcean, etc.)"
echo "3. Siga as instruções no arquivo DEPLOY.md"
echo "4. Teste todas as funcionalidades após o deploy"

print_success "🎉 Projeto pronto para produção!"
