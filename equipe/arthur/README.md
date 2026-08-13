# SIGNAL / VOID — Arthur Miyazaki

Portfólio cinematográfico 3D criado para Arthur Miyazaki, Full Stack & AI Engineer e fundador da Black Void.

## Rodar localmente

Requer Node.js 20+.

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

O build é escrito em `release/`.

## Módulos da experiência

| Módulo | Função narrativa | Impacto esperado | Pré-requisito |
|---|---|---|---|
| `ExperienceCanvas` | Camada WebGL persistente, câmera, luz e pós-processamento | Chunk 3D lazy; DPR adaptativo; 1 Canvas | WebGL2; fallback 2D automático |
| `SignalThread` | Protagonista procedural que muda ao longo dos capítulos | 3 tubos compartilhando 1 geometria; ~22 nós instanciados | Three.js / R3F |
| `SignalDust` | Profundidade atmosférica discreta | 180 pontos em 1 draw call | Canvas ativo |
| `useExperienceScroll` | Sincroniza scroll, capítulos e reveals | GSAP + Lenis em chunks separados | DOM montado |
| `LoadingScreen` | Primeira cena e proteção contra layout incompleto | CSS apenas; não bloqueia assets extras | HTML/CSS crítico |
| Seções HTML | Conteúdo, SEO, acessibilidade e fallback integral | Render estático; sem dependência do Canvas | Nenhum |

## Decisões de performance

- Canvas carregado com `React.lazy` após o JavaScript inicial.
- Imagens convertidas dos PNGs originais para WebP: conjunto completo com cerca de 300 KB.
- Sem modelo GLB: o Signal Thread é procedural.
- Geometria compartilhada entre os três estados visuais do fio.
- Nós luminosos usam `InstancedMesh`.
- Nenhum objeto Three.js é criado dentro do render loop.
- DPR reduzido automaticamente pelo `PerformanceMonitor`.
- Pós-processamento desativado no mobile e em preferência de dados reduzidos.
- `prefers-reduced-motion`, controle FX e fallback sem WebGL.
- Todo conteúdo importante permanece em HTML semântico.

## Estrutura principal

```text
src/
├── components/   # loading, navegação e progresso
├── core/         # Canvas e controle de performance
├── hooks/        # scroll, WebGL e preferências de movimento
├── scenes/       # Signal Thread e atmosfera 3D
├── sections/     # sete capítulos do portfólio
└── styles/       # sistema visual e responsividade
```

## Conteúdo editável

- Produtos: `src/sections/Systems.tsx`
- Competências: `src/sections/Architecture.tsx`
- Experiência: `src/sections/Experience.tsx`
- Contatos: `src/sections/Contact.tsx`
- Paleta e layout: `src/styles/global.css`
- Fotografias e currículo: `public/`
