#!/usr/bin/env bash
# Smoke test do roteamento por User-Agent em um preview da Vercel (ou produção).
#
# Uso:
#   ./scripts/smoke-preview.sh https://blackvoidstudio-xxxx.vercel.app
#   ./scripts/smoke-preview.sh https://blackvoid.dev          # após deploy em produção
#
# Se o preview estiver atrás da "Vercel Authentication" (Deployment Protection),
# use o segredo de "Protection Bypass for Automation" do painel Vercel:
#   BYPASS=seu-segredo ./scripts/smoke-preview.sh https://blackvoidstudio-xxxx.vercel.app
#
# Verifica: humanos/buscadores -> home.html | crawlers de IA -> pages/ia-crawler.html
# (a URL / permanece a mesma; o roteamento é feito por rewrites no vercel.json).

set -u
BASE="${1:?informe a URL base (sem barra no final)}"
BASE="${BASE%/}"

CURL_AUTH=()
if [ -n "${BYPASS:-}" ]; then
  CURL_AUTH=(-H "x-vercel-protection-bypass: $BYPASS" -H "x-vercel-set-bypass-cookie: true")
fi

_curl() { curl "${CURL_AUTH[@]}" "$@"; }

BROWSER="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
SAFARI="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15"
GOOGLEBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
SEMRUSH="Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)"
GPTBOT="Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)"
OAISEARCH="OAI-SearchBot/1.0 (+https://openai.com/searchbot)"
CLAUDEBOT="Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)"
PERPLEX="Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"
BINGBOT="Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
APPLEBOT="Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)"

HOME_MARK="ARQUIVO VIVO"                 # marcador da página inicial (home.html)
IA_MARK="ARQUIVO PARA SISTEMAS DE IA"    # marcador de pages/ia-crawler.html
FAILS=0

check() { # $1 path, $2 UA, $3 home|ia, $4 rótulo
  local path="$1" ua="$2" expect="$3" label="$4"
  local body status mark
  body=$(_curl -s -m 20 -A "$ua" "$BASE$path")
  status=$(_curl -s -o /dev/null -w "%{http_code}" -m 20 -A "$ua" "$BASE$path")
  mark="$HOME_MARK"; [ "$expect" = "ia" ] && mark="$IA_MARK"
  if [ "$status" = "200" ] && printf '%s' "$body" | grep -q "$mark"; then
    echo "PASS [$expect] $label $path (HTTP $status)"
  else
    echo "FAIL [$expect] $label $path (HTTP $status, marcador '$mark' ausente)"
    FAILS=$((FAILS+1))
  fi
}

echo "== Humanos e crawlers de busca/SEO -> página inicial =="
check "/home.html"   "$BROWSER"   home "Chrome (direto)"
check "/"            "$BROWSER"   home "Chrome"
check "/"            "$SAFARI"    home "Safari"
check "/index.html"  "$BROWSER"   home "Chrome"
check "/"            "$GOOGLEBOT" home "Googlebot (busca)"
check "/"            "$SEMRUSH"   home "SemrushBot (SEO)"

echo "== Crawlers de IA -> pages/ia-crawler.html (URL preservada) =="
check "/"           "$GPTBOT"    ia "GPTBot"
check "/"           "$OAISEARCH" ia "OAI-SearchBot"
check "/"           "$CLAUDEBOT" ia "ClaudeBot"
check "/"           "$PERPLEX"   ia "PerplexityBot"
check "/"           "$BINGBOT"   ia "bingbot"
check "/"           "$APPLEBOT"  ia "Applebot"
check "/index.html" "$GPTBOT"    ia "GPTBot"
check "/home.html"  "$GPTBOT"    ia "GPTBot"

echo "== Endereços diretos da página de IA (qualquer UA) =="
check "/ia-crawler"      "$BROWSER" ia "humano em /ia-crawler"
check "/ia-crawler.html" "$BROWSER" ia "humano em /ia-crawler.html"

echo "== Headers de diagnóstico =="
H_BOT=$(_curl -sI -m 20 -A "$GPTBOT" "$BASE/")
H_HUM=$(_curl -sI -m 20 -A "$BROWSER" "$BASE/")
printf '%s\n' "$H_BOT" | grep -qi '^x-served-content: ia-crawler' \
  && echo "PASS header x-served-content=ia-crawler (GPTBot)" \
  || { echo "FAIL header x-served-content ausente (GPTBot)"; FAILS=$((FAILS+1)); }
printf '%s\n' "$H_BOT" | grep -qi '^x-robots-tag: index, follow' \
  && echo "PASS header x-robots-tag (GPTBot)" \
  || { echo "FAIL header x-robots-tag ausente (GPTBot)"; FAILS=$((FAILS+1)); }
printf '%s\n' "$H_BOT" | grep -qi '^vary:.*user-agent' \
  && echo "PASS header vary: user-agent (GPTBot)" \
  || { echo "FAIL header vary: user-agent ausente (GPTBot)"; FAILS=$((FAILS+1)); }
printf '%s\n' "$H_HUM" | grep -qi '^x-served-content' \
  && { echo "FAIL header x-served-content vazou para humano"; FAILS=$((FAILS+1)); } \
  || echo "PASS sem x-served-content (humano)"

echo "== Isolamento de cache: bot primeiro, depois humano 2x =="
_curl -s -m 20 -A "$GPTBOT" "$BASE/" > /dev/null
B1=$(_curl -s -m 20 -A "$BROWSER" "$BASE/")
B2=$(_curl -s -m 20 -A "$BROWSER" "$BASE/")
if printf '%s' "$B1" | grep -q "$HOME_MARK" && printf '%s' "$B2" | grep -q "$HOME_MARK"; then
  echo "PASS humano recebe home mesmo após hit de bot (cache isolado)"
else
  echo "FAIL contaminação de cache: humano recebeu página de IA"
  FAILS=$((FAILS+1))
fi

echo "== Saúde geral do site =="
for p in /pages/sobre.html /pages/contato.html /pages/assets/css/style.css /pages/assets/img/logo.png /components/include.js /agent/kira.js /robots.txt /sitemap.xml; do
  code=$(_curl -s -o /dev/null -w "%{http_code}" -m 20 -A "$BROWSER" "$BASE$p")
  if [ "$code" = "200" ]; then echo "PASS $p (HTTP $code)"; else echo "FAIL $p (HTTP $code)"; FAILS=$((FAILS+1)); fi
done
code=$(_curl -s -o /dev/null -w "%{http_code}" -m 20 -A "$BROWSER" "$BASE/branding")
case "$code" in 2*|3*) echo "PASS /branding proxy TMS (HTTP $code)";; *) echo "WARN /branding proxy TMS (HTTP $code)";; esac

echo "== Resumo =="
if [ "$FAILS" -eq 0 ]; then echo "TODOS OS TESTES PASSARAM"; exit 0; else echo "$FAILS teste(s) falharam"; exit 1; fi
