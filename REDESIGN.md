# Black Void Studio — Redesign editorial

## O que mudou

O site foi reestruturado como um **Arquivo Vivo**: uma experiência editorial de tecnologia com Instrument Serif para títulos, Manrope para interface e Space Mono para metadados. A paleta combina carvão, osso, vermelho mineral e metal fosco; textura, regras finas, índices, cenas assimétricas e silêncio substituem a leitura de template genérico.

O design system compartilhado foi refeito em `pages/assets/css/style.css`, os componentes de navegação foram limpos e as interações globais passaram a usar um único núcleo em `pages/assets/js/main.js`, com menu mobile, estado ativo, reveal, contadores e suporte a movimento reduzido.

## Páginas concluídas

As rotas principais agora possuem conteúdo editorial completo: ecossistema, Kira AI, serviços, portfólio, cases, contato, sobre, team, carreira, blog, recursos, FAQ, planos, tecnologias, infraestrutura, cybersecurity, IA, automação, desenvolvimento, branding, documentação e Starter. As páginas de documentação também receberam uma hierarquia coerente com o restante do site, sem placeholders ou redirects provisórios.

O microsite React de Arthur continua isolado em `equipe/arthur`, enquanto `pages/arthur.html` agora funciona como uma entrada editorial integrada ao arquivo principal.

## Assets visuais

As páginas usam apenas assets locais verificáveis. Foram adicionados `void-orbit.svg`, `void-signal.svg` e `void-fragment.svg` como cenas vetoriais autorais; retrato, cultura, processo e atmosfera urbana usam arquivos locais em `pages/assets/img/`. O pacote não depende de `/manus-storage/` e não apresenta alt text como substituto de imagem.

## Validação

O validador `validate_site.py` percorre as páginas estáticas, verifica links e imagens locais e falha quando encontra referências inexistentes. Na última execução, foram verificados 39 documentos HTML, 294 links internos, `missing=0` e `missing_images=0`. Também foi feita uma varredura final por placeholders, redirects provisórios, dependências visuais remotas e fontes legadas.

O diário completo da reconstrução está em `docs/remaster-log.md`; o contrato visual está em `docs/remaster-book.md`; e o mapa de páginas e assets está em `docs/page-states.md`.

## Uso local

Para testar a camada estática, sirva a pasta raiz com qualquer servidor HTTP. Por exemplo: `python3 -m http.server 8787`. Para editar as páginas geradas, altere os dados em `build_site.py` e execute o script novamente. O microsite de Arthur possui seu próprio `package.json` em `equipe/arthur`.
