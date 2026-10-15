# Roteamento de crawlers de IA — blackvoid.dev

## Objetivo

- Visitantes **humanos** acessam `https://blackvoid.dev/` e recebem a página inicial
  (`home.html`), sem nenhuma mudança perceptível.
- **Crawlers de IA reconhecidos** (GPTBot, ClaudeBot, PerplexityBot etc.) que acessam `/`
  recebem transparentemente o conteúdo de `pages/ia-crawler.html` — URL permanece `/`,
  status 200. O mesmo vale para `/index.html` e `/home.html` acessados diretamente.

## Por que a versão anterior não funcionava

1. **`middleware.ts` nunca executava.** O projeto é um site estático puro
   (`"framework": null`, `buildCommand` é um `echo` no-op). Nessa configuração a Vercel
   não compila um `middleware.ts` na raiz — esse convenção exige Next.js ou a Build Output
   API. O arquivo era código morto e foi removido.
2. **Não existe `index.html` na raiz.** Sem middleware e sem `index.html`, `/` não tinha
   conteúdo estático para servir nessa estrutura.
3. Restaurar `index.html` não resolve: em projetos estáticos na Vercel o **filesystem tem
   precedência sobre rewrites** — um `index.html` existente em `/` impediria qualquer
   rewrite na raiz, incluindo o condicional por User-Agent. Por isso a página inicial
   permanece como `home.html` e o roteamento é feito por rewrites.

## Solução (somente `vercel.json`, sem runtime e sem dependências)

Rewrites condicionais com `has` no header `user-agent`, avaliados pelo roteador de borda
da Vercel (sem função serverless, sem build):

```
/            + UA de IA  →  /pages/ia-crawler.html
/index.html  + UA de IA  →  /pages/ia-crawler.html
/            + demais    →  /home.html          (fallback humano)
/index.html  + demais    →  /home.html          (links antigos continuam válidos)
```

- Regras avaliadas em ordem; a primeira que casa vence. O fallback humano fica por último.
- **Precedência do filesystem:** na Vercel, arquivos existentes vencem rewrites. Por isso
  (1) não pode existir `index.html` na raiz, senão `/` serviria o arquivo e ignoraria o
  rewrite condicional; e (2) um acesso **direto** a `/home.html` ou `/pages/ia-crawler.html`
  serve sempre o arquivo, independente do User-Agent — comportamento idêntico ao anterior.
  Sem `robots.txt`, bots educados não buscam `/home.html` (está sob `Disallow: /` para eles).
- Como cada variante aponta para um **arquivo de destino diferente**, o cache da CDN fica
  segmentado por destino (sem contaminação cruzada entre bot e humano). A resposta de `/`
  também leva `Vary: User-Agent` para caches intermediários.
- Bots recebem ainda `X-Robots-Tag: index, follow`, `Cache-Control` espelhando
  `/ia-crawler.html` e o header de diagnóstico `X-Served-Content: ia-crawler`
  (ausente para humanos — útil para verificar o roteamento com `curl -I`).

## Lista de crawlers reconhecidos

O regex de User-Agent é o mesmo em todas as regras com `has` e reflete a política já
documentada em `robots.txt` (blocos com `Allow: /ia-crawler.html`) unida à lista que
existia no middleware removido:

```
.*(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|Claude-SearchBot|anthropic-ai|
PerplexityBot|Perplexity-User|Google-Extended|VertexAI|Gemini|Bard|bingbot|Bingbot|MSNBot|
Microsoft-Web-Exploration|Meta-ExternalAgent|Meta-ExternalFetcher|facebookexternalhit|
Applebot|AppleBot|CohereBot|MistralBot|HuggingFaceBot|Bytespider|YouBot|DuckDuckBot|PetalBot).*

(`MSNBot` está escrito como `[Mm][Ss][Nn][Bb]ot` no vercel.json porque o match é
case-sensitive e os UAs legados usam `msnbot` minúsculo.)
```

Notas de manutenção:

- O match é **case-sensitive** e exige correspondência total do header (por isso o `.*` nas
  duas pontas). Ao adicionar um token, replique o regex em todas as regras `has`.
- Crawlers de **busca tradicional** (Googlebot, SemrushBot, AhrefsBot…) **não** estão na
  lista e continuam vendo a página humana — isso evita *cloaking* SEO. Atenção: `bingbot`,
  `MSNBot` e `DuckDuckBot` são híbridos (busca + IA) e estão incluídos por decisão já
  expressa no `robots.txt`; removê-los do regex os devolve à página humana.
- Tokens ausentes que podem ser avaliados no futuro: `CCBot`, `Amazonbot`, `cohere-ai`,
  `Claude-User`, `MistralAI-User`, `Applebot-Extended`.

## Como testar

```bash
# Humano → home.html ("ARQUIVO VIVO")
curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36" https://blackvoid.dev/

# IA → pages/ia-crawler.html ("ARQUIVO PARA SISTEMAS DE IA" + header X-Served-Content)
curl -sI -A "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" https://blackvoid.dev/
curl -s  -A "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" https://blackvoid.dev/

# Busca tradicional continua na página humana
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://blackvoid.dev/
```

Validação local antes de deploy: `python3 validate_site.py`.
