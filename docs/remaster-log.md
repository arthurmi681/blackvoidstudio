# Black Void — Diário de remasterização

## Passo 01 — Auditoria do pacote

O projeto tinha 40 documentos HTML, três folhas de estilo, onze scripts e dependências visuais espalhadas entre a raiz, o microsite de Arthur e URLs remotas. O problema crítico encontrado foi a dependência de `/manus-storage/`, que não existia no pacote estático e fazia a imagem principal aparecer apenas como texto alternativo.

## Passo 02 — Contrato de direção

O site foi reorganizado sob o conceito **Arquivo Vivo**. A arquitetura emocional passou a seguir assombro, reconhecimento, prova, pertencimento e convite. Cada família de página ganhou uma função narrativa e uma cena própria, documentadas em `remaster-book.md` e `page-states.md`.

## Passo 03 — Sistema visual e assets

Os assets críticos passaram a ser locais. Foram adicionados três SVGs autorais — órbita, fragmento e sinal — e foram estabilizadas imagens locais para retrato, cultura, processo e atmosfera urbana. O sistema de tipografia continua usando Instrument Serif, Manrope e Space Mono, com carvão, osso, vermelho mineral e metal fosco.

## Passo 04 — Homepage-manifesto

A homepage deixou de ser uma página institucional com blocos previsíveis. Ela agora é uma sequência de abertura, manifesto, organismo, citação, disciplinas, pertencimento e pergunta final. Também foi corrigido o shell de raiz: antes a homepage carregava caminhos de página interna e ficava branca; agora CSS, componentes, scripts e imagens apontam para suas localizações reais.

## Passo 05 — Páginas por família

Ecossistema recebeu um atlas orbital; Kira, um console de decisão; Serviços, uma roda de disciplinas; IA, Automação, Desenvolvimento, Infraestrutura, Cybersecurity e Branding, estudos de fluxo; Portfólio e Cases, um registro de tensão, decisão e permanência; Sobre, Team, Carreira e Blog, uma camada de cultura; Recursos, FAQ, Planos, Tecnologias e Documentação, um arquivo de continuidade.

## Passo 06 — Validação

O validador ampliado percorreu 39 documentos HTML, encontrou 294 links internos sem ausências e confirmou `missing_images=0`. A sintaxe dos scripts JavaScript passou em `node --check`, a varredura não encontrou `/manus-storage/`, fontes legadas ou placeholders, e a navegação manual confirmou carregamento visual na homepage, ecossistema, portfólio, documentação, “em breve” e 404.

