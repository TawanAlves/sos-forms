# 🖼️ Assets e Recursos - SOS Palmilhas

Documentação da organização e gestão de recursos visuais do sistema.

## 📁 Estrutura de Assets

```
assets/
├── images/                          # Imagens da aplicação
│   ├── common/                      # Imagens compartilhadas
│   │   ├── pe-esquerdo.png         # Imagem do pé esquerdo
│   │   ├── pe-direito.png          # Imagem do pé direito
│   │   ├── sapato-exemplo.png      # Exemplo de sapato
│   │   └── palmilha-base.png       # Palmilha base
│   ├── retropes/                    # Imagens específicas do retropé
│   │   ├── retrope-01.png          # Configuração de retropé 1
│   │   ├── retrope-02.png          # Configuração de retropé 2
│   │   ├── retrope-03.png          # Configuração de retropé 3
│   │   └── retrope-04.png          # Configuração de retropé 4
│   ├── antepes/                     # Imagens específicas do antepé (futuro)
│   │   └── (em desenvolvimento)
│   └── mediopé/                     # Imagens específicas do médiopé (futuro)
│       └── (em desenvolvimento)
└── documents/                       # Documentos de referência (futuro)
    ├── templates/                   # Templates de relatórios
    └── examples/                    # Exemplos de prescrições
```

## 🎯 Convenções de Nomenclatura

### Padrões de Arquivo

#### **Imagens de Pés**

- `pe-esquerdo.png` - Pé esquerdo (vista plantar)
- `pe-direito.png` - Pé direito (vista plantar)
- `pe-lateral-esquerdo.png` - Vista lateral esquerda
- `pe-lateral-direito.png` - Vista lateral direita

#### **Imagens de Retropé**

- `retrope-{numero}.png` - Numeração sequencial (01, 02, 03...)
- `retrope-{tipo}-{variacao}.png` - Ex: `retrope-alivio-central.png`

#### **Configurações Específicas**

- `{area}-{tipo}-{numero}.png` - Ex: `antepe-metatarso-01.png`
- `{especialidade}-exemplo.png` - Ex: `mediope-exemplo.png`

### Especificações Técnicas

#### **Formato e Qualidade**

- **Formato**: PNG com transparência
- **Resolução**: Mínimo 300x300px, máximo 800x800px
- **Compressão**: Otimizada para web (< 100KB por imagem)
- **Background**: Transparente quando possível

#### **Dimensões Padrão**

- **Ícones**: 64x64px, 128x128px
- **Imagens de Referência**: 400x400px
- **Imagens Detalhadas**: 600x600px
- **Diagramas**: 800x600px

## 🔗 Uso nos Componentes

### Importação Padronizada

```tsx
// Caminho base para imagens comuns
const IMAGES_PATH = "/assets/images/common";

// Caminho para imagens específicas
const RETROPE_IMAGES_PATH = "/assets/images/retropes";

// Exemplo de uso
const peEsquerdo = `${IMAGES_PATH}/pe-esquerdo.png`;
const retrope01 = `${RETROPE_IMAGES_PATH}/retrope-01.png`;
```

### Componente de Imagem Reutilizável

```tsx
interface MedicalImageProps {
  src: string;
  alt: string;
  area?: "antepe" | "mediope" | "retrope" | "common";
  size?: "small" | "medium" | "large";
  interactive?: boolean;
}

export function MedicalImage({
  src,
  alt,
  area = "common",
  size = "medium",
  interactive = false,
}: MedicalImageProps) {
  const basePath =
    area === "common" ? "/assets/images/common" : `/assets/images/${area}s`;

  const imagePath = src.startsWith("http") ? src : `${basePath}/${src}`;

  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
  };

  return (
    <img
      src={imagePath}
      alt={alt}
      className={`
        ${sizeClasses[size]}
        object-contain
        ${
          interactive
            ? "cursor-pointer hover:opacity-80 transition-opacity"
            : ""
        }
      `}
    />
  );
}
```

## 🎨 Imagens por Etapa

### **Etapa 4: Medidas Naviculares**

```tsx
// Imagens utilizadas
-pe -
  esquerdo.png - // Demonstração de medida
  pe -
  direito.png; // Demonstração de medida
```

### **Etapa 12: Prescrição Antepé**

