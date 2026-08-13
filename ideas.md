# Black Void — Contrato de Direção de Arte

## Abordagens consideradas

### 1. Arquivo do Vazio

Um estúdio de tecnologia tratado como uma instituição editorial: carvão, osso, vermelho mineral, tipografia monumental, índices, notas marginais e imagens como artefatos de pesquisa.

**Probability:** 0.08

### 2. Câmara de Operações

Uma linguagem mais técnica e operacional, com painéis, telemetria, grids de engenharia, dados e animações de instrumentação. A marca seria percebida como uma máquina sofisticada em funcionamento.

**Probability:** 0.04

### 3. Teatro Pós-Humano

Uma direção mais cenográfica e experimental, com volumes escultóricos, luz vermelha, silhuetas abstratas e capítulos dramatizados sobre o futuro do trabalho.

**Probability:** 0.06

## Direção escolhida — Arquivo do Vazio

### Design Movement

Editorialismo de arquivo com brutalismo refinado, tipografia de campanha, materialidade de impressão e um campo tecnológico silencioso. A Black Void deve parecer simultaneamente um laboratório, uma casa editorial e uma equipe capaz de operar sistemas complexos.

### Core Principles

1. **A marca é um sistema, não um slogan.** Cada página deve mostrar como IA, software, automação, cloud, segurança e design se conectam.
2. **Tipografia é infraestrutura visual.** Headlines grandes, serifadas e expressivas comandam o ritmo; sans funcional e mono reservado organizam contexto.
3. **O vermelho é uma decisão.** Vermelho oxidado aparece em pontos de tensão, estados ativos, números de capítulo e CTAs; não como preenchimento decorativo.
4. **A interface deve ter matéria.** Granulação, linhas finas, blocos de osso, recortes, imagens com sombra e falhas controladas criam um universo próprio sem sacrificar clareza.

### Color Philosophy

O quase-preto `#0A0A09` cria concentração. O osso `#E9E4D8` abre a leitura e tira o site do clichê “tech dark”. O vermelho `#B83A2F` é o sinal proprietário: ação, alerta, energia e prioridade. O metal fosco `#A78D63` aparece em microdetalhes, números e estados de navegação. Cinzas quentes fazem o sistema respirar.

### Layout Paradigm

Construir páginas como sequências de cenas e não como listas de cards. Cada rota deve possuir um hero de tese, uma entrada de capítulo, uma prova visual, uma zona de densidade e uma decisão final. Usar grids assimétricos, margens amplas, eixos laterais e mudanças de superfície. A informação técnica deve parecer curada como uma página de catálogo, não despejada em um dashboard.

### Signature Elements

1. **Índice lateral** com número de capítulo, rota atual e linha de progresso.
2. **Headline como objeto**: serif display enorme, cortes de linha ousados e uma única palavra em vermelho ou contorno.
3. **Sistema de prova** com metadados, números, tags e legendas pequenas em caixa alta, sempre alinhados a regras finas.

### Interaction Philosophy

As interações devem parecer instrumentos de consulta: revelar uma camada, expandir uma nota, atravessar uma relação ou marcar uma decisão. Hover, foco e scroll têm causa e consequência; não haverá efeitos de cursor, glitch, partículas ou movimento permanente sem função. A versão sem animação continuará completa.

### Animation

Usar entrada de capítulos com opacidade e deslocamento curto, números que contam quando entram em foco, linhas que se desenham, transições de navegação e parallax mínimo em assets. Durações entre 350ms e 900ms, easing suave, e `prefers-reduced-motion` tratado como estado de primeira classe.

### Typography System

Usar **Instrument Serif** para headlines, manifestos, nomes de serviços e números de grande escala. Usar **Manrope** para navegação, corpo, botões e legendas. Usar **Space Mono** apenas para dados, coordenadas, status e códigos de capítulo. Evitar Inter e Space Grotesk como fontes principais para diferenciar o sistema atual.

### Brand Essence

**Posicionamento:** Black Void constrói a camada de inteligência, software e infraestrutura que permite a empresas operar com mais clareza e menos fricção.  
**Personalidade:** preciso, profundo, inquietante.

### Brand Voice

Headlines devem ser curtas, específicas e com um pouco de tensão. CTAs convidam à investigação ou à decisão, não usam preenchimento genérico. Microcopy pode soar como arquivo técnico, desde que continue humano e legível.

**Exemplo de headline:** “A complexidade não precisa aparecer.”  
**Exemplo de CTA:** “Abrir o ecossistema”.

### Wordmark & Logo

Preservar o símbolo existente como marca-base, mas tratá-lo como selo editorial em vez de ícone tech. O wordmark deve aparecer em caixa alta com espaçamento contido e a palavra VOID pode receber o vermelho apenas em contextos de assinatura. Não desenhar uma marca nova por cima do patrimônio existente.

### Signature Brand Color

**Vermelho mineral — `#B83A2F`.** Usar em CTAs, links ativos, bordas de foco, capítulos e dados-chave.

## Arquitetura de rotas

| Grupo | Rotas | Tratamento |
| --- | --- | --- |
| Principal | `/`, `ecossistema`, `kira`, `servicos`, `portfolio`, `casos`, `contato` | Reescrever como páginas de campanha, com narrativa e conversão. |
| Marca | `sobre`, `team`, `carreira`, `blog`, `recursos`, `faq` | Completar com conteúdo editorial e estados reais, removendo placeholders. |
| Produto e operação | `planos`, `tecnologias`, `infraestrutura`, `cybersecurity`, `ia`, `automacao`, `desenvolvimento`, `branding` | Substituir redirecionamentos por páginas próprias, usando o sistema de capítulos. |
| Documentação | `docs/*`, `documentacao` | Manter densidade técnica, mas aplicar a mesma tipografia, navegação e hierarquia visual. |
| Exceções | `404`, `em-breve`, microsite Arthur | Tratar como experiências próprias, mas coerentes com o arquivo Black Void. |

## Style Decisions

- A direção é **Arquivo do Vazio**: editorial, tecnológica, precisa, escura e com vermelho mineral em tensão.
- O par tipográfico principal é **Instrument Serif + Manrope**, com **Space Mono** apenas para metadados.
- O site inteiro deve parecer um organismo de páginas relacionadas, não um conjunto de templates independentes.
