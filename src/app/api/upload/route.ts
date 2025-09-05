import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verifica se o diretório de uploads existe
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedFiles: Array<{
      originalName: string;
      fileName: string;
      size: number;
      type: string;
      url: string;
    }> = [];

    for (const file of files) {
      // Validações de segurança
      if (file.size > 100 * 1024 * 1024) { // 100MB
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
      
      // Converte o arquivo para buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Salva o arquivo
      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      // Adiciona informações do arquivo
      uploadedFiles.push({
        originalName: file.name,
        fileName: fileName,
        size: file.size,
        type: file.type,
        url: `/uploads/${fileName}`
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para deletar arquivos
export async function DELETE(request: NextRequest) {
  try {
    const { fileName } = await request.json();
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'Nome do arquivo não fornecido' },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    
    if (existsSync(filePath)) {
      const { unlink } = await import('fs/promises');
      await unlink(filePath);
      
      return NextResponse.json({
        success: true,
        message: 'Arquivo deletado com sucesso'
      });
    } else {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      );
      }
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