```tsx
// Imagens utilizadas
-pe -
  esquerdo.png - // Base para seleção de pontos
  pe -
  direito.png; // Base para seleção de pontos
```

### **Etapa 13: Prescrição Médiopé**

```tsx
// Imagens utilizadas
-pe -
  esquerdo.png - // Visualização do arco
  pe -
  direito.png; // Visualização do arco
```

### **Etapa 14: Prescrição Retropé**

```tsx
// Imagens utilizadas
-pe -
  esquerdo.png - // Base anatômica
  pe -
  direito.png - // Base anatômica
  retrope -
  (01).png - // Opção de configuração 1
  retrope -
  (02).png - // Opção de configuração 2
  retrope -
  (03).png - // Opção de configuração 3
  retrope -
  (04).png; // Opção de configuração 4
```

### **Etapa 6: Modelo de Impressão**

```tsx
// Imagens utilizadas
-sapato -
  exemplo.png - // Exemplo de resultado
  palmilha -
  base.png; // Base da palmilha
```

## 🚀 Otimização e Performance

### Estratégias de Loading

#### **Lazy Loading**

```tsx
// Componente com lazy loading
import { useState } from "react";

export function LazyMedicalImage({ src, alt, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
```

#### **Preload de Imagens Críticas**

```tsx
// Hook para preload de imagens importantes
import { useEffect } from "react";

export function usePreloadImages(imagePaths: string[]) {
  useEffect(() => {
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, [imagePaths]);
}

// Uso no componente principal
const CRITICAL_IMAGES = [
  "/assets/images/common/pe-esquerdo.png",
  "/assets/images/common/pe-direito.png",
];

export function MultiStepForm() {
  usePreloadImages(CRITICAL_IMAGES);
  // resto do componente...
}
```

### Compressão e Formatos

#### **Next.js Image Optimization**

```tsx
import Image from "next/image";

export function OptimizedMedicalImage({ src, alt, width, height }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      className="rounded-lg"
    />
  );
}
```

## 📋 Gestão de Assets

### Versionamento

#### **Convenção de Versionamento**

```
retrope-01-v2.png    // Versão 2 da imagem
retrope-01-old.png   // Versão anterior (backup)
retrope-01.png       // Versão atual
```

### Backup e Redundância

#### **Estrutura de Backup**

```
assets/
├── images/
│   └── (arquivos atuais)
└── backup/
    ├── 2024-01/
    ├── 2024-02/
    └── current/
        └── (backup da versão atual)
```

### Workflow de Atualização

#### **Processo de Adição de Imagens**

1. **Otimização**: Comprimir e otimizar para web
2. **Nomenclatura**: Seguir convenções estabelecidas
3. **Teste**: Validar em diferentes dispositivos
4. **Commit**: Versionar no git com descrição clara
5. **Deploy**: Atualizar em produção

## 🔄 Futuras Expansões

### Imagens Planejadas

#### **Antepé (Etapa 12)**

```
assets/images/antepes/
├── antepe-metatarso-01.png
├── antepe-metatarso-02.png
├── antepe-dedos-01.png
└── antepe-alivio-central.png
```

#### **Médiopé (Etapa 13)**

```
assets/images/mediopés/
├── mediope-arco-baixo.png
├── mediope-arco-normal.png
├── mediope-arco-alto.png
└── mediope-suporte-plantar.png
```

#### **Documentos e Templates**

```
assets/documents/
├── templates/
│   ├── prescricao-template.pdf
│   └── relatorio-template.pdf
└── examples/
    ├── prescricao-antepe-exemplo.pdf
    └── prescricao-retrope-exemplo.pdf
```

## 🎯 Melhores Práticas

### Performance

- ✅ Use formatos WebP quando possível
- ✅ Implemente lazy loading para imagens não críticas
- ✅ Comprima imagens mantendo qualidade médica necessária
- ✅ Use CDN para distribuição global

### Acessibilidade

- ✅ Forneça alt text descritivo e médico
- ✅ Use contrast ratio adequado
- ✅ Implemente zoom para imagens médicas
- ✅ Suporte para leitores de tela

### Manutenibilidade

- ✅ Mantenha estrutura organizada por especialidade
- ✅ Use nomenclatura consistente e intuitiva
- ✅ Versione imagens importantes
- ✅ Documente mudanças significativas

---

**Esta estrutura garante organização, performance e escalabilidade para todos os recursos visuais do sistema.**
