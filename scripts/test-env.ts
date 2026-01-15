#!/usr/bin/env bun

/**
 * Script para testar configurações de ambiente com Zod
 * Execute: bun scripts/test-env.ts
 */

import {
  validateEnvironment,
  getServerEnv,
  isProduction,
  isDemoMode,
  getBusinessConfig,
} from "../src/config/environment";

// console.log('🧪 Testando configurações de ambiente com Zod...\n');

try {
  // Valida o ambiente
  validateEnvironment();

  // Obtém as configurações validadas
  const env = getServerEnv();
  const business = getBusinessConfig();

  // console.log('📋 Resumo das configurações:');
  // console.log('─'.repeat(50));

  // Informações básicas
  // console.log(`🌍 Ambiente: ${env.NODE_ENV}`);
  // console.log(`🏠 URL Base: ${env.NEXT_PUBLIC_BASE_URL}`);
  // console.log(`🎭 Modo Demo: ${isDemoMode() ? '✅ Ativo' : '❌ Inativo'}`);
  // console.log(`🐛 Debug: ${env.NEXT_PUBLIC_DEBUG_MODE ? '✅ Ativo' : '❌ Inativo'}`);
  // console.log(`📝 Log Level: ${env.NEXT_PUBLIC_LOG_LEVEL}`);

  // Configurações do Pagar.me
  // console.log('\n💳 Pagar.me:');
  // console.log(`   API Key: ${env.PAGARME_API_KEY.substring(0, 15)}...`);
  // console.log(`   Tipo: ${env.PAGARME_API_KEY.startsWith('ak_test_') ? 'Teste' : 'Produção'}`);
  // console.log(`   URL da API: ${env.PAGARME_API_URL}`);

  // Configurações de negócio
  // console.log('\n💰 Negócio:');
  // console.log(`   Valor mínimo: ${business.minOrderValue.formatted}`);
  // console.log(`   Taxa de entrega: ${business.deliveryFee.formatted}`);
  // console.log(`   Prazo de entrega: ${business.deliveryDays} dias`);

  // Validações específicas
  // console.log('\n🔍 Validações:');

  // Verifica se está usando chave de teste em produção
  // if (isProduction() && env.PAGARME_API_KEY.startsWith("ak_test_")) {
  //   // console.log('⚠️  ATENÇÃO: Usando chave de teste em produção!');
  // } else {
  //   // console.log('✅ Chave do Pagar.me apropriada para o ambiente');
  // }

  // Verifica se o modo demo está adequado
  if (isProduction() && isDemoMode()) {
    // console.log('⚠️  ATENÇÃO: Modo demo ativo em produção!');
  } else {
    // console.log('✅ Modo demo apropriado para o ambiente');
  }

  // Verifica HTTPS em produção
  if (isProduction() && !env.NEXT_PUBLIC_BASE_URL.startsWith("https://")) {
    // console.log('⚠️  ATENÇÃO: URL não usa HTTPS em produção!');
  } else if (isProduction()) {
    // console.log('✅ HTTPS configurado para produção');
  } else {
    // console.log('ℹ️  HTTP em desenvolvimento (OK)');
  }

  // console.log('\n✅ Teste concluído com sucesso!');
  // console.log('🎯 Todas as configurações foram validadas pelo Zod');
} catch (error) {
  console.error("\n❌ Erro na validação:", error);
  // console.log('\n🛠️  Para corrigir:');
  // console.log('1. Verifique se o arquivo .env.local existe');
  // console.log('2. Copie de .env.example se necessário: cp .env.example .env.local');
  // console.log('3. Configure as variáveis obrigatórias');
  // console.log('4. Consulte ENVIRONMENT.md para mais detalhes');
  // console.log('5. O Zod fornece validação detalhada dos tipos e formatos');

  process.exit(1);
}
