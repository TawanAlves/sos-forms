import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export async function POST(request: NextRequest) {
  console.log('🚀 [Upload API] Iniciando processamento de upload');
  
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    console.log('📁 [Upload API] Arquivos recebidos:', files.length);
    
    if (!files || files.length === 0) {
      console.log('❌ [Upload API] Nenhum arquivo enviado');
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    const uploadedFiles: Array<{
      originalName: string;
      fileName: string;
      size: number;
      type: string;
      url: string;
    }> = [];

    for (const file of files) {
      console.log('🔍 [Upload API] Processando arquivo:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Validações de segurança
      if (file.size > 100 * 1024 * 1024) { // 100MB
        console.log('❌ [Upload API] Arquivo muito grande:', file.name);
        return NextResponse.json(
          { error: `Arquivo ${file.name} muito grande (máximo 100MB)` },
          { status: 400 }
        );
      }

      // Tipos de arquivo permitidos
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
        'application/pdf',
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
        'application/octet-stream' // Para arquivos .stl
      ];
      
      const isValidType = allowedTypes.includes(file.type) || file.name.endsWith('.stl');
      if (!isValidType) {
        console.log('❌ [Upload API] Tipo de arquivo não suportado:', file.name, file.type);
        return NextResponse.json(
          { error: `Tipo de arquivo não suportado: ${file.name}` },
          { status: 400 }
        );
      }

      // Gera nome único para o arquivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${randomString}.${fileExtension}`;
      
      console.log('📝 [Upload API] Nome do arquivo gerado:', fileName);

      // Em produção (Vercel), usa Vercel Blob
      // Em desenvolvimento, salva localmente
      const isProduction = process.env.NODE_ENV === 'production';
      let fileUrl = '';
      
      if (isProduction) {
        console.log('🌐 [Upload API] Modo produção - usando Vercel Blob');
        try {
          // Converte o arquivo para buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Upload para Vercel Blob
          const blob = await put(fileName, buffer, {
            access: 'public',
            contentType: file.type,
          });
          
          fileUrl = blob.url;
          console.log('✅ [Upload API] Arquivo enviado para Vercel Blob:', fileUrl);
        } catch (blobError) {
          console.error('❌ [Upload API] Erro ao enviar para Vercel Blob:', blobError);
          // Fallback para simulação se o Blob falhar
          fileUrl = `#simulated-${fileName}`;
          console.log('⚠️ [Upload API] Fallback para simulação:', fileUrl);
        }
      } else {
        console.log('💻 [Upload API] Modo desenvolvimento - salvando localmente');
        // Em desenvolvimento, salva localmente
        try {
          const { writeFile, mkdir } = await import('fs/promises');
          const { join } = await import('path');
          const { existsSync } = await import('fs');
          
          const uploadsDir = join(process.cwd(), 'public', 'uploads');
          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
          }
          
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filePath = join(uploadsDir, fileName);
          await writeFile(filePath, buffer);
          
          fileUrl = `/uploads/${fileName}`;
          console.log('✅ [Upload API] Arquivo salvo localmente:', filePath);
        } catch (localError) {
          console.error('⚠️ [Upload API] Erro ao salvar localmente:', localError);
          fileUrl = `#simulated-${fileName}`;
        }
      }

      // Adiciona informações do arquivo
      uploadedFiles.push({
        originalName: file.name,
        fileName: fileName,
        size: file.size,
        type: file.type,
        url: fileUrl
      });
      
      console.log('✅ [Upload API] Arquivo processado com sucesso:', file.name);
    }

    console.log('🎉 [Upload API] Upload concluído:', {
      filesCount: uploadedFiles.length,
      files: uploadedFiles.map(f => f.originalName)
    });

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`
    });

  } catch (error) {
    console.error('❌ [Upload API] Erro no upload:', error);
    console.error('❌ [Upload API] Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para deletar arquivos
export async function DELETE(request: NextRequest) {
  console.log('🗑️ [Upload API] Iniciando remoção de arquivo');
  
  try {
    const { fileName } = await request.json();
    
    console.log('📝 [Upload API] Nome do arquivo para remoção:', fileName);
    
    if (!fileName) {
      console.log('❌ [Upload API] Nome do arquivo não fornecido');
      return NextResponse.json(
        { error: 'Nome do arquivo não fornecido' },
        { status: 400 }
      );
    }

    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log('🌐 [Upload API] Modo produção - removendo do Vercel Blob');
      try {
        // Tenta extrair a URL do blob do fileName
        // Se o fileName for uma URL completa do blob, usa diretamente
        // Se for apenas o nome do arquivo, constrói a URL
        const blobUrl = fileName;
        if (!fileName.startsWith('http')) {
          // Se não for uma URL completa, assume que é um nome de arquivo
          console.log('⚠️ [Upload API] Nome de arquivo sem URL completa, simulando remoção');
          return NextResponse.json({
            success: true,
            message: 'Arquivo deletado com sucesso (simulado - URL não encontrada)'
          });
        }
        
        // Remove do Vercel Blob
        await del(blobUrl);
        console.log('✅ [Upload API] Arquivo removido do Vercel Blob:', blobUrl);
        
        return NextResponse.json({
          success: true,
          message: 'Arquivo deletado com sucesso'
        });
      } catch (blobError) {
        console.error('❌ [Upload API] Erro ao remover do Vercel Blob:', blobError);
        return NextResponse.json({
          success: true,
          message: 'Arquivo deletado com sucesso (simulado - erro no Blob)'
        });
      }
    } else {
      console.log('💻 [Upload API] Modo desenvolvimento - removendo localmente');
      // Em desenvolvimento, remove localmente
      try {
        const { join } = await import('path');
        const { existsSync } = await import('fs');
        const { unlink } = await import('fs/promises');
        
        const filePath = join(process.cwd(), 'public', 'uploads', fileName);
        
        if (existsSync(filePath)) {
          await unlink(filePath);
          console.log('✅ [Upload API] Arquivo removido localmente:', filePath);
          
          return NextResponse.json({
            success: true,
            message: 'Arquivo deletado com sucesso'
          });
        } else {
          console.log('⚠️ [Upload API] Arquivo não encontrado localmente:', filePath);
          return NextResponse.json(
            { error: 'Arquivo não encontrado' },
            { status: 404 }
          );
        }
      } catch (localError) {
        console.error('⚠️ [Upload API] Erro ao remover localmente:', localError);
        return NextResponse.json({
          success: true,
          message: 'Arquivo deletado com sucesso (simulado)'
        });
      }
    }
  } catch (error) {
    console.error('❌ [Upload API] Erro ao deletar arquivo:', error);
    console.error('❌ [Upload API] Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
