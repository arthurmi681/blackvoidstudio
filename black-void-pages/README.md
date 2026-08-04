# Em Breve + 404 — HTML/CSS/JS puro

Duas páginas standalone (cada uma com HTML, CSS e JS no mesmo arquivo), sem build step,
Three.js vanilla carregado via CDN por import map. Mesma identidade visual do resto do
projeto: preto `#050505`, branco `#ffffff`, vermelho `#8c1710`, void-grid shader + fresnel
glow, animação de entrada em GSAP com easing custom.

## Arquivos
- `em-breve.html` — void-grid + núcleo de glow pulsando, captura de e-mail funcional
  (faz `POST /api/subscribe` — aponte pro seu endpoint real antes de publicar).
- `404.html` — só o void-grid (sem núcleo de glow, pra carregar mais rápido), glitch no
  "404" em CSS puro (clip-path + keyframes, sem shader extra).

## Como usar
Suba os dois arquivos direto no servidor/hosting estático que o resto do site já usa.
Se o projeto tem uma versão pinada específica de `three` ou `gsap`, troca as versões nos
`<script>`/import map do topo de cada arquivo pra bater com a do resto do projeto — hoje
estão em `three@0.160.0` e `gsap@3.12.5`.

Se as fontes do site (Space Grotesk / Inter, ou outras) já vêm de um CDN ou de arquivos
locais em outra página do projeto, adiciona o `<link>` ou `@font-face` correspondente —
aqui ficou com fallback de sistema pra não travar em nada externo.
