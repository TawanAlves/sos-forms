#!/usr/bin/env bun

/**
 * Script para testar a configuração de e-mail
 * Executa: bun run scripts/test-email.ts
 */

import { emailService } from "../src/lib/email";
import { getServerEnv } from "../src/config/environment";

async function testEmailConfiguration() {
  // console.log('🧪 Testando Configuração de E-mail - SOS Palmilhas\n');

  try {
    // 1. Verificar variáveis de ambiente
    // console.log('1️⃣ Verificando variáveis de ambiente...');
    const env = getServerEnv();

    // console.log('✅ Variáveis carregadas com sucesso:');
    // console.log(`   - SMTP_HOST: ${env.SMTP_HOST}`);
    // console.log(`   - SMTP_PORT: ${env.SMTP_PORT}`);
    // console.log(`   - SMTP_SECURE: ${env.SMTP_SECURE}`);
    // console.log(`   - SMTP_USER: ${env.SMTP_USER}`);
    // console.log(`   - ADMIN_EMAIL: ${env.ADMIN_EMAIL}`);
    // console.log(`   - SMTP_PASS: ${env.SMTP_PASS ? '***configurado***' : '❌ NÃO CONFIGURADO'}\n`);

    // 2. Testar conexão SMTP
    // console.log('2️⃣ Testando conexão SMTP...');
    const isConnected = await emailService.verifyConnection();

    if (isConnected) {
      // console.log('✅ Conexão SMTP estabelecida com sucesso!\n');
    } else {
      // console.log('❌ Falha na conexão SMTP\n');
      return;
    }

    // 3. Testar envio de e-mails (opcional)
    // console.log('3️⃣ Deseja testar o envio de e-mails? (y/N)');

    // Para teste automático, você pode descomentar as linhas abaixo
    /*
    // console.log('📧 Enviando e-mails de teste...');
    
    const testFormData = {
      prescription: { prescriptionType: 'self' },
      clientData: {
        email: 'teste@exemplo.com',
        professionalName: 'Dr. Teste',
        whatsapp: '(11) 99999-9999'
      },
      previousOrder: { isPreviousOrder: 'no', previousOrderDescription: '' },
      navicularMeasurement: {
        rightFootSitting: '25cm',
        rightFootStanding: '26cm',
        leftFootSitting: '25cm',
        leftFootStanding: '26cm'
      },
      prescriptionSummary: { manualPrescription: 'Teste de prescrição' },
      printingModel: { modelType: 'printer3d' },
      blockType: { blockType: '' },
      insoleRequest: { insoleType: 'tenis' },
      sapatoInteira: {
        quantity: '',
        braSize: '',
        measurements: '',
        coverageType: '',
        nextAction: ''
      },
      palmilhaPrescription: { selectedArea: 'conforto', corrections: [] },
      importantInfo: { additionalInfo: 'Teste', addPoronLayer: 'no' },
      antepePrescription: {
        rightFootPrescription: '',
        rightFootCustomDescription: '',
        leftFootPrescription: '',
        leftFootCustomDescription: '',
        reliefPoints: [],
        materialsDescription: ''
      },
      mediopePrescription: {
        rightFootPrescriptions: [],
        rightFootCustomDescription: '',
        leftFootPrescriptions: [],
        leftFootCustomDescription: '',
        reliefPoints: [],
        materialsDescription: ''
      },
      retropePrescription: {
        rightFootPrescription: [],
        leftFootPrescription: '',
        rightFootCustomDescription: '',
        leftFootCustomDescription: '',
        calcoDescription: '',
        notFoundDescription: '',
        calcoCustomDescription: '',
        notFoundRightFootDescription: '',
        leftFootSecondPrescription: [],
        leftFootSecondCustomDescription: '',
        leftFootNotFoundDescription: '',
        calcoLeftDescription: '',
        poronSelected: false,
        psShockSelected: false,
        materialsLocationDescription: '',
        reliefPoints: []
      },
      files: { uploadedFiles: [], wantToReview: 'no' },
      review: { confirmed: true },
      finalize: { orderConfirmed: true, orderNumber: 'TEST-001' }
    };

    const emailResult = await emailService.sendAllEmails(testFormData);
    
    if (emailResult.success) {
      // console.log('✅ E-mails de teste enviados com sucesso!');
      // console.log(`📧 Admin: ${env.ADMIN_EMAIL}`);
      // console.log(`📧 Usuário: teste@exemplo.com`);
    } else {
      // console.log('❌ Falha no envio dos e-mails de teste');
      // console.log(`   Admin: ${emailResult.adminEmail ? '✅' : '❌'}`);
      // console.log(`   Usuário: ${emailResult.userEmail ? '✅' : '❌'}`);
    }
    */

    // console.log('\n🎉 Teste de configuração concluído!');
    // console.log('📧 O sistema de e-mails está configurado e funcionando corretamente.');
  } catch (error) {
    console.error("\n❌ Erro durante o teste:", error);

    if (error instanceof Error && error.message.includes("SMTP_HOST")) {
      // console.log('\n💡 Dica: Verifique se o arquivo .env.local está configurado corretamente');
      // console.log('   Execute: cp .env.example .env.local');
      // console.log('   Edite: nano .env.local');
    }
  }
}

// Executar teste
testEmailConfiguration().catch(console.error);
